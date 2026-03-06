"use client";

import { useState } from "react";
import { Bell, Check, ArrowRight } from "lucide-react";

interface WaitlistButtonProps {
    cityName: string;
    variant?: "primary" | "small" | "banner";
    className?: string;
}

export default function WaitlistButton({ cityName, variant = "primary", className }: WaitlistButtonProps) {
    const [joined, setJoined] = useState(false);
    const [animating, setAnimating] = useState(false);

    const handleJoin = () => {
        if (joined) return;
        setAnimating(true);
        setTimeout(() => {
            setJoined(true);
            setAnimating(false);
        }, 600);
    };

    if (variant === "small") {
        return (
            <button
                onClick={handleJoin}
                className={className}
                style={{
                    fontSize: 12,
                    padding: joined ? "8px 16px" : "8px 18px",
                    borderRadius: 8,
                    cursor: joined ? "default" : "pointer",
                    background: joined ? "rgba(16,185,129,0.1)" : "rgba(139,92,246,0.08)",
                    border: `1px solid ${joined ? "rgba(16,185,129,0.2)" : "rgba(139,92,246,0.2)"}`,
                    color: joined ? "#10b981" : "#a78bfa",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    transform: animating ? "scale(0.95)" : "scale(1)",
                }}
            >
                {animating ? (
                    <span className="waitlist-spinner" />
                ) : joined ? (
                    <><Check size={13} /> On Waitlist</>
                ) : (
                    <><Bell size={13} /> Join Waitlist</>
                )}
            </button>
        );
    }

    if (variant === "banner") {
        return (
            <button
                onClick={handleJoin}
                style={{
                    fontSize: 12,
                    padding: "8px 18px",
                    borderRadius: 8,
                    cursor: joined ? "default" : "pointer",
                    background: joined ? "rgba(16,185,129,0.1)" : "rgba(139,92,246,0.08)",
                    border: `1px solid ${joined ? "rgba(16,185,129,0.2)" : "rgba(139,92,246,0.2)"}`,
                    color: joined ? "#10b981" : "#a78bfa",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    transform: animating ? "scale(0.95)" : "scale(1)",
                }}
                className={className}
            >
                {animating ? (
                    <span className="waitlist-spinner" />
                ) : joined ? (
                    <><Check size={13} /> On Waitlist!</>
                ) : (
                    <><Bell size={13} /> Join Waitlist</>
                )}
            </button>
        );
    }

    // Primary variant (hero button)
    return (
        <>
            <button
                onClick={handleJoin}
                className={`${joined ? "" : "btn-secondary"} ${className || ""}`}
                style={{
                    cursor: joined ? "default" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 24px",
                    borderRadius: 12,
                    fontWeight: 600,
                    fontSize: 14,
                    transition: "all 0.4s ease",
                    transform: animating ? "scale(0.95)" : "scale(1)",
                    ...(joined ? {
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.25)",
                        color: "#10b981",
                    } : {}),
                }}
            >
                {animating ? (
                    <>
                        <span className="waitlist-spinner" />
                        Joining...
                    </>
                ) : joined ? (
                    <>
                        <Check size={16} />
                        You&apos;re on the waitlist!
                    </>
                ) : (
                    <>
                        <Bell size={16} />
                        Join Waitlist
                        <ArrowRight size={14} />
                    </>
                )}
            </button>

            {joined && (
                <div
                    className="fade-in-up"
                    style={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.25)",
                        borderRadius: 14,
                        padding: "16px 22px",
                        maxWidth: 320,
                        zIndex: 9999,
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={14} color="#10b981" />
                        </div>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#10b981" }}>Waitlist Joined!</span>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", lineHeight: 1.6, margin: 0 }}>
                        We&apos;ll notify you when DevCircle {cityName} goes live. Meanwhile, check out our active community in Nagpur!
                    </p>
                </div>
            )}

            <style>{`
                .waitlist-spinner {
                    width: 14px;
                    height: 14px;
                    border: 2px solid rgba(167,139,250,0.2);
                    border-top-color: #a78bfa;
                    border-radius: 50%;
                    animation: waitlistSpin 0.6s linear infinite;
                    display: inline-block;
                }
                @keyframes waitlistSpin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
