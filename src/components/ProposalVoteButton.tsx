"use client";

import { useTransition } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { voteProposal } from "@/lib/actions/governance";

export default function ProposalVoteButton({
    proposalId,
    userVote,
    yesCount,
    noCount
}: {
    proposalId: string;
    userVote: "Yes" | "No" | null;
    yesCount: number;
    noCount: number;
}) {
    const [isPending, startTransition] = useTransition();

    const total = yesCount + noCount;
    const yesPercent = total > 0 ? Math.round((yesCount / total) * 100) : 0;
    const noPercent = total > 0 ? Math.round((noCount / total) * 100) : 0;

    return (
        <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <button
                    onClick={() => startTransition(() => voteProposal(proposalId, "Yes"))}
                    disabled={isPending}
                    style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: userVote === "Yes" ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        background: userVote === "Yes" ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)",
                        color: userVote === "Yes" ? "#10b981" : "rgba(240,244,255,0.7)",
                        cursor: isPending ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontWeight: 600,
                        transition: "all 0.2s"
                    }}
                >
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}><ThumbsUp size={16} /> Yes</span>
                    <span>{yesCount}</span>
                </button>

                <button
                    onClick={() => startTransition(() => voteProposal(proposalId, "No"))}
                    disabled={isPending}
                    style={{
                        flex: 1,
                        padding: "12px 16px",
                        borderRadius: 12,
                        border: userVote === "No" ? "1px solid rgba(239,68,68,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        background: userVote === "No" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.03)",
                        color: userVote === "No" ? "#ef4444" : "rgba(240,244,255,0.7)",
                        cursor: isPending ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontWeight: 600,
                        transition: "all 0.2s"
                    }}
                >
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}><ThumbsDown size={16} /> No</span>
                    <span>{noCount}</span>
                </button>
            </div>

            {/* Visual Bar */}
            {total > 0 && (
                <div style={{ height: 6, borderRadius: 100, display: "flex", overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
                    <div style={{ width: `${yesPercent}%`, background: "#10b981", transition: "width 0.5s ease" }} />
                    <div style={{ width: `${noPercent}%`, background: "#ef4444", transition: "width 0.5s ease" }} />
                </div>
            )}
            {total > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(240,244,255,0.4)", marginTop: 6 }}>
                    <span>{yesPercent}% agreed</span>
                    <span>{total} total votes</span>
                </div>
            )}
        </div>
    );
}
