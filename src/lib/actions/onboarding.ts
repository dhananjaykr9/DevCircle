"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";

export async function completeOnboarding(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "Not authenticated" };
    }

    const cityId = formData.get("cityId") as string;
    const experienceLevel = formData.get("experienceLevel") as string;
    const skills = formData.get("skills") as string;
    const interests = formData.get("interests") as string;

    if (!cityId || !experienceLevel || !skills || !interests) {
        return { error: "All fields are required" };
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                cityId,
                experienceLevel,
                skills,
                interests,
                onboarded: true
            }
        });
        return { success: true };
    } catch (e) {
        return { error: "Failed to save profile data" };
    }
}
