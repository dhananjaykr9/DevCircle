import Link from "next/link";
import { MapPin, Users, MessageSquare, Zap, Calendar, ArrowRight, Star, Code2, Award, Globe, BookOpen, Rocket, Shield, Heart, Target, Lightbulb, TrendingUp, HandHeart, Coffee } from "lucide-react";
import Footer from "@/components/Footer";
import WaitlistButton from "@/components/WaitlistButton";
import prisma from "@/lib/prisma";

export async function generateStaticParams() {
    try {
        const cities = await prisma.city.findMany({ select: { id: true } });
        return cities.map((c) => ({ city: c.id }));
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
    const { city } = await params;
    let cityData = await prisma.city.findUnique({
        where: { id: city },
        include: { _count: { select: { members: true } } }
    });
    if (!cityData) {
        cityData = await prisma.city.findFirst({
            where: { name: { equals: city, mode: 'insensitive' } },
            include: { _count: { select: { members: true } } }
        });
    }
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

    let cityData = await prisma.city.findUnique({
        where: { id: city },
        include: {
            _count: { select: { members: true, posts: true, events: true } }
        }
    });
    if (!cityData) {
        cityData = await prisma.city.findFirst({
            where: { name: { equals: city, mode: 'insensitive' } },
            include: {
                _count: { select: { members: true, posts: true, events: true } }
            }
        });
    }

    if (!cityData) {
        return <div className="container" style={{ paddingTop: 120 }}>Community not found.</div>;
    }

    const cityDiscussions = await prisma.post.findMany({
        where: { cityId: cityData.id },
        take: 4,
        orderBy: { createdAt: 'desc' },
        include: { author: true, _count: { select: { comments: true, upvotes: true } } }
    });

    const cityProjects = await prisma.project.findMany({
        where: { cityId: cityData.id },
        take: 3,
        orderBy: { createdAt: 'desc' }
    });

    const cityEvents = await prisma.event.findMany({
        where: { cityId: cityData.id },
        take: 3,
        orderBy: { date: 'asc' }
    });

    const cityMembers = await prisma.user.findMany({
        where: { cityId: cityData.id },
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
                                        {cityData.isActive ? (
                                            <>
                                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 6px #10b981", marginLeft: 4 }} />
                                                <span style={{ color: "#10b981" }}>Active</span>
                                            </>
                                        ) : (
                                            <>
                                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#a78bfa", display: "inline-block", boxShadow: "0 0 6px #a78bfa", marginLeft: 4 }} />
                                                <span style={{ color: "#a78bfa" }}>Waitlist</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {cityData.isActive ? (
                            <Link href={`/communities/${cityData.id}`} className="btn-primary">
                                Join Community <ArrowRight size={15} />
                            </Link>
                        ) : (
                            <WaitlistButton cityName={cityData.name} variant="primary" />
                        )}
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

            {/* Waitlist banner for non-active cities */}
            {!cityData.isActive && (
                <div style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(249,115,22,0.06))", borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
                    <div className="container" style={{ padding: "20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", boxShadow: "0 0 8px #a78bfa" }} />
                            <div>
                                <span style={{ fontWeight: 700, color: "#f0f4ff", fontSize: 14 }}>This community is on the waitlist</span>
                                <p style={{ fontSize: 12, color: "rgba(240,244,255,0.45)", margin: "2px 0 0" }}>
                                    DevCircle {cityData.name} is not yet live. Currently only <Link href="/communities/nagpur" style={{ color: "#f97316", textDecoration: "underline" }}>Nagpur</Link> is active.
                                </p>
                            </div>
                        </div>
                        <WaitlistButton cityName={cityData.name} variant="banner" />
                    </div>
                </div>
            )}

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
                                    href={`/communities/${cityData.id}?tab=${tabKey}`}
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
                                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                                    {/* Hero About Card */}
                                    <div className="glass-card" style={{ padding: 0, overflow: "hidden", position: "relative" }}>
                                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: cityData.isActive ? "linear-gradient(90deg, #f97316, #ea580c, #f97316)" : "linear-gradient(90deg, #8b5cf6, #a78bfa, #8b5cf6)" }} />
                                        <div style={{ padding: "36px 32px 28px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                                <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "white", fontFamily: "'Space Grotesk', sans-serif", flexShrink: 0 }}>DC</div>
                                                <div>
                                                    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, color: "#f0f4ff", letterSpacing: "-0.5px", margin: 0 }}>
                                                        About DevCircle <span style={{ color: "#f97316" }}>{cityData.name}</span>
                                                    </h2>
                                                    <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>
                                                        {cityData.state} · {cityData.tier} · Est. 2025
                                                    </div>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: 15, color: "rgba(240,244,255,0.55)", lineHeight: 1.85, marginBottom: 20, maxWidth: 600 }}>
                                                DevCircle {cityData.name} is a hyper-local tech community connecting {cityData._count.members} developers, designers, and tech enthusiasts across {cityData.name}. We foster collaboration, mentorship, and real-world project building for professionals and freshers alike.
                                            </p>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                {cityData.tags?.split(',').map((tag) => (
                                                    <span key={tag} className="tag tag-blue" style={{ fontSize: 11 }}>{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Card */}
                                    <div className="glass-card" style={{ padding: "24px 28px", background: cityData.isActive ? "rgba(16,185,129,0.04)" : "rgba(139,92,246,0.04)", borderColor: cityData.isActive ? "rgba(16,185,129,0.12)" : "rgba(139,92,246,0.12)" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                <div style={{ width: 10, height: 10, borderRadius: "50%", background: cityData.isActive ? "#10b981" : "#a78bfa", boxShadow: `0 0 10px ${cityData.isActive ? "rgba(16,185,129,0.5)" : "rgba(139,92,246,0.5)"}` }} />
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: 15, color: cityData.isActive ? "#10b981" : "#a78bfa" }}>
                                                        {cityData.isActive ? "Community is Live" : "Community on Waitlist"}
                                                    </div>
                                                    <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>
                                                        {cityData.isActive
                                                            ? "Open for new members, discussions, events, and projects."
                                                            : `DevCircle ${cityData.name} is not yet live. Join the waitlist to get notified.`}
                                                    </div>
                                                </div>
                                            </div>
                                            {cityData.isActive ? (
                                                <Link href={`/communities/${cityData.id}`} className="btn-primary" style={{ fontSize: 13, padding: "10px 20px", borderRadius: 10 }}>
                                                    Join Community <ArrowRight size={13} />
                                                </Link>
                                            ) : (
                                                <WaitlistButton cityName={cityData.name} variant="small" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Community Stats Grid */}
                                    <div>
                                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                                            <TrendingUp size={16} color="#f97316" /> Community Stats
                                        </h3>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }} className="about-stats-grid">
                                            {[
                                                { val: cityData._count.members.toLocaleString(), label: "Members", icon: <Users size={18} />, color: "#f97316", bg: "rgba(249,115,22,0.08)" },
                                                { val: String(cityData._count.posts), label: "Discussions", icon: <MessageSquare size={18} />, color: "#8b5cf6", bg: "rgba(139,92,246,0.08)" },
                                                { val: String(cityData._count.events), label: "Events Hosted", icon: <Calendar size={18} />, color: "#3b82f6", bg: "rgba(59,130,246,0.08)" },
                                            ].map((stat) => (
                                                <div key={stat.label} className="glass-card" style={{ padding: "22px 16px", textAlign: "center", border: `1px solid ${stat.bg}` }}>
                                                    <div style={{ color: stat.color, marginBottom: 10, display: "flex", justifyContent: "center", filter: `drop-shadow(0 0 4px ${stat.bg})` }}>{stat.icon}</div>
                                                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 24, color: "#f0f4ff", letterSpacing: "-0.5px" }}>{stat.val}</div>
                                                    <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", marginTop: 3 }}>{stat.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* What We Offer */}
                                    <div>
                                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                                            <Lightbulb size={16} color="#f59e0b" /> What We Offer
                                        </h3>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="about-offer-grid">
                                            {[
                                                { icon: <MessageSquare size={18} />, title: "Tech Discussions", desc: "Ask questions, share knowledge, debate best practices with local devs.", color: "#8b5cf6" },
                                                { icon: <Calendar size={18} />, title: "Local Events", desc: "Meetups, hackathons, workshops, and talks hosted in your city.", color: "#3b82f6" },
                                                { icon: <Rocket size={18} />, title: "Project Collaboration", desc: "Find co-founders, team up on open-source, build together.", color: "#f97316" },
                                                { icon: <HandHeart size={18} />, title: "Mentorship", desc: "Get guidance from experienced devs or mentor newcomers.", color: "#10b981" },
                                                { icon: <BookOpen size={18} />, title: "Learning Hub", desc: "Curated resources, roadmaps, and study groups for all levels.", color: "#f59e0b" },
                                                { icon: <Target size={18} />, title: "Job Board", desc: "Local job listings, freelance gigs, and startup opportunities.", color: "#ef4444" },
                                            ].map((item) => (
                                                <div key={item.title} className="glass-card" style={{ padding: "20px 22px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: `${item.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: item.color, flexShrink: 0, marginTop: 2 }}>
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600, fontSize: 14, color: "#f0f4ff", marginBottom: 4 }}>{item.title}</div>
                                                        <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", lineHeight: 1.6 }}>{item.desc}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Community Values */}
                                    <div>
                                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                                            <Heart size={16} color="#ef4444" /> Our Values
                                        </h3>
                                        <div className="glass-card" style={{ padding: "24px 28px" }}>
                                            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                                                {[
                                                    { icon: <Globe size={16} />, title: "Hyper-Local Focus", desc: "We believe the strongest tech communities are rooted in local connections. Meet people you can grab coffee with.", color: "#3b82f6" },
                                                    { icon: <Shield size={16} />, title: "Inclusive & Safe", desc: "Zero tolerance for toxicity. We welcome developers of all experience levels, backgrounds, and tech stacks.", color: "#10b981" },
                                                    { icon: <Code2 size={16} />, title: "Open Source First", desc: "DevCircle itself is open source. We practice what we preach — transparency and collaboration.", color: "#f97316" },
                                                    { icon: <Coffee size={16} />, title: "Free Forever", desc: "No premium tiers, no paywalls. DevCircle is and will always be free for every developer.", color: "#f59e0b" },
                                                ].map((value) => (
                                                    <div key={value.title} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                                                        <div style={{ width: 32, height: 32, borderRadius: 8, background: `${value.color}10`, display: "flex", alignItems: "center", justifyContent: "center", color: value.color, flexShrink: 0, marginTop: 1 }}>
                                                            {value.icon}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, fontSize: 14, color: "#f0f4ff", marginBottom: 3 }}>{value.title}</div>
                                                            <div style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", lineHeight: 1.65 }}>{value.desc}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Links / Get Involved */}
                                    <div>
                                        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                                            <Rocket size={16} color="#8b5cf6" /> Get Involved
                                        </h3>
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="about-offer-grid">
                                            {[
                                                { href: `/communities/${cityData.id}?tab=discussions`, label: "Start a Discussion", desc: "Share your thoughts", icon: <MessageSquare size={15} />, color: "#8b5cf6" },
                                                { href: "/events/new", label: "Propose an Event", desc: "Host a local meetup", icon: <Calendar size={15} />, color: "#3b82f6" },
                                                { href: "/projects/new", label: "Submit a Project", desc: "Find collaborators", icon: <Code2 size={15} />, color: "#f97316" },
                                                { href: "/open-source", label: "Contribute to DevCircle", desc: "Improve the platform", icon: <Star size={15} />, color: "#f59e0b" },
                                            ].map((action) => (
                                                <Link key={action.label} href={action.href} style={{ textDecoration: "none" }}>
                                                    <div className="glass-card about-action-card" style={{ padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, transition: "all 0.2s" }}>
                                                        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${action.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: action.color, flexShrink: 0 }}>
                                                            {action.icon}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div style={{ fontWeight: 600, fontSize: 13, color: "#f0f4ff", marginBottom: 2 }}>{action.label}</div>
                                                            <div style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>{action.desc}</div>
                                                        </div>
                                                        <ArrowRight size={14} style={{ color: "rgba(240,244,255,0.2)" }} />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                </div>
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
        @media (max-width: 600px) {
          .about-stats-grid { grid-template-columns: 1fr !important; }
          .about-offer-grid { grid-template-columns: 1fr !important; }
        }
        .about-action-card:hover {
          border-color: rgba(249,115,22,0.2) !important;
          transform: translateX(2px);
        }
      `}</style>
        </>
    );
}
