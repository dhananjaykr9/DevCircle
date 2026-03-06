import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Footer from "@/components/Footer";
import { MessageSquare, User as UserIcon } from "lucide-react";

export const metadata = {
    title: "Messages — DevCircle",
};

export default async function MessagesInbox() {
    const session = await auth();
    if (!session?.user?.email) redirect("/");

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
    });

    if (!user) redirect("/");

    const conversations = await prisma.conversation.findMany({
        where: {
            OR: [{ user1Id: user.id }, { user2Id: user.id }]
        },
        include: {
            user1: { select: { id: true, name: true, image: true, jobTitle: true } },
            user2: { select: { id: true, name: true, image: true, jobTitle: true } },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1
            },
            _count: {
                select: {
                    messages: {
                        where: { isRead: false, senderId: { not: user.id } }
                    }
                }
            }
        },
        orderBy: { updatedAt: "desc" }
    });

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <section className="section" style={{ flex: 1, paddingTop: 40 }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 30 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <MessageSquare size={24} color="#f97316" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Messages</h1>
                            <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", margin: 0, marginTop: 4 }}>Your direct conversations</p>
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                        {conversations.length === 0 ? (
                            <div style={{ padding: 60, textAlign: "center", color: "rgba(240,244,255,0.4)", fontSize: 14 }}>
                                You have no active conversations yet.
                                <br />
                                <Link href="/network" style={{ display: "inline-block", marginTop: 12, color: "#f97316", textDecoration: "none" }}>Find developers in the Network</Link>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column" }}>
                                {conversations.map((conv) => {
                                    const otherUser = conv.user1Id === user.id ? conv.user2 : conv.user1;
                                    const lastMessage = conv.messages[0];
                                    const unreadCount = conv._count.messages;

                                    return (
                                        <Link
                                            key={conv.id}
                                            href={`/messages/${conv.id}`}
                                            style={{
                                                textDecoration: "none",
                                                padding: "20px 24px",
                                                borderBottom: "1px solid rgba(255,255,255,0.06)",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 16,
                                                background: unreadCount > 0 ? "rgba(249,115,22,0.03)" : "transparent",
                                                transition: "background 0.2s"
                                            }}
                                            className="hover-bg-light"
                                        >
                                            <div style={{ position: "relative" }}>
                                                {otherUser.image ? (
                                                    <img src={otherUser.image} alt={otherUser.name || "User"} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                                                ) : (
                                                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: 18 }}>
                                                        {otherUser.name?.charAt(0).toUpperCase() || "U"}
                                                    </div>
                                                )}
                                                {unreadCount > 0 && (
                                                    <div style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, borderRadius: "50%", background: "#f97316", border: "2px solid #0f172a" }} />
                                                )}
                                            </div>

                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 4 }}>
                                                    <h3 style={{ fontSize: 16, fontWeight: unreadCount > 0 ? 700 : 500, color: "#f0f4ff", margin: 0, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                                        {otherUser.name}
                                                    </h3>
                                                    {lastMessage && (
                                                        <span style={{ fontSize: 11, color: unreadCount > 0 ? "#f97316" : "rgba(240,244,255,0.4)", flexShrink: 0 }}>
                                                            {new Date(lastMessage.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                                                        </span>
                                                    )}
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <p style={{
                                                        fontSize: 14,
                                                        color: unreadCount > 0 ? "#f0f4ff" : "rgba(240,244,255,0.5)",
                                                        margin: 0,
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        whiteSpace: "nowrap",
                                                        fontWeight: unreadCount > 0 ? 500 : 400
                                                    }}>
                                                        {lastMessage ? (
                                                            <>
                                                                {lastMessage.senderId === user.id && "You: "}
                                                                {lastMessage.text}
                                                            </>
                                                        ) : (
                                                            <span style={{ fontStyle: "italic" }}>No messages yet</span>
                                                        )}
                                                    </p>
                                                    {unreadCount > 0 && (
                                                        <span style={{ background: "#f97316", color: "white", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 100, flexShrink: 0, marginLeft: 10 }}>
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
            <style>{`.hover-bg-light:hover { background: rgba(255,255,255,0.02) !important; }`}</style>
        </main>
    );
}
