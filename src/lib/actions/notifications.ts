"use server";

import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { revalidatePath } from "next/cache";

export async function markNotificationAsRead(notificationId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const notif = await prisma.notification.findUnique({ where: { id: notificationId } });
    if (!notif || notif.userId !== session.user.id) {
        return { error: "Not found" };
    }

    await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true }
    });

    revalidatePath("/notifications");
    return { success: true };
}

export async function markAllNotificationsAsRead() {
    const session = await auth();
    if (!session?.user?.id) return;

    await prisma.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true }
    });

    revalidatePath("/notifications");
}
