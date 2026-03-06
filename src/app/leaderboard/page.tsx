import { auth } from "../../../auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Trophy, Medal, Star, Award } from "lucide-react";

export const metadata = {
    title: "Leaderboard — DevCircle",
    description: "Top contributors and community members in DevCircle.",
};

export default async function LeaderboardPage() {
    const session = await auth();

    // Fetch top 50 users by reputation
    const topUsers = await prisma.user.findMany({
        orderBy: { reputation: "desc" },
        take: 20,
        where: { reputation: { gt: 0 } }, // Only show users with at least 1 rep
        include: {
            city: true,
            userBadges: {
                include: { badge: true }
            }
        }
    });

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            {/* Hero Section */}
            <section style={{ padding: "60px 0 40px", background: "rgba(13,17,32,0.5)", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#f59e0b", filter: "blur(120px)", opacity: 0.1, top: -100, left: "50%", transform: "translateX(-50%)", zIndex: 0, pointerEvents: "none" }} />

                <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 20, background: "rgba(245,158,11,0.1)", marginBottom: 20, border: "2px solid rgba(245,158,11,0.2)" }}>
                        <Trophy size={32} color="#f59e0b" />
                    </div>
                    <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
                        Top Contributors
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.6)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
                        These developers are shaping the DevCircle community by answering questions, mentoring others, and sharing great resources.
                    </p>
                </div>
            </section>

            {/* Leaderboard Table */}
            <section className="section" style={{ flex: 1, paddingTop: 0 }}>
                <div className="container" style={{ maxWidth: 900 }}>

                    <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                        {topUsers.length === 0 ? (
                            <div style={{ padding: 60, textAlign: "center", color: "rgba(240,244,255,0.4)" }}>
                                <Star size={32} style={{ marginBottom: 16, opacity: 0.5 }} />
                                <p style={{ fontSize: 15, margin: 0 }}>No reputation points have been awarded yet.</p>
                                <p style={{ fontSize: 13, marginTop: 8 }}>Be the first to get on the board by posting or helping others!</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {/* Table Header */}
                                <div style={{ display: "grid", gridTemplateColumns: "60px 1fr 140px", gap: 16, padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.02)", fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.5)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    <div style={{ textAlign: "center" }}>Rank</div>
                                    <div>Developer</div>
                                    <div style={{ textAlign: "right" }}>Reputation</div>
                                </div>

                                {/* Rows */}
                                {topUsers.map((user, index) => {
                                    const rank = index + 1;
                                    let rankColor = "rgba(255,255,255,0.1)";
                                    let rankBg = "transparent";
                                    let rankIcon = null;

                                    if (rank === 1) {
                                        rankColor = "#fbbf24"; // Gold
                                        rankBg = "rgba(251,191,36,0.1)";
                                        rankIcon = <Medal size={16} color="#fbbf24" />;
                                    } else if (rank === 2) {
                                        rankColor = "#94a3b8"; // Silver
                                        rankBg = "rgba(148,163,184,0.1)";
                                        rankIcon = <Medal size={16} color="#94a3b8" />;
                                    } else if (rank === 3) {
                                        rankColor = "#b45309"; // Bronze
                                        rankBg = "rgba(180,83,9,0.1)";
                                        rankIcon = <Medal size={16} color="#b45309" />;
                                    }

                                    return (
                                        <Link
                                            key={user.id}
                                            href={`/members/${user.id}`}
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "60px 1fr 140px",
                                                gap: 16,
                                                padding: "16px 24px",
                                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                                textDecoration: "none",
                                                alignItems: "center",
                                                transition: "background 0.2s"
                                            }}
                                            className="hover-bg-light"
                                        >
                                            {/* Rank */}
                                            <div style={{ display: "flex", justifyContent: "center" }}>
                                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: rankBg, border: `1px solid ${rank === 1 || rank === 2 || rank === 3 ? rankColor : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: rank <= 3 ? 0 : 14, fontWeight: 700, color: rank <= 3 ? rankColor : "rgba(240,244,255,0.5)" }}>
                                                    {rankIcon || rank}
                                                </div>
                                            </div>

                                            {/* User Info */}
                                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                {user.image ? (
                                                    <img src={user.image} alt={user.name || "User"} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: rank === 1 ? "2px solid #fbbf24" : "none" }} />
                                                ) : (
                                                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: 18, border: rank === 1 ? "2px solid #fbbf24" : "none" }}>
                                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: 8 }}>
                                                        {user.name}
                                                        {user.role === "MODERATOR" && (
                                                            <span title="Moderator" style={{ display: "inline-flex", padding: 2, background: "rgba(249,115,22,0.15)", borderRadius: 4, color: "#f97316" }}>
                                                                <Award size={12} />
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", margin: 0 }}>
                                                        {(user as any).jobTitle || "Developer"} {(user as any).city ? `· ${(user as any).city.name}` : ""}
                                                    </p>

                                                    {/* Badges Preview */}
                                                    {(user as any).userBadges.length > 0 && (
                                                        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                                                            {(user as any).userBadges.slice(0, 3).map((ub: any) => (
                                                                <span key={ub.id} title={ub.badge.name} style={{ fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, background: "rgba(255,255,255,0.05)", borderRadius: 4 }}>
                                                                    {ub.badge.icon}
                                                                </span>
                                                            ))}
                                                            {(user as any).userBadges.length > 3 && (
                                                                <span style={{ fontSize: 10, color: "rgba(240,244,255,0.4)", display: "flex", alignItems: "center", paddingLeft: 4 }}>...</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Reputation Points */}
                                            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                                                <div style={{ fontSize: 20, fontWeight: 800, color: rank === 1 ? "#fbbf24" : "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                                                    {user.reputation} <Star size={14} fill={rank <= 3 ? rankColor : "transparent"} color={rank <= 3 ? rankColor : "rgba(240,244,255,0.3)"} />
                                                </div>
                                                <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>Rep Points</div>
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
