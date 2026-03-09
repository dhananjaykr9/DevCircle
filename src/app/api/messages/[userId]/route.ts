import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "../../../../../auth";

export async function GET(request: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const currentUser = { id: session.user.id };

        // Get the url query params
        const url = new URL(request.url);
        const conversationId = url.searchParams.get("conversationId");
        const after = url.searchParams.get("after"); // ISO string

        if (!conversationId) {
            return new NextResponse("Missing conversationId", { status: 400 });
        }

        // IDOR protection: verify the user is a participant of this conversation
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            select: { user1Id: true, user2Id: true }
        });
        if (!conversation || (conversation.user1Id !== currentUser.id && conversation.user2Id !== currentUser.id)) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const messages = await prisma.message.findMany({
            where: {
                conversationId,
                ...(after ? { createdAt: { gt: new Date(after) } } : {})
            },
            include: {
                sender: { select: { id: true, name: true, image: true } }
            },
            orderBy: { createdAt: 'asc' },
            take: 200,
        });

        // Mark fetched messages from the OTHER user as read
        const unreadIds = messages
            .filter(m => !m.isRead && m.senderId !== currentUser.id)
            .map(m => m.id);

        if (unreadIds.length > 0) {
            await prisma.message.updateMany({
                where: { id: { in: unreadIds } },
                data: { isRead: true }
            });
        }

        return NextResponse.json({ messages });
    } catch (error) {
        console.error("API Error fetching messages:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
