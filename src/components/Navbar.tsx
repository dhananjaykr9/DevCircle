"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, MapPin, Bell, ChevronDown } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";

const navLinks = [
    { href: "/communities", label: "Communities" },
    { href: "/discussions", label: "Discussions" },
    { href: "/projects", label: "Projects" },
    { href: "/events", label: "Events" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { data: session, status } = useSession();

    return (
        <nav
            style={{
                position: "sticky",
                top: 0,
                zIndex: 100,
                background: "rgba(8, 11, 20, 0.85)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
        >
            <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
                {/* Logo */}
                <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                    <img src="/images/logo.png" alt="DevCircle" style={{ height: 36, width: "auto", borderRadius: 8 }} />
                    <span
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 700,
                            fontSize: 20,
                            color: "#f0f4ff",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Dev<span style={{ color: "#f97316" }}>Circle</span>
                    </span>
                </Link>

                {/* Desktop nav links */}
                <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden-mobile">
                    {navLinks.map((link) => {
                        const active = pathname === link.href || pathname.startsWith(link.href + "/");
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                style={{
                                    padding: "8px 14px",
                                    borderRadius: 8,
                                    textDecoration: "none",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: active ? "#f97316" : "rgba(240,244,255,0.75)",
                                    background: active ? "rgba(249,115,22,0.1)" : "transparent",
                                    transition: "all 0.2s",
                                }}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="hidden-mobile">
                    {/* City indicator */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "6px 12px",
                            borderRadius: 8,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            cursor: "pointer",
                            fontSize: 13,
                            color: "rgba(240,244,255,0.7)",
                        }}
                    >
                        <MapPin size={13} color="#f97316" />
                        Nagpur
                        <ChevronDown size={12} />
                    </div>

                    {status === "loading" ? (
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                    ) : session?.user ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Link href="/profile" style={{ textDecoration: "none" }}>
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid rgba(139,92,246,0.4)", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 34,
                                            height: 34,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: "white",
                                            cursor: "pointer",
                                            border: "2px solid rgba(139,92,246,0.4)",
                                        }}
                                    >
                                        {session.user.name?.substring(0, 2).toUpperCase() || "U"}
                                    </div>
                                )}
                            </Link>
                            <button onClick={() => signOut()} className="btn-secondary" style={{ padding: "8px 14px", fontSize: 13, borderRadius: 8 }}>
                                Log Out
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => signIn()} className="btn-primary" style={{ padding: "8px 16px", fontSize: 13, borderRadius: 8 }}>
                            Sign In / Join
                        </button>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{
                        background: "none",
                        border: "none",
                        color: "rgba(240,244,255,0.8)",
                        cursor: "pointer",
                        padding: 4,
                        display: "none",
                    }}
                    className="show-mobile"
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div
                    style={{
                        background: "rgba(8,11,20,0.98)",
                        borderTop: "1px solid rgba(255,255,255,0.07)",
                        padding: "16px 24px 20px",
                    }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                display: "block",
                                padding: "12px 0",
                                textDecoration: "none",
                                fontSize: 15,
                                fontWeight: 500,
                                color: pathname === link.href ? "#f97316" : "rgba(240,244,255,0.8)",
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
                        {session?.user ? (
                            <>
                                <Link href="/profile" className="btn-secondary" style={{ flex: 1, justifyContent: "center", padding: "10px 20px", fontSize: 14 }}>
                                    Profile
                                </Link>
                                <button onClick={() => signOut()} className="btn-secondary" style={{ flex: 1, justifyContent: "center", padding: "10px 20px", fontSize: 14 }}>
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <button onClick={() => signIn()} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "10px 20px", fontSize: 14 }}>
                                Sign In / Join
                            </button>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
          .hidden-mobile { display: flex !important; }
        }
      `}</style>
        </nav>
    );
}
