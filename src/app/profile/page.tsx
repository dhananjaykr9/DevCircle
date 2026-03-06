import Link from "next/link";
import { MapPin, Briefcase, Star, Edit2, ArrowRight, MessageSquare, Code2, Zap, Github, Globe, Award, Users } from "lucide-react";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import { acceptMentorRequest, declineMentorRequest } from "@/lib/actions/mentorship";

export const metadata = {
    title: "My Profile — DevCircle",
};

export default async function ProfilePage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            city: true,
            userBadges: { include: { badge: true }, orderBy: { awardedAt: "desc" } },
            mentorRequests: {
                include: { mentee: { select: { id: true, name: true, image: true, experienceLevel: true } } },
                orderBy: { createdAt: "desc" },
                take: 10,
            },
            _count: { select: { posts: true, projects: true, rsvps: true } },
        },
    });

    if (!user) redirect("/");

    const recentDiscussions = await prisma.post.findMany({
        where: { authorId: user.id },
        take: 3,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { comments: true, upvotes: true } } }
    });

    const recentProject = await prisma.project.findFirst({
        where: { authorId: user.id },
        orderBy: { createdAt: "desc" }
    });

    const userSkills = (user as any).skills ? (user as any).skills.split(",") : [];
    const userInterests = (user as any).interests ? (user as any).interests.split(",") : [];
    const pendingRequests = (user as any).mentorRequests.filter((r: any) => r.status === "PENDING");
    const repToMod = Math.max(0, 200 - user.reputation);

    return (
        <>
            <section className="section" style={{ paddingTop: 48 }}>
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }} className="profile-layout">

                        {/* Left — Profile card + tabs */}
                        <div>
                            {/* Hero card */}
                            <div
                                className="glass-card"
                                style={{
                                    padding: 36,
                                    marginBottom: 24,
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Background gradient accent */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 120,
                                        background: "linear-gradient(135deg, rgba(249,115,22,0.15), rgba(139,92,246,0.1))",
                                    }}
                                />

                                <div style={{ position: "relative", zIndex: 1 }}>
                                    {/* Edit button */}
                                    <Link href="/profile/edit"
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                            background: "rgba(255,255,255,0.06)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            borderRadius: 9,
                                            padding: "7px 12px",
                                            color: "rgba(240,244,255,0.6)",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 5,
                                            fontSize: 12,
                                            textDecoration: "none"
                                        }}
                                    >
                                        <Edit2 size={12} /> Edit Profile
                                    </Link>

                                    {/* Avatar */}
                                    <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 24, flexWrap: "wrap" }}>
                                        <div
                                            style={{
                                                width: 88,
                                                height: 88,
                                                borderRadius: 24,
                                                background: "linear-gradient(135deg, #f97316, #ea580c)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 30,
                                                fontWeight: 800,
                                                color: "white",
                                                fontFamily: "'Space Grotesk', sans-serif",
                                                boxShadow: "0 0 28px rgba(249,115,22,0.35)",
                                                border: "3px solid rgba(249,115,22,0.3)",
                                                marginTop: 8,
                                                flexShrink: 0,
                                                overflow: "hidden"
                                            }}
                                        >
                                            {user.image ? (
                                                <img src={user.image} alt={user.name || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            ) : (
                                                user.name?.substring(0, 2).toUpperCase() || "U"
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                                <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 800, color: "#f0f4ff", letterSpacing: "-0.5px" }}>
                                                    {user.name}
                                                </h1>
                                                <span style={{ padding: "3px 10px", borderRadius: 100, background: "rgba(249,115,22,0.12)", color: "#fb923c", fontSize: 11, border: "1px solid rgba(249,115,22,0.2)", fontWeight: 500 }}>
                                                    ✓ Verified Pro
                                                </span>
                                            </div>
                                            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 6, flexWrap: "wrap" }}>
                                                <span style={{ fontSize: 14, color: "rgba(240,244,255,0.7)", display: "flex", alignItems: "center", gap: 5 }}>
                                                    <Briefcase size={13} color="#f97316" /> {user.jobTitle || 'Developer'} {user.company ? `at ${user.company}` : ''}
                                                </span>
                                                <span style={{ color: "rgba(240,244,255,0.2)" }}>·</span>
                                                <span style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", display: "flex", alignItems: "center", gap: 5 }}>
                                                    <MapPin size={13} color="#f97316" /> {(user as any).city?.name || 'Unknown City'}
                                                </span>
                                                {user.experienceLevel && (
                                                    <>
                                                        <span style={{ color: "rgba(240,244,255,0.2)" }}>·</span>
                                                        <span style={{ background: "rgba(139,92,246,0.12)", color: "#a78bfa", padding: "3px 10px", borderRadius: 100, fontSize: 12, border: "1px solid rgba(139,92,246,0.2)" }}>
                                                            {user.experienceLevel}
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <p style={{ fontSize: 14, color: "rgba(240,244,255,0.55)", lineHeight: 1.75, marginBottom: 22, maxWidth: 680 }}>
                                        {user.bio || 'No bio provided for this user. Update your profile settings to add more context about yourself!'}
                                    </p>

                                    {/* Interests */}
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
                                        {userInterests.map((interest: string) => (
                                            <span key={interest} className="tag" style={{ fontSize: 12 }}>
                                                {interest.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div style={{ display: "flex", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
                                        {[
                                            { val: `${user.yearsOfExp || 0} yrs`, lbl: "Experience" },
                                            { val: String(user.reputation || 0), lbl: "Rep ⭐" },
                                            { val: String((user as any)._count.posts), lbl: "Posts" },
                                            { val: String((user as any)._count.projects), lbl: "Projects" },
                                            { val: String((user as any)._count.rsvps), lbl: "Events" },
                                        ].map((s) => (
                                            <div key={s.lbl}>
                                                <div style={{ fontWeight: 800, fontSize: 20, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
                                                <div style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>{s.lbl}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Social links */}
                                    <div style={{ display: "flex", gap: 10 }}>
                                        {(user as any).github && (
                                            <a href={`https://github.com/${(user as any).github}`} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "7px 14px", fontSize: 12, borderRadius: 8, display: "flex", alignItems: "center", gap: 5, textDecoration: "none" }}>
                                                <Github size={14} /> GitHub
                                            </a>
                                        )}
                                        {(user as any).portfolio && (
                                            <a href={(user as any).portfolio} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "7px 14px", fontSize: 12, borderRadius: 8, display: "flex", alignItems: "center", gap: 5, textDecoration: "none" }}>
                                                <Globe size={14} /> Website
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "#f0f4ff", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                                    <Code2 size={17} color="#f97316" /> Technical Skills
                                </h2>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {userSkills.map((skill: string, i: number) => (
                                        <span
                                            key={skill}
                                            style={{
                                                padding: "6px 14px",
                                                borderRadius: 8,
                                                fontSize: 13,
                                                fontWeight: 500,
                                                background: i < 3 ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.05)",
                                                color: i < 3 ? "#fb923c" : "rgba(240,244,255,0.65)",
                                                border: `1px solid ${i < 3 ? "rgba(249,115,22,0.2)" : "rgba(255,255,255,0.08)"}`,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 5,
                                            }}
                                        >
                                            {i < 3 && <Star size={10} fill="#fb923c" />}
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Discussions */}
                            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "#f0f4ff", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                                    <MessageSquare size={17} color="#3b82f6" /> Recent Discussions
                                </h2>
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    {recentDiscussions.map((d) => (
                                        <Link key={d.id} href="/discussions" style={{ textDecoration: "none" }}>
                                            <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", transition: "all 0.2s" }}>
                                                <div style={{ display: "flex", gap: 8, marginBottom: 7 }}>
                                                    <span className="tag" style={{ fontSize: 10 }}>{d.category}</span>
                                                </div>
                                                <h3 style={{ fontSize: 14, fontWeight: 500, color: "#f0f4ff", marginBottom: 6, lineHeight: 1.4 }}>{d.title}</h3>
                                                <div style={{ display: "flex", gap: 14, fontSize: 12, color: "rgba(240,244,255,0.35)" }}>
                                                    <span>{d._count.upvotes} upvotes</span>
                                                    <span>{d._count.comments} replies</span>
                                                    <span>Recently</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Current Project */}
                            {recentProject && (
                                <div className="glass-card" style={{ padding: 28 }}>
                                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "#f0f4ff", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                                        <Zap size={17} color="#10b981" /> Active Project
                                    </h2>
                                    <div style={{ padding: 20, borderRadius: 12, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 8, lineHeight: 1.4 }}>{recentProject.title}</h3>
                                        <p style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", lineHeight: 1.65, marginBottom: 14 }}>{recentProject.description.slice(0, 120)}...</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                                            {recentProject.techStack?.split(',').slice(0, 4).map((t) => (
                                                <span key={t} className="tag tag-green" style={{ fontSize: 11 }}>{t}</span>
                                            ))}
                                        </div>
                                        <Link href="/projects" style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#10b981", textDecoration: "none" }}>
                                            View Project <ArrowRight size={13} />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reputation Progress */}
                        <div className="glass-card" style={{ padding: 22, marginBottom: 20 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>⭐ Reputation</h3>
                                <span style={{ fontSize: 18, fontWeight: 900, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif" }}>{user.reputation}</span>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 100, height: 6, overflow: "hidden", marginBottom: 6 }}>
                                <div style={{ height: "100%", width: `${Math.min(100, (user.reputation / 200) * 100)}%`, background: "linear-gradient(90deg, #f97316, #8b5cf6)", borderRadius: 100, transition: "width 0.6s ease" }} />
                            </div>
                            <span style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>
                                {user.reputation < 200 ? `${repToMod} points to Moderator` : "✅ You're a Moderator!"}
                            </span>
                        </div>

                        {/* Real Badges */}
                        <div className="glass-card" style={{ padding: 22, marginBottom: 20 }}>
                            <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                                <Award size={15} color="#f97316" /> Earned Badges
                            </h3>
                            {(user as any).userBadges.length === 0 ? (
                                <p style={{ fontSize: 13, color: "rgba(240,244,255,0.35)", fontStyle: "italic" }}>No badges yet — start posting, upvoting, and RSVPing!</p>
                            ) : (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {(user as any).userBadges.map((ub: any) => (
                                        <div key={ub.id} title={ub.badge.description} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", fontSize: 12, fontWeight: 500, color: "#fb923c", display: "flex", alignItems: "center", gap: 5, cursor: "default" }}>
                                            {ub.badge.icon} {ub.badge.name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mentorship Inbox */}
                        {user.openToMentoring && (
                            <div className="glass-card" style={{ padding: 22 }}>
                                <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                                    <Users size={15} color="#34d399" /> Mentorship Requests
                                    {pendingRequests.length > 0 && (
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 100, background: "rgba(249,115,22,0.15)", color: "#f97316" }}>{pendingRequests.length}</span>
                                    )}
                                </h3>
                                {(user as any).mentorRequests.length === 0 ? (
                                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.35)", fontStyle: "italic" }}>No requests yet.</p>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {(user as any).mentorRequests.slice(0, 5).map((req: any) => (
                                            <div key={req.id} style={{ padding: "12px 14px", borderRadius: 10, background: req.status === "PENDING" ? "rgba(249,115,22,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${req.status === "PENDING" ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.06)"}` }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <img src={req.mentee.image || `https://ui-avatars.com/api/?name=${req.mentee.name || "U"}&background=8b5cf6&color=fff&size=28`} alt={req.mentee.name || ""} style={{ width: 24, height: 24, borderRadius: "50%" }} />
                                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>{req.mentee.name}</span>
                                                    </div>
                                                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 100, background: req.status === "PENDING" ? "rgba(249,115,22,0.12)" : req.status === "ACCEPTED" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)", color: req.status === "PENDING" ? "#fb923c" : req.status === "ACCEPTED" ? "#34d399" : "#f87171" }}>
                                                        {req.status}
                                                    </span>
                                                </div>
                                                <p style={{ fontSize: 12, color: "rgba(240,244,255,0.45)", marginBottom: req.status === "PENDING" ? 10 : 0, lineHeight: 1.5 }}>Area: {req.area} · {req.message.substring(0, 80)}{req.message.length > 80 ? "..." : ""}</p>
                                                {req.status === "PENDING" && (
                                                    <div style={{ display: "flex", gap: 8 }}>
                                                        <form action={acceptMentorRequest.bind(null, req.id)}>
                                                            <button type="submit" style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399", cursor: "pointer" }}>✓ Accept</button>
                                                        </form>
                                                        <form action={declineMentorRequest.bind(null, req.id)}>
                                                            <button type="submit" style={{ fontSize: 12, padding: "5px 12px", borderRadius: 6, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer" }}>✕ Decline</button>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
            <style>{`
        @media (max-width: 900px) { .profile-layout { grid-template-columns: 1fr !important; } }
      `}</style>
        </>
    );
}
