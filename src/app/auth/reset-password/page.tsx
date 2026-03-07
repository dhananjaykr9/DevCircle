"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/actions/auth";
import { Lock, ArrowRight, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPasswordForm />
        </Suspense>
    );
}

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        formData.append("token", token || "");
        const res = await resetPassword(formData);
        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
        } else if (res?.success) {
            setSuccess(true);
            setIsLoading(false);
        }
    }

    if (!token) {
        return (
            <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(13,17,32,1)" }} className="grid-bg">
                <div className="glass-card" style={{ width: "100%", maxWidth: 440, padding: 40, textAlign: "center" }}>
                    <div style={{ color: "#f87171", fontSize: 16, marginBottom: 16 }}>Invalid reset link</div>
                    <Link href="/auth/forgot-password" style={{ color: "#8b5cf6", textDecoration: "none" }}>Request a new reset link</Link>
                </div>
            </main>
        );
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
                        New Password
                    </h1>
                    <p style={{ color: "rgba(240,244,255,0.5)", fontSize: 14 }}>
                        Enter your new password below.
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
                            Password reset successfully!
                        </div>
                        <Link href="/auth/login" className="btn-primary" style={{ width: "100%", justifyContent: "center", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                            <ArrowLeft size={16} /> Sign In
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ position: "relative" }}>
                            <Lock size={16} style={{ position: "absolute", left: 14, top: 12, color: "rgba(240,244,255,0.4)" }} />
                            <input name="password" type="password" className="input" placeholder="New password (min 6 chars)" required minLength={6} style={{ paddingLeft: 42, width: "100%" }} />
                        </div>
                        <div style={{ position: "relative" }}>
                            <Lock size={16} style={{ position: "absolute", left: 14, top: 12, color: "rgba(240,244,255,0.4)" }} />
                            <input name="confirmPassword" type="password" className="input" placeholder="Confirm new password" required minLength={6} style={{ paddingLeft: 42, width: "100%" }} />
                        </div>

                        <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
                            {isLoading ? "Resetting..." : "Reset Password"} <ArrowRight size={16} />
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
