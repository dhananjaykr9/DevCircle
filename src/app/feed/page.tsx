import { auth } from "../../../auth";
import prisma from "@/lib/prisma";
import Footer from "@/components/Footer";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, MessageSquare, Briefcase, Calendar, MapPin, Users, Github, Bell, Settings, Code2, Globe } from "lucide-react";

export const metadata = {
    title: "Dashboard — DevCircle",
};

export default async function DashboardFeedPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/auth/login");

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) redirect("/auth/login");

    const mySkills = user.skills ? user.skills.toLowerCase().split(',').map((s: string) => s.trim()) : [];

    // 1. Fetch Discussions
    const allDiscussions = await prisma.post.findMany({
        where: { cityId: user.cityId ?? undefined },
        include: { author: true, _count: { select: { upvotes: true, comments: true } } },
        orderBy: { createdAt: "desc" },
        take: 30
    });

    const recommendedDiscussions = allDiscussions.map(d => {
        let score = 0;
        const dTags = d.tags?.toLowerCase().split(',').map((t: string) => t.trim()) || [];
        const matches = mySkills.filter((s: string) => dTags.includes(s) || d.category.toLowerCase().includes(s));
        score += matches.length * 5;
        score += d._count.upvotes;
        return { ...d, matchScore: score, matchReason: matches[0] || "Popular in your city" };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 10);

    // 2. Fetch Projects
    const allProjects = await prisma.project.findMany({
        where: { cityId: user.cityId ?? undefined, status: "Recruiting" },
        orderBy: { createdAt: "desc" },
        take: 10
    });

    const recommendedProjects = allProjects.map(p => {
        let score = 0;
        const pTags = p.techStack?.toLowerCase().split(',').map((t: string) => t.trim()) || [];
        const matches = mySkills.filter((s: string) => pTags.includes(s));
        score += matches.length * 5;
        return { ...p, matchScore: score, matchReason: matches[0] || "Needs your role" };
    }).filter(p => p.matchScore > 0).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);

    // 3. Fetch Events
    const upcomingEvents = await prisma.event.findMany({
        where: { cityId: user.cityId ?? undefined, date: { gte: new Date() } },
        orderBy: { date: "asc" },
        take: 3
    });

    const navLinks = [
        { href: "/feed", label: "Home Base", icon: <Globe size={18} /> },
        { href: `/communities/${user.cityId}`, label: "My Community", icon: <MapPin size={18} /> },
        { href: "/discussions", label: "Discussions", icon: <MessageSquare size={18} /> },
        { href: "/projects", label: "Projects", icon: <Briefcase size={18} /> },
        { href: "/events", label: "Events", icon: <Calendar size={18} /> },
        { href: "/mentorship", label: "Mentorship", icon: <Users size={18} /> },
        { href: "/jobs", label: "Jobs", icon: <Briefcase size={18} /> },
        { href: "/open-source", label: "Open Source", icon: <Github size={18} /> },
        { href: "/messages", label: "Messages", icon: <MessageSquare size={18} /> },
        { href: "/notifications", label: "Notifications", icon: <Bell size={18} /> },
        { href: "/profile", label: "Profile", icon: <Users size={18} /> },
        { href: "/settings", label: "Settings", icon: <Settings size={18} /> },
    ];

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-dark)" }}>

            <section style={{ padding: "40px 0 0", flex: 1 }}>
                {/* 3-Column Layout */}
                <div className="container dashboard-grid" style={{ gap: 32, alignItems: "start" }}>

                    {/* Left Sidebar (Navigation Menu) */}
                    <div style={{ position: "sticky", top: 100, display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ padding: "0 12px", marginBottom: 12, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(240,244,255,0.4)", textTransform: "uppercase" }}>
                            Dashboard
                        </div>
                        {navLinks.map((link) => (
                            <Link key={link.label} href={link.href} style={{
                                padding: "10px 14px",
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                fontSize: 14,
                                fontWeight: 500,
                                textDecoration: "none",
                                background: link.href === "/feed" ? "rgba(255,255,255,0.05)" : "transparent",
                                color: link.href === "/feed" ? "#f0f4ff" : "rgba(240,244,255,0.6)"
                            }}>
                                <span style={{ color: link.href === "/feed" ? "#3b82f6" : "inherit" }}>
                                    {link.icon}
                                </span>
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Main Content Feed */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 24, paddingBottom: 40 }}>
                        <div className="glass-card" style={{ padding: "24px", background: "linear-gradient(135deg, rgba(8,145,178,0.1), rgba(59,130,246,0.1))", border: "1px solid rgba(59,130,246,0.2)" }}>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 100, background: "rgba(59,130,246,0.2)", color: "#93c5fd", fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
                                <Sparkles size={12} /> AI Personalized Feed
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#f0f4ff", margin: "0 0 8px 0" }}>Welcome back, {user.name?.split(' ')[0]}</h2>
                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.6)", margin: 0 }}>Discover discussions, projects, and events curated specifically for your {mySkills.length > 0 ? "tech stack" : "interests"}.</p>
                        </div>

                        <div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f0f4ff" }}>Trending Discussions</h3>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {recommendedDiscussions.length === 0 ? (
                                    <div className="glass-card" style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>No discussions match your skills yet.</div>
                                ) : recommendedDiscussions.map((d) => (
                                    <Link key={d.id} href="/discussions" style={{ textDecoration: "none" }}>
                                        <div className="glass-card" style={{ padding: "20px", display: "flex", alignItems: "flex-start", gap: 16, transition: "transform 0.2s" }}>
                                            <div style={{ textAlign: "center", minWidth: 40, marginTop: 4 }}>
                                                <div style={{ fontSize: 16, fontWeight: 800, color: "#f97316", fontFamily: "'Space Grotesk', sans-serif" }}>{d._count.upvotes}</div>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                                                    <span className="tag" style={{ fontSize: 11 }}>{d.category}</span>
                                                    <span style={{ fontSize: 11, color: "#c4b5fd", display: "flex", alignItems: "center", gap: 4, background: "rgba(139,92,246,0.1)", padding: "2px 8px", borderRadius: 100 }}>
                                                        <Sparkles size={10} /> Because you follow {d.matchReason}
                                                    </span>
                                                </div>
                                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 6, lineHeight: 1.4 }}>{d.title}</h3>
                                                <p style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", lineHeight: 1.6, marginBottom: 12 }}>{d.preview}</p>
                                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                    <span style={{ fontSize: 12, color: "rgba(240,244,255,0.5)" }}>By {d.author.name}</span>
                                                    <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>{d._count.comments} replies</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar (Widgets) */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                        {/* Upcoming Events */}
                        <div className="glass-card" style={{ padding: 20 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                <Calendar size={16} color="#8b5cf6" /> Upcoming Local Events
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {upcomingEvents.length === 0 ? (
                                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "20px 0" }}>No upcoming events.</div>
                                ) : upcomingEvents.map(e => (
                                    <div key={e.id} style={{ padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div style={{ fontSize: 12, color: "#a78bfa", fontWeight: 600, marginBottom: 4 }}>{e.date.toLocaleDateString()}</div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff", marginBottom: 6 }}>{e.title}</div>
                                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={10} /> {e.venue}</div>
                                    </div>
                                ))}
                                {upcomingEvents.length > 0 && <Link href="/events" className="btn-secondary" style={{ width: "100%", justifyContent: "center", fontSize: 12, marginTop: 4 }}>View All Events</Link>}
                            </div>
                        </div>

                        {/* Recommended Projects */}
                        <div className="glass-card" style={{ padding: 20 }}>
                            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                                <Code2 size={16} color="#10b981" /> Suggested Projects
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {recommendedProjects.length === 0 ? (
                                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "20px 0" }}>No suggested projects yet.</div>
                                ) : recommendedProjects.map(p => (
                                    <div key={p.id} style={{ padding: 12, background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>{p.title}</div>
                                        </div>
                                        <div style={{ fontSize: 11, color: "#34d399", background: "rgba(16,185,129,0.1)", padding: "2px 6px", borderRadius: 4, display: "inline-block" }}>Match: {p.matchReason}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <style>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 240px 1fr 340px;
                }
                @media (max-width: 1200px) {
                    .dashboard-grid {
                        grid-template-columns: 200px 1fr;
                    }
                    .dashboard-grid > div:last-child {
                        display: none;
                    }
                }
                @media (max-width: 850px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                    .dashboard-grid > div:first-child {
                        display: none;
                    }
                }
            `}</style>

            <Footer />
        </main>
    );
}
