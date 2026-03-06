import Link from "next/link";
import { MapPin, Briefcase, Star, Edit2, ArrowRight, MessageSquare, Code2, Zap, Github, Linkedin, Globe } from "lucide-react";
import Footer from "@/components/Footer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { auth } from "../../../auth";
import { redirect } from "next/navigation";

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
        include: { city: true }
    });

    if (!user) {
        redirect("/");
    }

    const recentDiscussions = await prisma.post.findMany({
        where: { authorId: user.id },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { comments: true, upvotes: true } } }
    });

    const recentProject = await prisma.project.findFirst({
        where: { authorId: user.id },
        orderBy: { createdAt: 'desc' }
    });

    const userSkills = user.skills ? user.skills.split(',') : [];
    const userInterests = user.interests ? user.interests.split(',') : [];

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
                                                    <MapPin size={13} color="#f97316" /> {user.city?.name || 'Unknown City'}
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
                                        {userInterests.map((interest) => (
                                            <span key={interest} className="tag" style={{ fontSize: 12 }}>
                                                {interest.trim()}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Stats */}
                                    <div style={{ display: "flex", gap: 24, marginBottom: 24, flexWrap: "wrap" }}>
                                        {[
                                            { val: `${user.yearsOfExp || 0} yrs`, lbl: "Experience" },
                                            { val: String(user.reputation || 0), lbl: "Reputation" },
                                            { val: "12", lbl: "Discussions" },
                                            { val: "2", lbl: "Projects" },
                                        ].map((s) => (
                                            <div key={s.lbl}>
                                                <div style={{ fontWeight: 800, fontSize: 20, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
                                                <div style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>{s.lbl}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Social links */}
                                    <div style={{ display: "flex", gap: 10 }}>
                                        {[
                                            { icon: <Github size={14} />, label: "GitHub" },
                                            { icon: <Linkedin size={14} />, label: "LinkedIn" },
                                            { icon: <Globe size={14} />, label: "Website" },
                                        ].map((s) => (
                                            <button
                                                key={s.label}
                                                className="btn-secondary"
                                                style={{ padding: "7px 14px", fontSize: 12, borderRadius: 8, display: "flex", alignItems: "center", gap: 5 }}
                                            >
                                                {s.icon} {s.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="glass-card" style={{ padding: 28, marginBottom: 24 }}>
                                <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "#f0f4ff", marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
                                    <Code2 size={17} color="#f97316" /> Technical Skills
                                </h2>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {userSkills.map((skill, i) => (
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

                        {/* Right sidebar */}
                        <div>


                            {/* Community */}
                            <div className="glass-card" style={{ padding: 22, marginBottom: 20 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 14 }}>My Community</h3>
                                <Link href="/communities/nagpur" style={{ textDecoration: "none" }}>
                                    <div
                                        style={{
                                            padding: 16,
                                            borderRadius: 12,
                                            background: "linear-gradient(135deg, rgba(249,115,22,0.1), rgba(139,92,246,0.08))",
                                            border: "1px solid rgba(249,115,22,0.15)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, fontSize: 15, color: "#f0f4ff", marginBottom: 4 }}>
                                            DevCircle <span style={{ color: "#f97316" }}>Nagpur</span>
                                        </div>
                                        <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginBottom: 12 }}>
                                            Member since Jan 2025 · Tier-2 City
                                        </div>
                                        <div style={{ display: "flex", gap: 14 }}>
                                            {[{ val: "1,284", lbl: "Members" }, { val: "347", lbl: "Posts" }].map((s) => (
                                                <div key={s.lbl}>
                                                    <div style={{ fontWeight: 700, fontSize: 14, color: "#f97316" }}>{s.val}</div>
                                                    <div style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>{s.lbl}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Badges */}
                            <div className="glass-card" style={{ padding: 22 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 14 }}>Badges</h3>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                    {[
                                        { label: "Early Member", icon: "🌟", color: "#f97316" },
                                        { label: "Top Contributor", icon: "🔥", color: "#ef4444" },
                                        { label: "Event Speaker", icon: "🎙️", color: "#8b5cf6" },
                                        { label: "Open Source", icon: "💻", color: "#10b981" },
                                        { label: "Mentor", icon: "🎓", color: "#3b82f6" },
                                    ].map((badge) => (
                                        <div
                                            key={badge.label}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 8,
                                                background: `${badge.color}15`,
                                                border: `1px solid ${badge.color}25`,
                                                fontSize: 11,
                                                fontWeight: 500,
                                                color: badge.color,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 5,
                                            }}
                                        >
                                            {badge.icon} {badge.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
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
