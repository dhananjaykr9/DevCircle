"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function submitResource(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Must be logged in to submit a resource");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    const category = formData.get("category") as string;
    const techStack = formData.get("techStack") as string;

    if (!title || !description || !url || !category || !techStack) {
        throw new Error("Missing required fields");
    }

    await prisma.resource.create({
        data: {
            title,
            description,
            url,
            category,
            techStack,
            submitterId: session.user.id
        }
    });

    revalidatePath("/learning");
    return { success: true };
}
