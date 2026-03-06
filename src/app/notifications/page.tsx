import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Bell, MessageSquare, Calendar, Users, Briefcase, CheckCircle2 } from "lucide-react";
import { markAllNotificationsAsRead, markNotificationAsRead } from "@/lib/actions/notifications";

export const metadata = {
    title: "Notifications — DevCircle",
};

const iconMap: Record<string, React.ReactNode> = {
    MESSAGE: <MessageSquare size={16} color="#3b82f6" />,
    REPLY: <MessageSquare size={16} color="#10b981" />,
    EVENT: <Calendar size={16} color="#8b5cf6" />,
    MENTORSHIP: <Users size={16} color="#f59e0b" />,
    DEFAULT: <Bell size={16} color="#f0f4ff" />
};

export default async function NotificationsPage() {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const notifications = await prisma.notification.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 50
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            <section style={{ padding: "40px 0 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="grid-bg">
                <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-1px", margin: "0 0 8px 0" }}>
                            Notifications
                        </h1>
                        <p style={{ color: "rgba(240,244,255,0.5)", fontSize: 14, margin: 0 }}>
                            You have {unreadCount} unread alerts.
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <form action={markAllNotificationsAsRead}>
                            <button type="submit" className="btn-secondary" style={{ fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                                <CheckCircle2 size={14} /> Mark all as read
                            </button>
                        </form>
                    )}
                </div>
            </section>

            <section className="section" style={{ flex: 1 }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {notifications.length === 0 ? (
                            <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
                                <Bell size={40} style={{ margin: "0 auto 16px", opacity: 0.2 }} color="#f0f4ff" />
                                <h3 style={{ fontSize: 18, color: "#f0f4ff", margin: "0 0 8px 0" }}>All caught up!</h3>
                                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", margin: 0 }}>You don't have any notifications yet.</p>
                            </div>
                        ) : notifications.map(notif => (
                            <div key={notif.id} className="glass-card" style={{
                                padding: "16px 20px",
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 16,
                                background: notif.isRead ? "rgba(255,255,255,0.02)" : "rgba(59,130,246,0.05)",
                                borderLeft: notif.isRead ? "1px solid rgba(255,255,255,0.05)" : "3px solid #3b82f6"
                            }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    {iconMap[notif.type] || iconMap.DEFAULT}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 14, color: notif.isRead ? "rgba(240,244,255,0.7)" : "#f0f4ff", margin: "0 0 4px 0", lineHeight: 1.5 }}>
                                        {notif.content}
                                    </p>
                                    <span style={{ fontSize: 11, color: "rgba(240,244,255,0.4)" }}>
                                        {notif.createdAt.toLocaleDateString()} at {notif.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                                    {notif.link && (
                                        <Link href={notif.link} className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }}>
                                            View
                                        </Link>
                                    )}
                                    {!notif.isRead && (
                                        <form action={async () => { "use server"; await markNotificationAsRead(notif.id); }}>
                                            <button type="submit" style={{ background: "none", border: "none", color: "rgba(240,244,255,0.4)", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
                                                Mark read
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
