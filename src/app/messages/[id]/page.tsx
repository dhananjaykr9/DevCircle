import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ChatThread from "@/components/ChatThread";

export const metadata = {
    title: "Conversation — DevCircle",
};

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) redirect("/");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, image: true }
    });

    if (!user) redirect("/");

    const conversation = await prisma.conversation.findUnique({
        where: { id },
        include: {
            user1: { select: { id: true, name: true, image: true } },
            user2: { select: { id: true, name: true, image: true } },
            messages: {
                orderBy: { createdAt: "asc" },
                include: {
                    sender: { select: { id: true, name: true, image: true } }
                }
            }
        }
    });

    if (!conversation) redirect("/messages");

    // Ensure user is part of conversation
    if (conversation.user1Id !== user.id && conversation.user2Id !== user.id) {
        redirect("/messages");
    }

    const otherUser = conversation.user1Id === user.id ? conversation.user2 : conversation.user1;

    // Mark messages as read on load
    const unreadIds = conversation.messages
        .filter((m) => !m.isRead && m.senderId !== user.id)
        .map((m) => m.id);

    if (unreadIds.length > 0) {
        await prisma.message.updateMany({
            where: { id: { in: unreadIds } },
            data: { isRead: true }
        });
    }

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <section className="section" style={{ flex: 1, paddingTop: 20 }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div style={{ marginBottom: 20 }}>
                        <Link href="/messages" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(240,244,255,0.6)", textDecoration: "none", fontSize: 14 }}>
                            <ArrowLeft size={14} /> Back to Inbox
                        </Link>
                    </div>

                    <ChatThread
                        initialMessages={conversation.messages}
                        conversationId={conversation.id}
                        currentUserId={user.id}
                        otherUserName={otherUser.name || "Unknown User"}
                        otherUserAvatar={otherUser.image}
                    />
                </div>
            </section>
            <Footer />
        </main>
    );
}
