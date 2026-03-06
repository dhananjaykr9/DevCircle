import Link from "next/link";
import { BarChart2, Users, Plus, Clock, CalendarClock } from "lucide-react";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import PollVoteButton from "@/components/PollVoteButton";

export const metadata = {
    title: "Community Polls — DevCircle",
    description: "Vote on community polls about meetup topics, tech trends, and platform decisions.",
};

export default async function PollsPage() {
    const session = await auth();
    const userId = session?.user?.id;

    const polls = await prisma.poll.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            author: true,
            city: true,
            options: {
                include: {
                    votes: { select: { id: true } },
                },
            },
        },
    });

    // Collect user's vote mapping optionId -> pollId
    const userVotes = userId
        ? await prisma.pollVote.findMany({
            where: {
                userId,
                pollOption: { poll: { id: { in: polls.map((p) => p.id) } } },
            },
            select: { pollOptionId: true },
        })
        : [];
    const votedOptionIds = new Set(userVotes.map((v) => v.pollOptionId));

    return (
        <>
            {/* Header */}
            <section style={{ padding: "64px 0 48px", background: "rgba(13,17,32,0.5)" }} className="grid-bg">
                <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "#10b981", filter: "blur(100px)", opacity: 0.08, top: -80, right: -60, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2 }}>
                    <span className="tag" style={{ marginBottom: 14, display: "inline-flex", background: "rgba(16,185,129,0.12)", color: "#34d399", borderColor: "rgba(16,185,129,0.25)" }}>Community Voice</span>
                    <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-1px", color: "#f0f4ff", marginBottom: 12 }}>
                        Community <span style={{ color: "#34d399" }}>Polls</span>
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.45)", maxWidth: 520, lineHeight: 1.7, marginBottom: 28 }}>
                        Shape the direction of your local tech community. Vote on meetup topics, technology trends, and governance decisions.
                    </p>
                    {session?.user && (
                        <Link href="/polls/new" className="btn-primary" style={{ display: "inline-flex" }}>
                            <Plus size={16} /> Create Poll
                        </Link>
                    )}
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {polls.length === 0 ? (
                        <div className="glass-card" style={{ padding: 60, textAlign: "center", maxWidth: 500, margin: "0 auto" }}>
                            <BarChart2 size={48} color="rgba(240,244,255,0.1)" style={{ margin: "0 auto 16px" }} />
                            <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f0f4ff", marginBottom: 8 }}>No polls yet</h3>
                            <p style={{ color: "rgba(240,244,255,0.5)", fontSize: 14, marginBottom: 20 }}>Be the first to create a community poll!</p>
                            {session?.user && (
                                <Link href="/polls/new" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
                                    <Plus size={16} /> Create First Poll
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: 20 }} className="polls-grid">
                            {polls.map((poll) => {
                                const totalVotes = poll.options.reduce((sum, o) => sum + o.votes.length, 0);
                                const isExpired = poll.endsAt ? new Date() > poll.endsAt : false;
                                const userVotedOptionId = poll.options.find((o) => votedOptionIds.has(o.id))?.id ?? null;
                                const daysAgo = Math.floor((Date.now() - poll.createdAt.getTime()) / 86400000);

                                return (
                                    <div key={poll.id} className="glass-card" style={{ padding: 24 }}>
                                        {/* Header row */}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 100, background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}>
                                                    {poll.city.name}
                                                </span>
                                                {isExpired && (
                                                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 100, background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                                                        Closed
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(240,244,255,0.3)" }}>
                                                <Clock size={10} /> {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                                            </div>
                                        </div>

                                        {/* Question */}
                                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: poll.description ? 8 : 0, lineHeight: 1.4, fontFamily: "'Space Grotesk', sans-serif" }}>
                                            {poll.question}
                                        </h3>
                                        {poll.description && (
                                            <p style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", lineHeight: 1.6, marginBottom: 4 }}>{poll.description}</p>
                                        )}

                                        {/* Poll options (client component for voting) */}
                                        <PollVoteButton
                                            pollId={poll.id}
                                            options={poll.options}
                                            userVotedOptionId={userId ? userVotedOptionId : null}
                                            totalVotes={totalVotes}
                                            isExpired={isExpired}
                                        />

                                        {/* Footer */}
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <img
                                                    src={poll.author.image || `https://ui-avatars.com/api/?name=${poll.author.name || "U"}&background=10b981&color=fff&size=24`}
                                                    alt={poll.author.name || "User"}
                                                    style={{ width: 22, height: 22, borderRadius: "50%" }}
                                                />
                                                <span style={{ fontSize: 12, color: "rgba(240,244,255,0.45)" }}>{poll.author.name}</span>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(240,244,255,0.35)" }}>
                                                <Users size={12} /> {totalVotes} vote{totalVotes !== 1 ? "s" : ""}
                                                {poll.endsAt && !isExpired && (
                                                    <span style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 10 }}>
                                                        <CalendarClock size={11} />
                                                        Ends {poll.endsAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
            <style>{`
                @media (max-width: 600px) { .polls-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </>
    );
}
