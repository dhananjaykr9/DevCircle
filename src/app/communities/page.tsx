import Link from "next/link";
import { MapPin, Users, MessageSquare, Zap, Search, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";

export const metadata = {
    title: "Communities — DevCircle",
    description: "Browse all active DevCircle city communities across India. Find your local tech hub and join thousands of professionals and freshers.",
};

export default async function CommunitiesPage() {
    // Fetch all cities and categorize based on activity level
    const allCities = await prisma.city.findMany({
        include: {
            _count: {
                select: { members: true, posts: true, events: true }
            }
        }
    });

    const activeCities = allCities.filter(c => c.isActive);
    const inactiveCities = allCities.filter(c => !c.isActive);

    return (
        <>
            {/* Header */}
            <section
                style={{
                    padding: "80px 0 60px",
                    position: "relative",
                    overflow: "hidden",
                    background: "rgba(13,17,32,0.5)",
                }}
                className="grid-bg"
            >
                <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#8b5cf6", filter: "blur(100px)", WebkitFilter: "blur(100px)", opacity: 0.12, top: -100, right: -100, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2 }}>
                    <span className="tag tag-purple" style={{ marginBottom: 16, display: "inline-flex" }}>All Communities</span>
                    <h1
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "clamp(32px, 5vw, 52px)",
                            fontWeight: 800,
                            letterSpacing: "-1.5px",
                            color: "#f0f4ff",
                            marginBottom: 16,
                        }}
                    >
                        Find your <span className="gradient-text-purple">city&apos;s</span> hub
                    </h1>
                    <p style={{ fontSize: 17, color: "rgba(240,244,255,0.5)", maxWidth: 520, marginBottom: 32, lineHeight: 1.7 }}>
                        DevCircle is live across 12+ Indian cities. Join your local tech community and connect with professionals and early-career talent near you.
                    </p>

                    {/* Search bar */}
                    <div style={{ position: "relative", maxWidth: 460 }}>
                        <Search
                            size={16}
                            style={{
                                position: "absolute",
                                left: 14,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "rgba(240,244,255,0.35)",
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search a city..."
                            className="input"
                            style={{ paddingLeft: 40, height: 46 }}
                        />
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {/* Active cities */}
                    <div style={{ marginBottom: 48 }}>
                        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "#f0f4ff", marginBottom: 4 }}>
                            Active Communities
                        </h2>
                        <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)", marginBottom: 28 }}>
                            These cities are currently accepting members and hosting events.
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }} className="cities-grid-full">
                            {activeCities.map((city) => (
                                <Link key={city.id} href={`/communities/${city.id}`} style={{ textDecoration: "none" }}>
                                    <div
                                        className="glass-card"
                                        style={{
                                            padding: 26,
                                            position: "relative",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {/* Active dot */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: 20,
                                                right: 20,
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 5,
                                                fontSize: 11,
                                                color: "#10b981",
                                            }}
                                        >
                                            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 8px #10b981" }} />
                                            Active
                                        </div>

                                        <div style={{ marginBottom: 18 }}>
                                            <h3
                                                style={{
                                                    fontFamily: "'Space Grotesk', sans-serif",
                                                    fontSize: 22,
                                                    fontWeight: 700,
                                                    color: "#f0f4ff",
                                                    marginBottom: 6,
                                                }}
                                            >
                                                DevCircle <span style={{ color: "#f97316" }}>{city.name}</span>
                                            </h3>
                                            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(240,244,255,0.4)" }}>
                                                <MapPin size={12} />
                                                {city.state} ·
                                                <span className={city.tier === "Tier-1" ? "tag-purple" : ""} style={{
                                                    padding: "1px 8px",
                                                    borderRadius: 100,
                                                    fontSize: 11,
                                                    background: city.tier === "Tier-1" ? "rgba(139,92,246,0.15)" : "rgba(249,115,22,0.1)",
                                                    color: city.tier === "Tier-1" ? "#a78bfa" : "#fb923c",
                                                    border: `1px solid ${city.tier === "Tier-1" ? "rgba(139,92,246,0.2)" : "rgba(249,115,22,0.2)"}`,
                                                }}>
                                                    {city.tier}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats row */}
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
                                            {[
                                                { icon: <Users size={13} />, val: city._count.members.toLocaleString(), lbl: "Members" },
                                                { icon: <MessageSquare size={13} />, val: String(city._count.posts), lbl: "Discussions" },
                                                { icon: <Zap size={13} />, val: String(city._count.events), lbl: "Events" },
                                            ].map((s) => (
                                                <div
                                                    key={s.lbl}
                                                    style={{
                                                        background: "rgba(255,255,255,0.03)",
                                                        borderRadius: 10,
                                                        padding: "10px 8px",
                                                        textAlign: "center",
                                                        border: "1px solid rgba(255,255,255,0.06)",
                                                    }}
                                                >
                                                    <div style={{ color: "#f97316", marginBottom: 3, display: "flex", justifyContent: "center" }}>{s.icon}</div>
                                                    <div style={{ fontWeight: 700, fontSize: 15, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
                                                    <div style={{ fontSize: 10, color: "rgba(240,244,255,0.35)" }}>{s.lbl}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Tags */}
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                                            {city.tags?.split(',').map((tag) => (
                                                <span key={tag} className="tag tag-blue" style={{ fontSize: 11 }}>{tag}</span>
                                            ))}
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#f97316", fontSize: 13, fontWeight: 500 }}>
                                            View Community <ArrowRight size={13} />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Coming soon */}
                    <div>
                        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 600, color: "#f0f4ff", marginBottom: 4 }}>
                            Coming Soon
                        </h2>
                        <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)", marginBottom: 28 }}>
                            These communities are in waitlist mode. Be the first to join when they launch!
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }} className="coming-grid">
                            {inactiveCities.map((city) => (
                                <div
                                    key={city.id}
                                    className="glass-card"
                                    style={{ padding: 22, opacity: 0.65 }}
                                >
                                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", marginBottom: 4 }}>{city.name}</h3>
                                    <div style={{ fontSize: 12, color: "rgba(240,244,255,0.35)", marginBottom: 12 }}>
                                        <MapPin size={11} style={{ display: "inline", marginRight: 4 }} />{city.state}
                                    </div>
                                    <button
                                        className="btn-secondary"
                                        style={{ width: "100%", justifyContent: "center", padding: "8px 0", fontSize: 12, borderRadius: 8 }}
                                    >
                                        Join Waitlist
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
        @media (max-width: 900px) { .cities-grid-full { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 580px) {
          .cities-grid-full { grid-template-columns: 1fr !important; }
          .coming-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (min-width: 581px) and (max-width: 900px) {
          .coming-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
        </>
    );
}
