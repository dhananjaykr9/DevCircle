"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function reportContent(targetType: string, targetId: string, reason: string, targetUrl: string) {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Must be logged in to report content");
    }

    await prisma.report.create({
        data: {
            reason,
            targetType,
            targetId,
            targetUrl,
            reporterId: session.user.id,
        }
    });

    return { success: true };
}

export async function resolveReport(reportId: string, action: "Dismiss" | "DeleteContent") {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
        throw new Error("Unauthorized");
    }

    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new Error("Report not found");

    if (action === "DeleteContent") {
        if (report.targetType === "Post" || report.targetType === "Discussion") {
            await prisma.post.deleteMany({ where: { id: report.targetId } });
        } else if (report.targetType === "Comment") {
            await prisma.comment.deleteMany({ where: { id: report.targetId } });
        }

        // Mark all reports for this target as Reviewed
        await prisma.report.updateMany({
            where: { targetId: report.targetId, targetType: report.targetType },
            data: { status: "Reviewed" }
        });
    } else {
        await prisma.report.update({
            where: { id: reportId },
            data: { status: "Dismissed" }
        });
    }

    revalidatePath("/moderation");
}
