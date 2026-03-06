"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function toggleMentorStatus(action: "opt-in" | "opt-out") {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("You must be logged in");
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { openToMentoring: action === "opt-in" }
    });

    revalidatePath("/mentorship");
    return { success: true };
}

export async function requestMentorship(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const mentorId = formData.get("mentorId") as string;
    const message = formData.get("message") as string;

    await (prisma as any).mentorRequest.create({
        data: {
            menteeId: session.user.id,
            mentorId,
            message,
            status: "PENDING"
        }
    });
    revalidatePath("/mentorship");
    return { success: true };
}

export async function acceptMentorRequest(requestId: string) {
    await (prisma as any).mentorRequest.update({ where: { id: requestId }, data: { status: "ACCEPTED" } });
    revalidatePath("/profile");
}

export async function declineMentorRequest(requestId: string) {
    await (prisma as any).mentorRequest.update({ where: { id: requestId }, data: { status: "DECLINED" } });
    revalidatePath("/profile");
}
