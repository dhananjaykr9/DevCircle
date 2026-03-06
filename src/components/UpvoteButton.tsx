"use client";

import { useState, useTransition } from "react";
import { ChevronUp } from "lucide-react";
import { toggleUpvote } from "@/lib/actions/create";

interface UpvoteButtonProps {
    postId: string;
    initialCount: number;
    initialUpvoted: boolean;
}

export default function UpvoteButton({ postId, initialCount, initialUpvoted }: UpvoteButtonProps) {
    const [upvoted, setUpvoted] = useState(initialUpvoted);
    const [count, setCount] = useState(initialCount);
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        // Optimistic update
        setUpvoted((prev) => !prev);
        setCount((prev) => (upvoted ? prev - 1 : prev + 1));

        startTransition(async () => {
            try {
                await toggleUpvote(postId);
            } catch {
                // Revert on error
                setUpvoted((prev) => !prev);
                setCount((prev) => (upvoted ? prev + 1 : prev - 1));
            }
        });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 48 }}>
            <button
                onClick={handleClick}
                disabled={isPending}
                title={upvoted ? "Remove upvote" : "Upvote"}
                style={{
                    background: "none",
                    border: "none",
                    cursor: isPending ? "wait" : "pointer",
                    padding: 4,
                    borderRadius: 6,
                    color: upvoted ? "#f97316" : "rgba(240,244,255,0.35)",
                    transition: "color 0.2s, transform 0.15s",
                    transform: isPending ? "scale(0.9)" : "scale(1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <ChevronUp size={22} fill={upvoted ? "#f97316" : "none"} />
            </button>
            <span
                style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: upvoted ? "#f97316" : "#f0f4ff",
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: "color 0.2s",
                    lineHeight: 1,
                }}
            >
                {count}
            </span>
        </div>
    );
}
