import Link from "next/link";
import { MapPin, Briefcase, Star, Award, Users, MessageSquare, Code, ArrowRight, ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import { auth } from "../../../../auth";
import { notFound } from "next/navigation";
import MentorRequestForm from "@/components/MentorRequestForm";
import MessageButton from "@/components/MessageButton";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { id }, select: { name: true, jobTitle: true } });
    if (!user) return { title: "Member Not Found" };
    return {
        title: `${user.name} — DevCircle`,
        description: user.jobTitle ? `${user.name}, ${user.jobTitle} on DevCircle` : `${user.name}'s profile on DevCircle`,
    };
}

const EXP_COLORS: Record<string, string> = {
    "Fresher": "#34d399",
    "Junior Developer": "#60a5fa",
    "Mid-Level Engineer": "#a78bfa",
    "Senior Engineer": "#f97316",
    "Architect / Tech Lead": "#fbbf24",
};

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [session, member] = await Promise.all([
        auth(),
        prisma.user.findUnique({
            where: { id },
            include: {
                city: true,
                posts: { orderBy: { createdAt: "desc" }, take: 5, include: { _count: { select: { upvotes: true, comments: true } } } },
                projects: { orderBy: { createdAt: "desc" }, take: 3 },
                userBadges: { include: { badge: true }, orderBy: { awardedAt: "desc" } },
                _count: { select: { posts: true, projects: true, rsvps: true } },
            },
        }),
    ]);

    if (!member) notFound();

    const isOwnProfile = session?.user?.id === member.id;
    const expColor = EXP_COLORS[member.experienceLevel || ""] || "#f97316";

    // Check if current user already has a pending request to this mentor
    const hasPendingRequest = session?.user?.id
        ? !!(await prisma.mentorRequest.findFirst({
            where: { menteeId: session.user.id, mentorId: member.id, status: "pending" },
        }))
        : false;

    return (
        <>
            {/* Header */}
            <section style={{ padding: "64px 0 0", background: "rgba(13,17,32,0.5)" }} className="grid-bg">
                <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "#8b5cf6", filter: "blur(90px)", opacity: 0.1, top: -60, right: -40, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2, paddingBottom: 40 }}>
                    <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>
                        {/* Avatar */}
                        <img
                            src={member.image || `https://ui-avatars.com/api/?name=${member.name || "U"}&background=8b5cf6&color=fff&size=120`}
                            alt={member.name || "Member"}
                            style={{ width: 100, height: 100, borderRadius: "50%", border: "3px solid rgba(139,92,246,0.4)", objectFit: "cover", flexShrink: 0 }}
                        />
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 200 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>{member.name}</h1>
                                {member.experienceLevel && (
                                    <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: `${expColor}18`, color: expColor, border: `1px solid ${expColor}30` }}>
                                        {member.experienceLevel}
                                    </span>
                                )}
                                {member.role === "MODERATOR" && (
                                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "rgba(249,115,22,0.12)", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)" }}>🛡️ Mod</span>
                                )}
                            </div>

                            {(member.jobTitle || member.company) && (
                                <p style={{ fontSize: 15, color: "rgba(240,244,255,0.65)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                                    <Briefcase size={14} color="#f97316" />
                                    {[member.jobTitle, member.company].filter(Boolean).join(" @ ")}
                                </p>
                            )}
                            {member.city && (
                                <p style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
                                    <MapPin size={12} color="#f97316" /> {member.city.name}
                                </p>
                            )}

                            {/* Stats row */}
                            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                                {[
                                    { label: "Posts", val: member._count.posts },
                                    { label: "Projects", val: member._count.projects },
                                    { label: "Events RSVPd", val: member._count.rsvps },
                                    { label: "Rep", val: member.reputation, icon: "⭐" },
                                ].map((s) => (
                                    <div key={s.label} style={{ textAlign: "center" }}>
                                        <div style={{ fontSize: 18, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif" }}>{s.icon}{s.val}</div>
                                        <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)" }}>{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action buttons (not own profile) */}
                        {!isOwnProfile && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 180 }}>
                                {member.linkedin && (
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", textDecoration: "none", fontSize: 13, padding: "9px 0" }}>
                                        <ExternalLink size={13} /> LinkedIn
                                    </a>
                                )}
                                {member.github && (
                                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", textDecoration: "none", fontSize: 13, padding: "9px 0" }}>
                                        <Code size={13} /> GitHub
                                    </a>
                                )}
                                {isOwnProfile && (
                                    <Link href="/profile/edit" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", textDecoration: "none", fontSize: 13, padding: "9px 0" }}>
                                        Edit Profile
                                    </Link>
                                )}
                                {session?.user?.id && !isOwnProfile && (
                                    <MessageButton currentUserId={session.user.id} otherUserId={member.id} />
                                )}
                            </div>
                        )}
                        {isOwnProfile && (
                            <Link href="/profile/edit" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", textDecoration: "none", fontSize: 13, padding: "9px 20px", alignSelf: "flex-start" }}>
                                Edit Profile <ArrowRight size={13} />
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28 }} className="member-layout">

                        {/* Left column */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                            {/* Bio */}
                            {member.bio && (
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "rgba(240,244,255,0.7)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>About</h2>
                                    <p style={{ fontSize: 14, color: "rgba(240,244,255,0.65)", lineHeight: 1.75 }}>{member.bio}</p>
                                </div>
                            )}

                            {/* Badges */}
                            {member.userBadges.length > 0 && (
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "rgba(240,244,255,0.7)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                                        <Award size={16} color="#f97316" /> Badges
                                    </h2>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                                        {member.userBadges.map((ub) => (
                                            <div key={ub.id} title={ub.badge.description} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 40, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", cursor: "default" }}>
                                                <span style={{ fontSize: 18 }}>{ub.badge.icon}</span>
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff" }}>{ub.badge.name}</div>
                                                    <div style={{ fontSize: 10, color: "rgba(240,244,255,0.35)" }}>{ub.badge.category}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {member.skills && (
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "rgba(240,244,255,0.7)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>Skills</h2>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        {member.skills.split(",").filter(Boolean).map((s) => (
                                            <span key={s} className="tag" style={{ fontSize: 12 }}>{s.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Posts */}
                            {member.posts.length > 0 && (
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "rgba(240,244,255,0.7)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                                        <MessageSquare size={15} color="#f97316" /> Recent Posts
                                    </h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                        {member.posts.map((post) => (
                                            <Link key={post.id} href={`/discussions`} style={{ textDecoration: "none" }}>
                                                <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", transition: "border-color 0.2s" }}>
                                                    <p style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff", marginBottom: 4 }}>{post.title}</p>
                                                    <div style={{ display: "flex", gap: 12, fontSize: 12, color: "rgba(240,244,255,0.35)" }}>
                                                        <span>⬆ {post._count.upvotes}</span>
                                                        <span>💬 {post._count.comments}</span>
                                                        <span>{post.category}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recent Projects */}
                            {member.projects.length > 0 && (
                                <div className="glass-card" style={{ padding: 24 }}>
                                    <h2 style={{ fontSize: 15, fontWeight: 700, color: "rgba(240,244,255,0.7)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 8 }}>
                                        <Code size={15} color="#f97316" /> Projects
                                    </h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                        {member.projects.map((proj) => (
                                            <div key={proj.id} style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                                <p style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff", marginBottom: 4 }}>{proj.title}</p>
                                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                    {proj.techStack.split(",").filter(Boolean).slice(0, 3).map((t) => (
                                                        <span key={t} style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", background: "rgba(255,255,255,0.04)", padding: "1px 7px", borderRadius: 4 }}>{t.trim()}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right sidebar */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                            {/* Reputation card */}
                            <div className="glass-card" style={{ padding: 22, textAlign: "center" }}>
                                <div style={{ fontSize: 36, fontWeight: 900, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif" }}>⭐ {member.reputation}</div>
                                <div style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", marginBottom: 14 }}>Reputation Points</div>
                                {/* Rep bar */}
                                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 100, height: 6, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${Math.min(100, (member.reputation / 200) * 100)}%`, background: "linear-gradient(90deg, #f97316, #8b5cf6)", borderRadius: 100, transition: "width 0.5s ease" }} />
                                </div>
                                <div style={{ fontSize: 11, color: "rgba(240,244,255,0.3)", marginTop: 6 }}>
                                    {member.reputation < 200 ? `${200 - member.reputation} to Moderator` : "✅ Moderator"}
                                </div>
                            </div>

                            {/* Mentorship CTA */}
                            {member.openToMentoring && !isOwnProfile && session?.user && (
                                <div className="glass-card" style={{ padding: 22, background: "linear-gradient(135deg, rgba(139,92,246,0.07), rgba(16,185,129,0.05))", borderColor: "rgba(139,92,246,0.15)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                        <Users size={16} color="#34d399" />
                                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", margin: 0 }}>Open to Mentoring</h3>
                                    </div>
                                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: 16, lineHeight: 1.6 }}>
                                        {member.name?.split(" ")[0]} is accepting mentorship requests.
                                    </p>
                                    {hasPendingRequest ? (
                                        <div style={{ fontSize: 13, color: "#34d399", fontWeight: 500, padding: "8px 14px", borderRadius: 8, background: "rgba(16,185,129,0.1)", textAlign: "center" }}>
                                            ✓ Request sent — pending response
                                        </div>
                                    ) : (
                                        <MentorRequestForm mentorId={member.id} mentorName={member.name || "this mentor"} />
                                    )}
                                </div>
                            )}

                            {/* Not logged in nudge */}
                            {member.openToMentoring && !isOwnProfile && !session?.user && (
                                <div className="glass-card" style={{ padding: 22, borderColor: "rgba(139,92,246,0.15)" }}>
                                    <Users size={20} color="#34d399" style={{ marginBottom: 10 }} />
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff", marginBottom: 8 }}>Open to Mentoring</h3>
                                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: 14, lineHeight: 1.6 }}>Sign in to send a mentorship request.</p>
                                    <Link href="/api/auth/signin" className="btn-primary" style={{ display: "block", textAlign: "center", textDecoration: "none", padding: "9px 0", fontSize: 13 }}>
                                        Sign In
                                    </Link>
                                </div>
                            )}

                            {/* Own mentoring status */}
                            {isOwnProfile && (
                                <div className="glass-card" style={{ padding: 22 }}>
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f0f4ff", marginBottom: 10 }}>Mentoring Status</h3>
                                    <p style={{ fontSize: 13, color: member.openToMentoring ? "#34d399" : "rgba(240,244,255,0.4)", marginBottom: 14 }}>
                                        {member.openToMentoring ? "✅ You're open to mentoring" : "❌ Not accepting requests"}
                                    </p>
                                    <Link href="/profile/edit" className="btn-secondary" style={{ display: "block", textAlign: "center", textDecoration: "none", padding: "8px 0", fontSize: 13 }}>
                                        Update Settings
                                    </Link>
                                </div>
                            )}

                            {/* Links */}
                            {(member.github || member.linkedin || member.portfolioUrl) && (
                                <div className="glass-card" style={{ padding: 22 }}>
                                    <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.6)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.05em" }}>Links</h3>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        {member.github && (
                                            <a href={member.github} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(240,244,255,0.65)", textDecoration: "none" }}>
                                                <Code size={14} color="#f97316" /> GitHub
                                            </a>
                                        )}
                                        {member.linkedin && (
                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(240,244,255,0.65)", textDecoration: "none" }}>
                                                <ExternalLink size={14} color="#0ea5e9" /> LinkedIn
                                            </a>
                                        )}
                                        {member.portfolioUrl && (
                                            <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(240,244,255,0.65)", textDecoration: "none" }}>
                                                <Star size={14} color="#a78bfa" /> Portfolio
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <style>{`
                @media (max-width: 900px) { .member-layout { grid-template-columns: 1fr !important; } }
            `}</style>
        </>
    );
}
