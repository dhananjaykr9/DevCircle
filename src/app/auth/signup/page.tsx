"use client";

import Link from "next/link";
import { useState } from "react";
import { registerUser } from "@/lib/actions/auth";
import { signIn } from "next-auth/react";
import { Github, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        // Basic validation
        const password = formData.get("password") as string;
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setIsLoading(false);
            return;
        }

        try {
            const res = await registerUser(formData);
            if (res?.error) {
                setError(res.error);
                setIsLoading(false);
            }
        } catch {
            // Server action redirect throws — this is expected on success
        }
    }

    return (
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(13,17,32,1)" }} className="grid-bg">
            <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#10b981", filter: "blur(120px)", opacity: 0.12, top: "80%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0, pointerEvents: "none" }} />

            <div className="glass-card" style={{ width: "100%", maxWidth: 440, padding: 40, position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "white", fontWeight: 800, fontSize: 20 }}>
                        DC
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px", marginBottom: 8 }}>
                        Join the Network
                    </h1>
                    <p style={{ color: "rgba(240,244,255,0.5)", fontSize: 14 }}>
                        Create an account to build, collaborate, and co-found in your city.
                    </p>
                </div>

                {error && (
                    <div style={{ padding: "12px 16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, color: "#f87171", fontSize: 13, marginBottom: 24, textAlign: "center" }}>
                        {error}
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
                    <div style={{ position: "relative" }}>
                        <User size={16} style={{ position: "absolute", left: 14, top: 12, color: "rgba(240,244,255,0.4)" }} />
                        <input name="name" type="text" className="input" placeholder="Full Name" required style={{ paddingLeft: 42, width: "100%" }} />
                    </div>
                    <div style={{ position: "relative" }}>
                        <Mail size={16} style={{ position: "absolute", left: 14, top: 12, color: "rgba(240,244,255,0.4)" }} />
                        <input name="email" type="email" className="input" placeholder="name@example.com" required style={{ paddingLeft: 42, width: "100%" }} />
                    </div>
                    <div style={{ position: "relative" }}>
                        <Lock size={16} style={{ position: "absolute", left: 14, top: 12, color: "rgba(240,244,255,0.4)" }} />
                        <input name="password" type="password" className="input" placeholder="Create a password (min 6 chars)" required minLength={6} style={{ paddingLeft: 42, width: "100%" }} />
                    </div>

                    <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: "100%", justifyContent: "center", marginTop: 8, background: "linear-gradient(135deg, #10b981, #059669)", border: "none" }}>
                        {isLoading ? "Creating Account..." : "Create Account"} <ArrowRight size={16} />
                    </button>
                </form>

                <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
                    <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.1)" }} />
                    <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Or sign up with</span>
                    <div style={{ height: 1, flex: 1, background: "rgba(255,255,255,0.1)" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <button
                        onClick={() => signIn("google", { callbackUrl: "/onboarding" })}
                        className="btn-secondary"
                        style={{ width: "100%", justifyContent: "center", background: "rgba(255,255,255,0.03)" }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Continue with Google
                    </button>
                    <button
                        onClick={() => signIn("github", { callbackUrl: "/onboarding" })}
                        className="btn-secondary"
                        style={{ width: "100%", justifyContent: "center", background: "rgba(255,255,255,0.03)" }}
                    >
                        <Github size={18} /> Continue with GitHub
                    </button>
                </div>

                <div style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "rgba(240,244,255,0.5)" }}>
                    Already have an account? <Link href="/auth/login" style={{ color: "#f0f4ff", fontWeight: 600, textDecoration: "none" }}>Sign in here</Link>
                </div>
            </div>
        </main>
    );
}
