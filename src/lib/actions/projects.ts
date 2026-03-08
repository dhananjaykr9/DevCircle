"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { initiateConversation, sendMessage } from "./messages";

export async function applyToProject(projectId: string, authorId: string, projectTitle: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Must be logged in to apply");

    const userId = session.user.id;
    if (userId === authorId) throw new Error("You cannot apply to your own project");

    // Initiate DM
    const convResult = await initiateConversation(userId, authorId);
    if (!convResult.success || !convResult.conversationId) {
        throw new Error("Failed to initiate conversation");
    }

    // Send the first message automatically
    await sendMessage(
        convResult.conversationId,
        userId,
        `Hi! I'm interested in applying for your project: **${projectTitle}**.`
    );

    revalidatePath("/messages");
    redirect(`/messages/${convResult.conversationId}`);
}
