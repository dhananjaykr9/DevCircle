"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";

export async function createJob(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Must be logged in to post a job");

    const title = formData.get("title") as string;
    const company = formData.get("company") as string;
    const description = formData.get("description") as string;
    const type = formData.get("type") as string;
    const techStack = formData.get("techStack") as string;
    const experience = formData.get("experience") as string;
    const applyUrl = formData.get("applyUrl") as string;
    const salary = formData.get("salary") as string;
    const isRemote = formData.get("isRemote") === "on";
    const cityId = formData.get("cityId") as string;

    if (!title || !company || !description || !type || !cityId) {
        throw new Error("Missing required fields");
    }

    await prisma.job.create({
        data: {
            title,
            company,
            description,
            type,
            techStack: techStack || "",
            experience: experience || "Any",
            applyUrl: applyUrl || null,
            salary: salary || null,
            isRemote,
            posterId: session.user.id,
            cityId,
        },
    });

    revalidatePath("/jobs");
    redirect("/jobs");
}

export async function createPoll(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Must be logged in to create a poll");

    const question = formData.get("question") as string;
    const description = formData.get("description") as string;
    const cityId = formData.get("cityId") as string;
    const endsAtStr = formData.get("endsAt") as string;

    if (!question || !cityId) throw new Error("Missing required fields");

    // Collect options (option1, option2, ... up to 6)
    const options: string[] = [];
    for (let i = 1; i <= 6; i++) {
        const opt = formData.get(`option${i}`) as string;
        if (opt?.trim()) options.push(opt.trim());
    }
    if (options.length < 2) throw new Error("At least 2 options are required");

    await prisma.poll.create({
        data: {
            question,
            description: description || null,
            endsAt: endsAtStr ? new Date(endsAtStr) : null,
            authorId: session.user.id,
            cityId,
            options: {
                create: options.map((text) => ({ text })),
            },
        },
    });

    revalidatePath("/polls");
    redirect("/polls");
}

export async function votePoll(pollOptionId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Must be logged in to vote");

    const userId = session.user.id;

    // Get the poll this option belongs to
    const option = await prisma.pollOption.findUnique({
        where: { id: pollOptionId },
        include: { poll: { include: { options: true } } },
    });
    if (!option) throw new Error("Option not found");

    // Check if poll has expired
    if (option.poll.endsAt && new Date(option.poll.endsAt) < new Date()) {
        throw new Error("This poll has expired");
    }

    // Check if user already voted on ANY option in this poll
    const allOptionIds = option.poll.options.map((o) => o.id);
    const existingVote = await prisma.pollVote.findFirst({
        where: { userId, pollOptionId: { in: allOptionIds } },
    });

    if (existingVote) {
        // Allow changing vote: delete old, create new
        await prisma.$transaction([
            prisma.pollVote.delete({ where: { id: existingVote.id } }),
            prisma.pollVote.create({ data: { userId, pollOptionId } }),
        ]);
    } else {
        await prisma.pollVote.create({ data: { userId, pollOptionId } });
    }

    revalidatePath("/polls");
}
