import { auth } from "../../../auth";
import prisma from "@/lib/prisma";
import Footer from "@/components/Footer";
import ProposalVoteButton from "@/components/ProposalVoteButton";
import { Vote, Plus, Users, Landmark } from "lucide-react";
import { createProposal } from "@/lib/actions/governance";

export const metadata = {
    title: "Governance — DevCircle",
};

export default async function GovernancePage() {
    const session = await auth();

    const proposals = await prisma.proposal.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            author: { select: { name: true, image: true, reputation: true } },
            votes: true
        }
    });

    const activeProposals = proposals.filter(p => p.status === "Active");
    const pastProposals = proposals.filter(p => p.status !== "Active");

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            {/* Hero Section */}
            <section style={{ padding: "80px 0 60px", background: "rgba(13,17,32,0.5)", position: "relative", overflow: "hidden" }} className="grid-bg">
                <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "#6366f1", filter: "blur(150px)", opacity: 0.1, top: -150, right: -100, zIndex: 0, pointerEvents: "none" }} />

                <div className="container" style={{ position: "relative", zIndex: 2, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 30 }}>
                    <div style={{ maxWidth: 600 }}>
                        <div className="fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", marginBottom: 20, color: "#818cf8", fontSize: 13, fontWeight: 600 }}>
                            <Landmark size={14} /> Community Governance
                        </div>
                        <h1 style={{ fontSize: 42, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 16px 0", letterSpacing: "-1px" }}>
                            Shape the future of <span style={{ color: "#818cf8" }}>DevCircle</span>
                        </h1>
                        <p style={{ fontSize: 18, color: "rgba(240,244,255,0.6)", margin: 0, lineHeight: 1.6 }}>
                            Propose new platform features, vote on community guidelines, and elect moderators. Your voice directly steers our network.
                        </p>
                    </div>
                    {session?.user && (
                        <div className="glass-card" style={{ padding: 24, width: "100%", maxWidth: 380 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
                                <Plus size={18} color="#818cf8" /> New Proposal
                            </h3>
                            <form action={async (formData) => { "use server"; await createProposal(formData); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <div>
                                    <input name="title" className="input" placeholder="Proposal Title" required style={{ width: "100%", fontSize: 14 }} />
                                </div>
                                <div>
                                    <textarea name="description" className="input" placeholder="Explain your proposal..." rows={4} required style={{ width: "100%", fontSize: 14, resize: "none" }}></textarea>
                                </div>
                                <button type="submit" className="btn-primary" style={{ padding: "10px", width: "100%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", border: "none" }}>
                                    Submit for Voting
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>

            {/* Content */}
            <section className="section" style={{ flex: 1 }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 16 }}>
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                            <Vote size={20} color="#818cf8" /> Active Proposals <span style={{ fontSize: 14, background: "rgba(99,102,241,0.15)", color: "#818cf8", padding: "2px 8px", borderRadius: 100 }}>{activeProposals.length}</span>
                        </h2>
                    </div>

                    {activeProposals.length === 0 ? (
                        <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
                            <Vote size={48} style={{ margin: "0 auto 20px", opacity: 0.3 }} color="#f0f4ff" />
                            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f0f4ff", margin: "0 0 8px 0" }}>No active proposals</h2>
                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", margin: 0 }}>The community is quiet right now. Be the first to propose a change above.</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {activeProposals.map(proposal => {
                                const yesCount = proposal.votes.filter(v => v.vote === "Yes").length;
                                const noCount = proposal.votes.filter(v => v.vote === "No").length;
                                const userVote = session?.user?.id ? proposal.votes.find(v => v.userId === session.user.id)?.vote as "Yes" | "No" : null;

                                return (
                                    <div key={proposal.id} className="glass-card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
                                        {/* Colored accent line */}
                                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#818cf8" }} />

                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                            <span style={{ fontSize: 11, background: "rgba(99,102,241,0.1)", color: "#818cf8", padding: "4px 10px", borderRadius: 100, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                Voting Open
                                            </span>
                                            <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>
                                                {proposal.createdAt.toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", marginBottom: 12, lineHeight: 1.4 }}>{proposal.title}</h3>
                                        <p style={{ fontSize: 15, color: "rgba(240,244,255,0.6)", lineHeight: 1.6, marginBottom: 20 }}>{proposal.description}</p>

                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                            <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "white" }}>
                                                {proposal.author.name?.substring(0, 2).toUpperCase() || 'U'}
                                            </div>
                                            <span style={{ fontSize: 13, color: "rgba(240,244,255,0.4)" }}>
                                                Proposed by <span style={{ color: "#f0f4ff" }}>{proposal.author.name}</span>
                                            </span>
                                        </div>

                                        <ProposalVoteButton
                                            proposalId={proposal.id}
                                            yesCount={yesCount}
                                            noCount={noCount}
                                            userVote={userVote}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Past Proposals */}
                    {pastProposals.length > 0 && (
                        <>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 48, marginBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 16 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                                    Past Proposals <span style={{ fontSize: 14, background: "rgba(255,255,255,0.05)", color: "rgba(240,244,255,0.5)", padding: "2px 8px", borderRadius: 100 }}>{pastProposals.length}</span>
                                </h2>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {pastProposals.map(proposal => {
                                    const yesCount = proposal.votes.filter(v => v.vote === "Yes").length;
                                    const noCount = proposal.votes.filter(v => v.vote === "No").length;
                                    return (
                                        <div key={proposal.id} className="glass-card" style={{ padding: 24, opacity: 0.7, position: "relative", overflow: "hidden" }}>
                                            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: proposal.status === "Approved" ? "#10b981" : "#ef4444" }} />
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                                                <span style={{ fontSize: 11, background: proposal.status === "Approved" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: proposal.status === "Approved" ? "#10b981" : "#ef4444", padding: "4px 10px", borderRadius: 100, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                                    {proposal.status}
                                                </span>
                                                <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>{proposal.createdAt.toLocaleDateString()}</span>
                                            </div>
                                            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#f0f4ff", marginBottom: 8 }}>{proposal.title}</h3>
                                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", marginBottom: 12 }}>{proposal.description}</p>
                                            <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
                                                <span style={{ color: "#10b981" }}>{yesCount} Yes</span>
                                                <span style={{ color: "#ef4444" }}>{noCount} No</span>
                                                <span style={{ color: "rgba(240,244,255,0.4)" }}>by {proposal.author.name}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
