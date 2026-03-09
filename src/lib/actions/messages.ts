"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../../../auth";

export async function sendMessage(conversationId: string, senderId: string, text: string) {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // Prevent impersonation: senderId must match the logged-in user
    if (senderId !== session.user.id) return { success: false, error: "Forbidden" };

    if (!text || text.trim() === "") return { success: false, error: "Message cannot be empty" };
    if (text.length > 5000) return { success: false, error: "Message too long" };

    try {
        // Verify the user is a participant of this conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            select: { user1Id: true, user2Id: true }
        });
        if (!conversation || (conversation.user1Id !== session.user.id && conversation.user2Id !== session.user.id)) {
            return { success: false, error: "Forbidden" };
        }

        const message = await prisma.message.create({
            data: {
                text: text.trim(),
                conversationId,
                senderId: session.user.id,
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
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    // The logged-in user must be one of the participants
    if (session.user.id !== user1Id && session.user.id !== user2Id) {
        return { success: false, error: "Forbidden" };
    }

    // Cannot create a conversation with yourself
    if (user1Id === user2Id) return { success: false, error: "Cannot message yourself" };

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
