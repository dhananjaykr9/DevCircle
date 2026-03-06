"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendMessage(conversationId: string, senderId: string, text: string) {
    if (!text || text.trim() === "") return { success: false, error: "Message cannot be empty" };

    try {
        const message = await prisma.message.create({
            data: {
                text,
                conversationId,
                senderId,
            },
            include: {
                sender: { select: { id: true, name: true, image: true } }
            }
        });

        // Update conversation timestamp to float to top of inbox
        await prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });

        revalidatePath(`/messages/${conversationId}`);
        return { success: true, message };
    } catch (error) {
        console.error("Error sending message:", error);
        return { success: false, error: "Failed to send message" };
    }
}

export async function initiateConversation(user1Id: string, user2Id: string) {
    try {
        // Find existing
        const existing = await prisma.conversation.findFirst({
            where: {
                OR: [
                    { user1Id, user2Id },
                    { user1Id: user2Id, user2Id: user1Id }
                ]
            }
        });

        if (existing) return { success: true, conversationId: existing.id };

        // Ensure consistent ordering to prevent duplicates despite OR query
        const [u1, u2] = [user1Id, user2Id].sort();

        const newConv = await prisma.conversation.create({
            data: {
                user1Id: u1,
                user2Id: u2
            }
        });

        revalidatePath("/messages");
        return { success: true, conversationId: newConv.id };
    } catch (error) {
        console.error("Error creating conversation:", error);
        return { success: false, error: "Failed to create conversation" };
    }
}
