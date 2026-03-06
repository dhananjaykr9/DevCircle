"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { addReputation, awardBadge, checkAndAwardBadges } from "@/lib/reputation";

export async function createDiscussion(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Must be logged in to create a discussion");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const tags = formData.get("tags") as string;
    const cityId = formData.get("cityId") as string;
    const postType = (formData.get("postType") as string) || "Discussion";

    if (!title || !content || !category || !cityId) {
        throw new Error("Missing required fields");
    }

    await prisma.post.create({
        data: {
            title,
            content,
            preview: content.substring(0, 150),
            category,
            postType,
            tags: tags || "",
            authorId: session.user.id,
            cityId,
        }
    });

    // Award first-post badge and check all badge thresholds
    await checkAndAwardBadges(session.user.id);

    revalidatePath("/discussions");
    redirect("/discussions");
}

export async function createProject(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Must be logged in to post a project");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const techStack = formData.get("techStack") as string;
    const lookingFor = formData.get("lookingFor") as string;
    const cityId = formData.get("cityId") as string;
    const repositoryUrl = formData.get("repositoryUrl") as string | null;

    if (!title || !description || !type || !cityId) {
        throw new Error("Missing required fields");
    }

    await prisma.project.create({
        data: {
            title,
            description,
            type,
            status: "Recruiting",
            techStack: techStack || "",
            lookingFor: lookingFor || "",
            repositoryUrl: repositoryUrl || null,
            teamSize: 1,
            authorId: session.user.id,
            cityId,
        }
    });

    await awardBadge(session.user.id, "collaborator");

    revalidatePath("/projects");
    redirect("/projects");
}

export async function createEvent(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Must be logged in to host an event");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const dateStr = formData.get("date") as string;
    const time = formData.get("time") as string;
    const venue = formData.get("venue") as string;
    const capacityStr = formData.get("capacity") as string;
    const fee = formData.get("fee") as string || "Free";
    const cityId = formData.get("cityId") as string;

    if (!title || !description || !dateStr || !time || !venue || !capacityStr || !cityId) {
        throw new Error("Missing required fields");
    }

    const capacity = parseInt(capacityStr, 10);
    const date = new Date(dateStr);

    await prisma.event.create({
        data: {
            title,
            description,
            type,
            date,
            time,
            venue,
            capacity,
            fee,
            organizerId: session.user.id,
            cityId,
        }
    });

    revalidatePath("/events");
    redirect("/events");
}

export async function toggleUpvote(postId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Must be logged in to upvote");
    }

    const userId = session.user.id;

    const existing = await prisma.upvote.findUnique({
        where: { postId_userId: { postId, userId } },
    });

    if (existing) {
        await prisma.upvote.delete({ where: { postId_userId: { postId, userId } } });
    } else {
        await prisma.upvote.create({ data: { postId, userId } });
        // Award reputation to post author (triggers badge checks)
        const post = await prisma.post.findUnique({ where: { id: postId }, select: { authorId: true } });
        if (post && post.authorId !== userId) {
            await addReputation(post.authorId, 1);
        }
    }

    revalidatePath("/discussions");
}

export async function toggleRsvp(eventId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Must be logged in to RSVP");
    }

    const userId = session.user.id;

    const existing = await prisma.rsvp.findUnique({
        where: { eventId_userId: { eventId, userId } },
    });

    if (existing) {
        await prisma.rsvp.delete({ where: { eventId_userId: { eventId, userId } } });
    } else {
        // Check capacity before RSVPing
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { _count: { select: { rsvps: true } } },
        });
        if (!event) throw new Error("Event not found");
        if (event._count.rsvps >= event.capacity) {
            throw new Error("This event is at full capacity");
        }
        await prisma.rsvp.create({ data: { eventId, userId } });
        // Check for community-builder badge (5+ RSVPs)
        await checkAndAwardBadges(userId);
    }

    revalidatePath("/events");
}
