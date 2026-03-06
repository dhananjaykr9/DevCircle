"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function createProposal(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Must be logged in to create a proposal");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || !description) throw new Error("Missing fields");

    await prisma.proposal.create({
        data: {
            title,
            description,
            authorId: session.user.id
        }
    });

    revalidatePath("/governance");
    return { success: true };
}

export async function voteProposal(proposalId: string, vote: "Yes" | "No") {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Must be logged in to vote");
    }

    const userId = session.user.id;

    const existingVote = await prisma.proposalVote.findUnique({
        where: { proposalId_userId: { proposalId, userId } }
    });

    if (existingVote) {
        // Toggle or change vote
        if (existingVote.vote === vote) {
            await prisma.proposalVote.delete({ where: { id: existingVote.id } }); // Remove vote
        } else {
            await prisma.proposalVote.update({
                where: { id: existingVote.id },
                data: { vote }
            });
        }
    } else {
        await prisma.proposalVote.create({
            data: { proposalId, userId, vote }
        });
    }

    revalidatePath("/governance");
}
