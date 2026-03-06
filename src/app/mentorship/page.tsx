import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Search, MapPin, Briefcase, GraduationCap, Users } from "lucide-react";
import { toggleMentorStatus } from "@/lib/actions/mentorship";

export const metadata = {
    title: "Mentorship Hub — DevCircle",
};

export default async function MentorshipPage() {
    const session = await auth();

    const currentUser = session?.user?.id ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { openToMentoring: true }
    }) : null;

    const mentors = await prisma.user.findMany({
        where: { openToMentoring: true },
        include: { city: true },
        orderBy: { reputation: "desc" },
        take: 50
    });

    const totalMentors = await prisma.user.count({ where: { openToMentoring: true } });

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <section style={{ padding: "64px 0 48px", background: "rgba(13,17,32,0.5)", borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="grid-bg">
                <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#8b5cf6", filter: "blur(120px)", opacity: 0.1, top: -100, left: -50, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 30 }}>
                    <div style={{ maxWidth: 600 }}>
                        <div className="fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", marginBottom: 16, color: "#a78bfa", fontSize: 13, fontWeight: 600 }}>
                            <GraduationCap size={14} /> Knowledge Exchange
                        </div>
                        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-1px", color: "#f0f4ff", marginBottom: 12 }}>
                            Mentorship <span style={{ color: "#8b5cf6" }}>Network</span>
                        </h1>
                        <p style={{ fontSize: 16, color: "rgba(240,244,255,0.45)", lineHeight: 1.7, marginBottom: 0 }}>
                            Connect with senior engineers in your city, request guidance, or volunteer to mentor freshers and juniors.
                        </p>
                    </div>

                    {session?.user && (
                        <div className="glass-card" style={{ padding: 24, flex: "1 1 300px", maxWidth: 400 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", marginBottom: 8 }}>Become a Mentor</h3>
                            <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: 16 }}>
                                Giving back to the community is the best way to grow. Volunteer to answer questions or do 1-on-1 calls.
                            </p>

                            {currentUser?.openToMentoring ? (
                                <form action={async () => { "use server"; await toggleMentorStatus("opt-out"); }}>
                                    <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", border: "1px solid rgba(239, 68, 68, 0.3)", color: "rgba(239, 68, 68, 0.8)" }}>
                                        Opt-Out of Mentoring
                                    </button>
                                </form>
                            ) : (
                                <form action={async () => { "use server"; await toggleMentorStatus("opt-in"); }}>
                                    <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", border: "none" }}>
                                        Opt-In to Mentoring
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </section>

            <section className="section" style={{ flex: 1 }}>
                <div className="container">

                    {/* Filters */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap", alignItems: "center" }}>
                        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,244,255,0.3)" }} />
                            <input className="input" placeholder="Search mentors by tech stack, role, or company..." style={{ paddingLeft: 38 }} suppressHydrationWarning />
                        </div>
                        <select className="input" style={{ minWidth: 160 }}>
                            <option value="">Any Experience</option>
                            <option value="Senior Engineer">Senior Engineer</option>
                            <option value="Architect / Tech Lead">Architect</option>
                        </select>
                        <select className="input" style={{ minWidth: 140 }}>
                            <option value="">Any City</option>
                        </select>

                        <div style={{ marginLeft: "auto", fontSize: 13, color: "rgba(240,244,255,0.4)", display: "flex", alignItems: "center", gap: 6 }}>
                            <Users size={14} /> <strong>{totalMentors}</strong> community mentors
                        </div>
                    </div>

                    {/* Mentors Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
                        {mentors.length === 0 ? (
                            <div className="glass-card" style={{ padding: 60, textAlign: "center", gridColumn: "1/-1" }}>
                                <GraduationCap size={40} style={{ margin: "0 auto 16px", opacity: 0.2 }} color="#f0f4ff" />
                                <h3 style={{ fontSize: 18, color: "#f0f4ff", margin: "0 0 8px 0" }}>No mentors available</h3>
                                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", margin: 0 }}>Be the first to step up and guide others in your city.</p>
                            </div>
                        ) : mentors.map(mentor => (
                            <div key={mentor.id} className="glass-card" style={{ padding: 24, display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                                    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white", flexShrink: 0 }}>
                                        {mentor.image ? <img src={mentor.image} style={{ width: '100%', height: '100%', borderRadius: "50%" }} /> : (mentor.name?.[0] || "?")}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#f0f4ff", margin: "0 0 4px 0" }}>{mentor.name}</h3>
                                        <div style={{ fontSize: 13, color: "rgba(240,244,255,0.6)", display: "flex", flexDirection: "column", gap: 4 }}>
                                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Briefcase size={12} /> {mentor.jobTitle || mentor.role} {mentor.company && `at ${mentor.company}`}</span>
                                            {mentor.city && <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={12} /> {mentor.city.name}</span>}
                                        </div>
                                    </div>
                                </div>

                                <p style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", lineHeight: 1.6, flex: 1, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                    {mentor.bio || "Happy to help review code, give career advice, and do mock interviews."}
                                </p>

                                {mentor.skills && (
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                                        {mentor.skills.split(',').slice(0, 4).map(skill => (
                                            <span key={skill} style={{ fontSize: 11, padding: "2px 8px", background: "rgba(255,255,255,0.05)", color: "rgba(240,244,255,0.6)", borderRadius: 4 }}>
                                                {skill.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div style={{ marginTop: "auto" }}>
                                    <Link href={`/messages/${mentor.id}`} className="btn-secondary" style={{ width: "100%", justifyContent: "center", fontSize: 13, border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa" }}>
                                        Request Mentorship
                                    </Link>
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
