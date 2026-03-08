"use client";

import { useTransition } from "react";
import { ArrowRight, Loader } from "lucide-react";
import { joinCommunity } from "@/lib/actions/community";

export default function JoinCommunityButton({ cityId, isMember }: { cityId: string; isMember?: boolean }) {
    const [isPending, startTransition] = useTransition();

    const handleJoin = () => {
        startTransition(async () => {
            await joinCommunity(cityId);
        });
    };

    if (isMember) {
        return (
            <div
                style={{
                    fontSize: 13,
                    padding: "10px 20px",
                    borderRadius: 10,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: "rgba(16, 185, 129, 0.1)",
                    color: "#10b981",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    fontWeight: 500
                }}
            >
                Joined
            </div>
        );
    }

    return (
        <button
            onClick={handleJoin}
            disabled={isPending}
            className="btn-primary"
            style={{ fontSize: 13, padding: "10px 20px", borderRadius: 10, display: "inline-flex", alignItems: "center", gap: 6 }}
        >
            {isPending ? "Joining..." : "Join Community"}
            {!isPending && <ArrowRight size={13} />}
        </button>
    );
}
