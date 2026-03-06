"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


const MODERATOR_THRESHOLD = 500;

/**
 * Automatically checks and promotes a user if they hit the reputation threshold.
 */
async function checkAndPromoteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    if (user.role === "MEMBER" && user.reputation >= MODERATOR_THRESHOLD) {
        await prisma.user.update({
            where: { id: userId },
            data: { role: "MODERATOR" }
        });
        console.log(`User ${user.id} autonomously promoted to MODERATOR.`);
    }
}

/**
 * Server Action to upvote a post.
 * Adds an upvote record, increments the author's reputation, and triggers auto-moderation check.
 */
export async function upvotePost(postId: string, userId: string) {
    try {
        // Prevent duplicate upvotes
        const existing = await prisma.upvote.findUnique({
            where: {
                postId_userId: { postId, userId }
            }
        });

        if (existing) return { success: false, message: "Already upvoted" };

        // Transaction to ensure data consistency
        await prisma.$transaction(async (tx) => {
            // 1. Create the upvote
            await tx.upvote.create({
                data: { postId, userId }
            });

            // 2. Find the author of the post to increase their reputation
            const post = await tx.post.findUnique({
                where: { id: postId },
                select: { authorId: true }
            });

            if (post) {
                // 3. Increment author's reputation
                await tx.user.update({
                    where: { id: post.authorId },
                    data: { reputation: { increment: 10 } }
                });

                // 4. Check for automated promotion based on reputation
                await checkAndPromoteUser(post.authorId);
            }
        });

        revalidatePath("/discussions");
        return { success: true };
    } catch (error) {
        console.error("Error upvoting post:", error);
        return { success: false, error: "Failed to upvote" };
    }
}

/**
 * Remove an upvote
 */
export async function removeUpvote(postId: string, userId: string) {
    try {
        await prisma.$transaction(async (tx) => {
            await tx.upvote.delete({
                where: { postId_userId: { postId, userId } }
            });

            const post = await tx.post.findUnique({
                where: { id: postId },
                select: { authorId: true }
            });

            if (post) {
                await tx.user.update({
                    where: { id: post.authorId },
                    data: { reputation: { decrement: 10 } }
                });
                // Note: We don't demote automatically to prevent aggressive demotion loop
            }
        });

        revalidatePath("/discussions");
        return { success: true };
    } catch (error) {
        console.error("Error removing upvote:", error);
        return { success: false, error: "Failed to remove upvote" };
    }
}
