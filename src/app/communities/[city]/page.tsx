import Link from "next/link";
import { MapPin, Users, MessageSquare, Zap, Calendar, ArrowRight, Star, Code2, Award } from "lucide-react";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";

export async function generateStaticParams() {
    const cities = await prisma.city.findMany({ select: { id: true } });
    return cities.map((c) => ({ city: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
    const { city } = await params;
    const cityData = await prisma.city.findUnique({
        where: { id: city },
        include: { _count: { select: { members: true } } }
    });
    return {
        title: `DevCircle ${cityData?.name || city} — Tech Community`,
        description: `Join the DevCircle ${cityData?.name} tech community. Connect with ${cityData?._count.members.toLocaleString() || 0} tech enthusiasts, join discussions, and attend local events.`,
    };
}

const tabs = ["Discussions", "Events", "Projects", "Members", "About"];

export default async function CityPage({ params, searchParams }: { params: Promise<{ city: string }>; searchParams: Promise<{ tab?: string }> }) {
    const { city } = await params;
    const resolvedSearchParams = await searchParams;
    const currentTab = resolvedSearchParams.tab || "discussions";

    const cityData = await prisma.city.findUnique({
        where: { id: city },
        include: {
            _count: { select: { members: true, posts: true, events: true } }
        }
    });

    if (!cityData) {
        return <div className="container" style={{ paddingTop: 120 }}>Community not found.</div>;
    }

    const cityDiscussions = await prisma.post.findMany({
        where: { cityId: city },
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: { author: true, _count: { select: { comments: true, upvotes: true } } }
    });

    const cityProjects = await prisma.project.findMany({
        where: { cityId: city },
        take: 3,
        orderBy: { createdAt: 'desc' }
    });

    const cityEvents = await prisma.event.findMany({
        where: { cityId: city },
        take: 3,
        orderBy: { date: 'asc' }
    });

    const cityMembers = await prisma.user.findMany({
        where: { cityId: city },
        take: 5
    });

    return (
        <>
            {/* City hero */}
            <section
                style={{
                    padding: "72px 0 52px",
                    position: "relative",
                    overflow: "hidden",
                    background: "rgba(13,17,32,0.5)",
                }}
                className="grid-bg"
            >
                <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "#f97316", filter: "blur(100px)", WebkitFilter: "blur(100px)", opacity: 0.1, top: -150, right: -100, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, color: "rgba(240,244,255,0.4)", fontSize: 13 }}>
                        <Link href="/communities" style={{ color: "rgba(240,244,255,0.4)", textDecoration: "none" }}>Communities</Link>
                        <span>/</span>
                        <span style={{ color: "#f97316" }}>{cityData.name}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 36 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                                <div
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 16,
                                        background: "linear-gradient(135deg, #f97316, #ea580c)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontWeight: 800,
                                        fontSize: 22,
                                        color: "white",
                                        fontFamily: "'Space Grotesk', sans-serif",
                                        boxShadow: "0 0 20px rgba(249,115,22,0.35)",
                                    }}
                                >
                                    DC
                                </div>
                                <div>
                                    <h1
                                        style={{
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontSize: "clamp(26px, 4vw, 40px)",
                                            fontWeight: 800,
                                            color: "#f0f4ff",
                                            letterSpacing: "-1px",
                                            marginBottom: 4,
                                        }}
                                    >
                                        DevCircle <span style={{ color: "#f97316" }}>{cityData.name}</span>
                                    </h1>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "rgba(240,244,255,0.45)" }}>
                                        <MapPin size={13} />
                                        {cityData.state} · {cityData.tier}
                                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 6px #10b981", marginLeft: 4 }} />
                                        <span style={{ color: "#10b981" }}>Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Link href={`/communities/${city}`} className="btn-primary">
                            Join Community <ArrowRight size={15} />
                        </Link>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                        {[
                            { icon: <Users size={16} />, val: cityData._count.members.toLocaleString(), lbl: "Members", color: "#f97316" },
                            { icon: <MessageSquare size={16} />, val: String(cityData._count.posts), lbl: "Discussions", color: "#8b5cf6" },
                            { icon: <Calendar size={16} />, val: String(cityData._count.events), lbl: "Events", color: "#3b82f6" },
                            { icon: <Star size={16} />, val: "4.9", lbl: "Rating", color: "#f59e0b" },
                        ].map((s) => (
                            <div
                                key={s.lbl}
                                style={{
                                    padding: "14px 22px",
                                    borderRadius: 12,
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <span style={{ color: s.color }}>{s.icon}</span>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 18, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
                                    <div style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>{s.lbl}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                        {cityData.tags?.split(',').map((tag) => (
                            <span key={tag} className="tag tag-blue" style={{ fontSize: 12 }}>{tag}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(8,11,20,0.7)", position: "sticky", top: 68, zIndex: 50 }}>
                <div className="container">
                    <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
                        {tabs.map((tab) => {
                            const tabKey = tab.toLowerCase();
                            const isActive = currentTab === tabKey;
                            return (
                                <Link
                                    key={tab}
                                    href={`/communities/${city}?tab=${tabKey}`}
                                    scroll={false}
                                    style={{
                                        padding: "14px 18px",
                                        background: "none",
                                        borderBottom: isActive ? "2px solid #f97316" : "2px solid transparent",
                                        color: isActive ? "#f97316" : "rgba(240,244,255,0.5)",
                                        fontSize: 14,
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        whiteSpace: "nowrap",
                                        transition: "all 0.2s",
                                        textDecoration: "none",
                                    }}
                                >
                                    {tab}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className="section">
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }} className="city-layout">

                        {/* Main content - tab-aware */}
                        <div>
                            {(currentTab === "discussions" || !currentTab) && (
                                <>
                                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "#f0f4ff", marginBottom: 20 }}>
                                        Recent Discussions
                                    </h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 40 }}>
                                        {cityDiscussions.length === 0 && <div className="glass-card" style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>No discussions yet. Start one!</div>}
                                        {cityDiscussions.map((d) => (
                                    <Link key={d.id} href="/discussions" style={{ textDecoration: "none" }}>
                                        <div className="glass-card" style={{ padding: "18px 22px" }}>
                                            <div style={{ display: "flex", gap: 16 }}>
                                                <div style={{ textAlign: "center", minWidth: 40 }}>
                                                    <div style={{ fontWeight: 800, fontSize: 16, color: "#f97316" }}>{d._count.upvotes}</div>
                                                    <div style={{ fontSize: 10, color: "rgba(240,244,255,0.3)" }}>votes</div>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: "flex", gap: 6, marginBottom: 7, flexWrap: "wrap" }}>
                                                        <span className="tag" style={{ fontSize: 10 }}>{d.category}</span>
                                                        {d.tags?.split(',').slice(0, 2).map((t) => (
                                                            <span key={t} style={{ fontSize: 11, color: "rgba(240,244,255,0.35)", padding: "2px 8px", background: "rgba(255,255,255,0.04)", borderRadius: 100, border: "1px solid rgba(255,255,255,0.06)" }}>{t}</span>
                                                        ))}
                                                    </div>
                                                    <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff", marginBottom: 6, lineHeight: 1.45 }}>{d.title}</h3>
                                                    <div style={{ display: "flex", gap: 14, fontSize: 12, color: "rgba(240,244,255,0.4)" }}>
                                                        <span>{d.author.name}</span>
                                                        <span>{d._count.comments} replies</span>
                                                        <span>Recently</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                                </>
                            )}

                            {currentTab === "projects" && (
                                <>
                                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "#f0f4ff", marginBottom: 20 }}>
                                        Active Projects
                                    </h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                        {cityProjects.length === 0 && <div className="glass-card" style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>No projects yet.</div>}
                                        {cityProjects.map((p) => (
                                    <div key={p.id} className="glass-card" style={{ padding: "20px 24px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                                            <span className={`tag ${p.type === "Open Source" ? "tag-green" : p.type === "Startup" ? "" : "tag-purple"}`} style={{ fontSize: 11 }}>
                                                {p.type}
                                            </span>
                                            <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>Team: {p.teamSize}</span>
                                        </div>
                                        <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 8, lineHeight: 1.4 }}>{p.title}</h3>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                                            {p.techStack?.split(',').slice(0, 4).map((t) => (
                                                <span key={t} className="tag tag-blue" style={{ fontSize: 10 }}>{t}</span>
                                            ))}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>Looking for: {p.lookingFor?.split(',')[0]}</span>
                                            <Link href="/projects" className="btn-secondary" style={{ padding: "5px 14px", fontSize: 12, borderRadius: 8 }}>
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                                </>
                            )}

                            {currentTab === "events" && (
                                <>
                                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "#f0f4ff", marginBottom: 20 }}>
                                        Upcoming Events
                                    </h2>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                        {cityEvents.length === 0 && <div className="glass-card" style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.4)" }}>No upcoming events.</div>}
                                        {cityEvents.map((ev) => (
                                            <div key={ev.id} className="glass-card" style={{ padding: "20px 24px" }}>
                                                <div style={{ fontSize: 12, color: "#10b981", marginBottom: 6, fontWeight: 600 }}>{ev.date.toLocaleDateString()} · {ev.time}</div>
                                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 8 }}>{ev.title}</h3>
                                                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "rgba(240,244,255,0.4)" }}>
                                                    <span>{ev.type}</span>
                                                    <span>{ev.venue}</span>
                                                    <span>{ev.fee}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {currentTab === "members" && (
                                <>
                                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "#f0f4ff", marginBottom: 20 }}>
                                        Community Members
                                    </h2>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
                                        {cityMembers.map((m, i) => (
                                            <Link key={m.id} href={`/members/${m.id}`} style={{ textDecoration: "none" }}>
                                                <div className="glass-card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 12 }}>
                                                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${["#f97316", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"][i % 5]}, ${["#ea580c", "#7c3aed", "#2563eb", "#059669", "#d97706"][i % 5]})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>
                                                        {m.name?.substring(0, 2).toUpperCase() || "U"}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>{m.name}</div>
                                                        <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>{m.experienceLevel || "Member"}</div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}

                            {currentTab === "about" && (
                                <>
                                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 600, color: "#f0f4ff", marginBottom: 20 }}>
                                        About DevCircle {cityData.name}
                                    </h2>
                                    <div className="glass-card" style={{ padding: 28 }}>
                                        <p style={{ fontSize: 15, color: "rgba(240,244,255,0.6)", lineHeight: 1.8, marginBottom: 24 }}>
                                            DevCircle {cityData.name} is a hyper-local tech community in {cityData.state}. We connect professionals and freshers
                                            for collaboration, mentorship, and growth. Join {cityData._count.members} members building the future of tech in {cityData.name}.
                                        </p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                            {cityData.tags?.split(',').map((tag) => (
                                                <span key={tag} className="tag tag-blue" style={{ fontSize: 12 }}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div>
                            {/* Upcoming Events */}
                            <div className="glass-card" style={{ padding: 22, marginBottom: 20 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                                    <Zap size={15} color="#f97316" /> Upcoming Events
                                </h3>
                                {cityEvents.length > 0 ? cityEvents.map((ev) => (
                                    <div key={ev.id} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div style={{ fontSize: 12, color: "#10b981", marginBottom: 4, fontWeight: 500 }}>{ev.date.toLocaleDateString()}</div>
                                        <div style={{ fontSize: 13, fontWeight: 500, color: "#f0f4ff", marginBottom: 4, lineHeight: 1.4 }}>{ev.title}</div>
                                        <div style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>{ev.type} · {ev.fee}</div>
                                    </div>
                                )) : <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginBottom: 16 }}>No upcoming events scheduled yet.</div>}
                                <Link href="/events" style={{ fontSize: 13, color: "#f97316", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                                    All events <ArrowRight size={12} />
                                </Link>
                            </div>

                            {/* Top Members */}
                            <div className="glass-card" style={{ padding: 22 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                                    <Award size={15} color="#8b5cf6" /> Top Members
                                </h3>
                                {cityMembers.slice(0, 5).map((m, i) => (
                                    <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                        <div
                                            style={{
                                                width: 34,
                                                height: 34,
                                                borderRadius: "50%",
                                                background: `linear-gradient(135deg, ${["#f97316", "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b"][i]}, ${["#ea580c", "#7c3aed", "#2563eb", "#059669", "#d97706"][i]})`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: "white",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {m.name?.substring(0, 2).toUpperCase() || "U"}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>{m.name}</div>
                                            <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)" }}>{m.github ? "Developer" : "Member"}</div>
                                        </div>
                                    </div>
                                ))}
                                <Link href="/profile" style={{ fontSize: 13, color: "#f97316", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                                    View all members <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
        @media (max-width: 900px) { .city-layout { grid-template-columns: 1fr !important; } }
      `}</style>
        </>
    );
}
