"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check, Loader } from "lucide-react";
import { toggleRsvp } from "@/lib/actions/create";

interface RsvpButtonProps {
    eventId: string;
    initialRsvpd: boolean;
    isFull: boolean;
}

export default function RsvpButton({ eventId, initialRsvpd, isFull }: RsvpButtonProps) {
    const [rsvpd, setRsvpd] = useState(initialRsvpd);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleClick = () => {
        setError(null);
        // Optimistic update
        setRsvpd((prev) => !prev);

        startTransition(async () => {
            try {
                await toggleRsvp(eventId);
            } catch (e: unknown) {
                // Revert on error
                setRsvpd((prev) => !prev);
                setError(e instanceof Error ? e.message : "Failed to RSVP. Try again.");
            }
        });
    };

    if (isFull && !rsvpd) {
        return (
            <button
                disabled
                className="btn-secondary"
                style={{ padding: "8px 20px", fontSize: 13, borderRadius: 9, opacity: 0.5, cursor: "not-allowed" }}
            >
                Event Full
            </button>
        );
    }

    return (
        <div>
            <button
                onClick={handleClick}
                disabled={isPending}
                className={rsvpd ? "btn-secondary" : "btn-primary"}
                style={{
                    padding: "8px 20px",
                    fontSize: 13,
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    opacity: isPending ? 0.7 : 1,
                    cursor: isPending ? "wait" : "pointer",
                    transition: "all 0.2s",
                }}
            >
                {isPending ? (
                    <Loader size={13} style={{ animation: "spin 1s linear infinite" }} />
                ) : rsvpd ? (
                    <Check size={13} />
                ) : (
                    <ArrowRight size={13} />
                )}
                {rsvpd ? "Cancel RSVP" : "RSVP Now"}
            </button>
            {error && (
                <p style={{ fontSize: 11, color: "#f87171", marginTop: 6 }}>{error}</p>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
