"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";

export async function updateProfile(formData: FormData) {
    const session = await auth();

    if (!session?.user?.id) {
        throw new Error("You must be logged in to update your profile.");
    }

    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const company = formData.get("company") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const experienceLevel = formData.get("experienceLevel") as string;
    const skills = formData.get("skills") as string;
    const interests = formData.get("interests") as string;
    const github = formData.get("github") as string;
    const portfolioUrl = formData.get("portfolioUrl") as string;
    const image = formData.get("image") as string;

    // Checkboxes come through as "on" if checked, otherwise null
    const openToMentoring = formData.get("openToMentoring") === "on";
    const openToCollaborate = formData.get("openToCollaborate") === "on";

    await prisma.user.update({
        where: { id: session.user.id },
        data: {
            name: name || undefined,
            bio: bio || null,
            company: company || null,
            jobTitle: jobTitle || null,
            experienceLevel: experienceLevel || null,
            skills: skills || null,
            interests: interests || null,
            github: github || null,
            portfolioUrl: portfolioUrl || null,
            image: image || null,
            openToMentoring,
            openToCollaborate,
        }
    });

    revalidatePath("/profile");
    revalidatePath("/network");
}
