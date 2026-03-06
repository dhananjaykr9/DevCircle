"use client";

import { useState, useTransition } from "react";
import { votePoll } from "@/lib/actions/jobs-polls";
import { useRouter } from "next/navigation";

interface Option {
    id: string;
    text: string;
    votes: { id: string }[];
}

interface PollVoteButtonProps {
    pollId: string;
    options: Option[];
    userVotedOptionId: string | null; // null = hasn't voted
    totalVotes: number;
    isExpired: boolean;
}

export default function PollVoteButton({ pollId, options, userVotedOptionId, totalVotes, isExpired }: PollVoteButtonProps) {
    const [selectedId, setSelectedId] = useState<string | null>(userVotedOptionId);
    const [localCounts, setLocalCounts] = useState<Record<string, number>>(
        Object.fromEntries(options.map((o) => [o.id, o.votes.length]))
    );
    const [localTotal, setLocalTotal] = useState(totalVotes);
    const [isPending, startTransition] = useTransition();
    const [authError, setAuthError] = useState(false);
    const router = useRouter();

    const handleVote = (optionId: string) => {
        if (isPending || isExpired) return;
        setAuthError(false);

        // Optimistic update
        setLocalCounts((prev) => {
            const next = { ...prev };
            if (selectedId) next[selectedId] = Math.max(0, next[selectedId] - 1);
            next[optionId] = (next[optionId] || 0) + 1;
            return next;
        });
        setLocalTotal((prev) => (selectedId ? prev : prev + 1));
        setSelectedId(optionId);

        startTransition(async () => {
            try {
                await votePoll(optionId);
            } catch (e: any) {
                // revert
                setLocalCounts((prev) => {
                    const next = { ...prev };
                    next[optionId] = Math.max(0, next[optionId] - 1);
                    if (selectedId) next[selectedId] = next[selectedId] + 1;
                    return next;
                });
                setLocalTotal((prev) => (selectedId ? prev : Math.max(0, prev - 1)));
                setSelectedId(userVotedOptionId);
                if (e?.message?.toLowerCase().includes("logged in")) {
                    setAuthError(true);
                    setTimeout(() => setAuthError(false), 4000);
                }
            }
        });
    };

    const hasVoted = selectedId !== null;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            {options.map((opt) => {
                const count = localCounts[opt.id] || 0;
                const pct = localTotal > 0 ? Math.round((count / localTotal) * 100) : 0;
                const isMyVote = selectedId === opt.id;

                return (
                    <button
                        key={opt.id}
                        onClick={() => handleVote(opt.id)}
                        disabled={isPending || isExpired}
                        style={{
                            position: "relative",
                            width: "100%",
                            padding: "11px 14px",
                            borderRadius: 10,
                            border: `1px solid ${isMyVote ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`,
                            background: isMyVote ? "rgba(139,92,246,0.08)" : "rgba(255,255,255,0.02)",
                            cursor: isExpired ? "not-allowed" : "pointer",
                            textAlign: "left",
                            overflow: "hidden",
                            transition: "border-color 0.2s, background 0.2s",
                            opacity: isPending ? 0.7 : 1,
                        }}
                    >
                        {/* Progress bar fill */}
                        {hasVoted && (
                            <div style={{
                                position: "absolute",
                                left: 0, top: 0, bottom: 0,
                                width: `${pct}%`,
                                background: isMyVote ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
                                borderRadius: "10px 0 0 10px",
                                transition: "width 0.4s ease",
                            }} />
                        )}
                        <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 14, color: isMyVote ? "#c4b5fd" : "#f0f4ff", fontWeight: isMyVote ? 600 : 400 }}>
                                {isMyVote && "✓ "}{opt.text}
                            </span>
                            {hasVoted && (
                                <span style={{ fontSize: 13, fontWeight: 700, color: isMyVote ? "#c4b5fd" : "rgba(240,244,255,0.45)", fontFamily: "'Space Grotesk', sans-serif" }}>
                                    {pct}%
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
            <div style={{ fontSize: 12, color: "rgba(240,244,255,0.35)", marginTop: 4 }}>
                {localTotal} vote{localTotal !== 1 ? "s" : ""}{isExpired ? " · Poll closed" : hasVoted ? " · Click another option to change your vote" : " · Click an option to vote"}
            </div>
            {authError && (
                <a
                    href="/auth/login"
                    onClick={(e) => { e.preventDefault(); router.push("/auth/login"); }}
                    style={{ fontSize: 12, color: "#f97316", textDecoration: "underline", cursor: "pointer", marginTop: 4, display: "inline-block" }}
                >
                    Sign in to vote on polls
                </a>
            )}
        </div>
    );
}
