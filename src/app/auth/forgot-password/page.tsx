"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/lib/actions/auth";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [resetUrl, setResetUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);
        const res = await forgotPassword(formData);
        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
        } else if (res?.success) {
            setSuccess(true);
            if (res.resetUrl) setResetUrl(res.resetUrl);
            setIsLoading(false);
        }
    }

    return (
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(13,17,32,1)" }} className="grid-bg">
            <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#8b5cf6", filter: "blur(120px)", opacity: 0.15, top: "20%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0, pointerEvents: "none" }} />

            <div className="glass-card" style={{ width: "100%", maxWidth: 440, padding: 40, position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "white", fontWeight: 800, fontSize: 20 }}>
                        DC
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px", marginBottom: 8 }}>
                        Reset Password
                    </h1>
                    <p style={{ color: "rgba(240,244,255,0.5)", fontSize: 14 }}>
                        Enter your email and we'll send you a reset link.
                    </p>
                </div>

                {error && (
                    <div style={{ padding: "12px 16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, color: "#f87171", fontSize: 13, marginBottom: 24, textAlign: "center" }}>
                        {error}
                    </div>
                )}

                {success ? (
                    <div>
                        <div style={{ padding: "16px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: 8, color: "#34d399", fontSize: 14, marginBottom: 24, textAlign: "center" }}>
                            If an account with that email exists, a password reset link has been sent.
                        </div>

                        {resetUrl && (
                            <div style={{ padding: "16px", background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.2)", borderRadius: 8, marginBottom: 24 }}>
                                <p style={{ color: "rgba(240,244,255,0.6)", fontSize: 12, marginBottom: 8 }}>
                                    Email delivery is not configured. Use this link to reset your password:
                                </p>
                                <a href={resetUrl} style={{ color: "#a78bfa", fontSize: 13, wordBreak: "break-all" }}>
                                    {resetUrl}
                                </a>
                            </div>
                        )}

                        <Link href="/auth/login" className="btn-primary" style={{ width: "100%", justifyContent: "center", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                            <ArrowLeft size={16} /> Back to Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ position: "relative" }}>
                            <Mail size={16} style={{ position: "absolute", left: 14, top: 12, color: "rgba(240,244,255,0.4)" }} />
                            <input name="email" type="email" className="input" placeholder="name@example.com" required style={{ paddingLeft: 42, width: "100%" }} />
                        </div>

                        <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
                            {isLoading ? "Sending..." : "Send Reset Link"} <ArrowRight size={16} />
                        </button>
                    </form>
                )}

                <div style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "rgba(240,244,255,0.5)" }}>
                    Remember your password? <Link href="/auth/login" style={{ color: "#f0f4ff", fontWeight: 600, textDecoration: "none" }}>Sign in here</Link>
                </div>
            </div>
        </main>
    );
}
