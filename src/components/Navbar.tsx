"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
    Menu, X, MapPin, Bell, ChevronDown, Sparkles, MessageSquare,
    Briefcase, Calendar, Users, Github, Settings, LogOut, BookOpen,
    BarChart3, Shield, Vote, Lightbulb, Trophy, FolderGit2, Rocket
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Navigation structure ─────────────────────────────────────── */

const primaryLinks = [
    { href: "/feed", label: "Home", icon: <Sparkles size={16} />, authOnly: true },
    { href: "/communities", label: "Communities", icon: <MapPin size={16} />, authOnly: false },
    { href: "/discussions", label: "Discussions", icon: <MessageSquare size={16} />, authOnly: true },
    { href: "/events", label: "Events", icon: <Calendar size={16} />, authOnly: false },
    { href: "/projects", label: "Projects", icon: <FolderGit2 size={16} />, authOnly: true },
    { href: "/open-source", label: "Open Source", icon: <Github size={16} />, authOnly: false },
];

const moreMenuSections = [
    {
        title: "Build",
        links: [
            { href: "/jobs", label: "Jobs", icon: <Briefcase size={16} />, authOnly: true },
            { href: "/startups", label: "Startups", icon: <Rocket size={16} />, authOnly: true },
            { href: "/learning", label: "Learning", icon: <BookOpen size={16} />, authOnly: true },
            { href: "/mentorship", label: "Mentorship", icon: <Lightbulb size={16} />, authOnly: true },
        ],
    },
    {
        title: "Connect",
        links: [
            { href: "/network", label: "Network", icon: <Users size={16} />, authOnly: true },
            { href: "/messages", label: "Messages", icon: <MessageSquare size={16} />, authOnly: true },
            { href: "/leaderboard", label: "Leaderboard", icon: <Trophy size={16} />, authOnly: true },
        ],
    },
    {
        title: "Govern",
        links: [
            { href: "/governance", label: "Governance", icon: <Vote size={16} />, authOnly: true },
            { href: "/polls", label: "Polls", icon: <BarChart3 size={16} />, authOnly: true },
        ],
    },
];

/* flatten for mobile / filtering */
const allLinks = [
    ...primaryLinks,
    ...moreMenuSections.flatMap(s => s.links),
];

/* ── Component ────────────────────────────────────────────────── */

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const moreRef = useRef<HTMLDivElement>(null);
    const { data: session, status } = useSession();

    const isLoggedIn = !!session?.user;
    const isAdmin = (session?.user as any)?.role === "ADMIN";
    const isMod = (session?.user as any)?.role === "MODERATOR" || isAdmin;

    // Close more-dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => { setMobileOpen(false); setMoreOpen(false); }, [pathname]);

    const visiblePrimary = primaryLinks.filter(l => !l.authOnly || isLoggedIn);
    const visibleSections = moreMenuSections
        .map(s => ({ ...s, links: s.links.filter(l => !l.authOnly || isLoggedIn) }))
        .filter(s => s.links.length > 0);
    const visibleAll = allLinks.filter(l => !l.authOnly || isLoggedIn);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    /* shared link style */
    const linkStyle = (active: boolean): React.CSSProperties => ({
        padding: "8px 12px",
        borderRadius: 8,
        textDecoration: "none",
        fontSize: 13,
        fontWeight: 500,
        color: active ? "#f97316" : "rgba(240,244,255,0.75)",
        background: active ? "rgba(249,115,22,0.1)" : "transparent",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 6,
        whiteSpace: "nowrap" as const,
    });

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
            <div
                className="container"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}
            >
                {/* ── Logo ─────────────────────────────────── */}
                <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                    <img
                        src="/images/logo.png"
                        alt="DevCircle"
                        className="show-mobile-only"
                        style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 10 }}
                    />
                    <img
                        src="/images/logo.png"
                        alt="DevCircle"
                        className="hidden-mobile"
                        style={{ height: 32, objectFit: "contain", borderRadius: 10 }}
                    />
                </Link>

                {/* ── Desktop nav ──────────────────────────── */}
                <div style={{ display: "flex", alignItems: "center", gap: 2 }} className="hidden-tablet">
                    {visiblePrimary.map(link => (
                        <Link key={link.href} href={link.href} style={linkStyle(isActive(link.href))}>
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}

                    {/* ── More mega-dropdown ────────────────── */}
                    {visibleSections.length > 0 && (
                        <div ref={moreRef} style={{ position: "relative" }}>
                            <button
                                onClick={() => setMoreOpen(o => !o)}
                                onMouseEnter={() => setMoreOpen(true)}
                                style={{
                                    ...linkStyle(false),
                                    border: "none",
                                    cursor: "pointer",
                                    background: moreOpen ? "rgba(255,255,255,0.06)" : "transparent",
                                }}
                            >
                                More <ChevronDown size={13} style={{ transform: moreOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                            </button>

                            <AnimatePresence>
                                {moreOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{ duration: 0.15 }}
                                        onMouseLeave={() => setMoreOpen(false)}
                                        style={{
                                            position: "absolute",
                                            top: "calc(100% + 6px)",
                                            right: 0,
                                            display: "grid",
                                            gridTemplateColumns: `repeat(${visibleSections.length}, 1fr)`,
                                            gap: 0,
                                            background: "rgba(10, 14, 28, 0.97)",
                                            backdropFilter: "blur(24px)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            borderRadius: 14,
                                            padding: 6,
                                            minWidth: visibleSections.length * 175,
                                            boxShadow: "0 12px 40px rgba(0,0,0,0.55)",
                                            zIndex: 120,
                                        }}
                                    >
                                        {visibleSections.map((section, si) => (
                                            <div
                                                key={section.title}
                                                style={{
                                                    padding: "10px 8px",
                                                    borderLeft: si > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
                                                }}
                                            >
                                                <div style={{
                                                    fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                                                    letterSpacing: "1.2px", color: "rgba(240,244,255,0.35)",
                                                    padding: "4px 10px 8px", marginBottom: 2,
                                                }}>
                                                    {section.title}
                                                </div>
                                                {section.links.map(link => (
                                                    <Link
                                                        key={link.href}
                                                        href={link.href}
                                                        className="nav-dropdown-item"
                                                        style={{
                                                            padding: "9px 10px",
                                                            borderRadius: 8,
                                                            textDecoration: "none",
                                                            fontSize: 13,
                                                            fontWeight: 500,
                                                            color: isActive(link.href) ? "#f97316" : "rgba(240,244,255,0.7)",
                                                            background: isActive(link.href) ? "rgba(249,115,22,0.08)" : "transparent",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 9,
                                                            transition: "all 0.15s",
                                                        }}
                                                    >
                                                        <span style={{ opacity: isActive(link.href) ? 1 : 0.55 }}>{link.icon}</span>
                                                        {link.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}

                                        {/* Mod tools row */}
                                        {isMod && (
                                            <>
                                                <div style={{ gridColumn: "1 / -1", height: 1, background: "rgba(255,255,255,0.06)", margin: "2px 8px" }} />
                                                <Link
                                                    href="/moderation"
                                                    className="nav-dropdown-item"
                                                    style={{
                                                        gridColumn: "1 / -1",
                                                        padding: "9px 18px",
                                                        borderRadius: 8,
                                                        textDecoration: "none",
                                                        fontSize: 13,
                                                        fontWeight: 600,
                                                        color: "#f59e0b",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 9,
                                                    }}
                                                >
                                                    <Shield size={15} /> Mod Tools
                                                </Link>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>

                {/* ── Right side ───────────────────────────── */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    {status === "loading" ? (
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                    ) : session?.user ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Link href="/notifications" style={{ textDecoration: "none", color: "rgba(240,244,255,0.55)", display: "flex" }}>
                                <Bell size={19} />
                            </Link>
                            <Link href="/messages" className="hidden-mobile" style={{ textDecoration: "none", color: "rgba(240,244,255,0.55)", display: "flex" }}>
                                <MessageSquare size={19} />
                            </Link>
                            <Link href="/settings" className="hidden-mobile" style={{ textDecoration: "none", color: "rgba(240,244,255,0.55)", display: "flex" }}>
                                <Settings size={19} />
                            </Link>
                            <Link href="/profile" style={{ textDecoration: "none" }}>
                                {session.user.image ? (
                                    <img
                                        src={session.user.image}
                                        alt={session.user.name || "User"}
                                        style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(249,115,22,0.4)", objectFit: "cover" }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 32, height: 32, borderRadius: "50%",
                                            background: "linear-gradient(135deg, #f97316, #ea580c)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            fontSize: 12, fontWeight: 700, color: "white",
                                            border: "2px solid rgba(249,115,22,0.4)",
                                        }}
                                    >
                                        {session.user.name?.substring(0, 2).toUpperCase() || "U"}
                                    </div>
                                )}
                            </Link>
                        </div>
                    ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Link href="/auth/login" className="btn-secondary" style={{ padding: "7px 16px", fontSize: 13, borderRadius: 8, textDecoration: "none" }}>
                                Login
                            </Link>
                            <Link href="/auth/signup" className="btn-primary" style={{ padding: "7px 16px", fontSize: 13, borderRadius: 8, textDecoration: "none" }}>
                                Sign Up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileOpen(true)}
                        style={{ background: "none", border: "none", color: "rgba(240,244,255,0.8)", cursor: "pointer", padding: 4 }}
                        className="show-tablet"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </div>

            {/* ── Mobile Sidebar ───────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 1000 }}
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            style={{
                                position: "fixed", top: 0, right: 0, bottom: 0,
                                width: "82%", maxWidth: 340,
                                background: "rgba(8, 11, 20, 0.98)",
                                borderLeft: "1px solid rgba(255,255,255,0.07)",
                                padding: "20px 16px",
                                zIndex: 1001,
                                display: "flex", flexDirection: "column",
                                overflowY: "auto",
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, padding: "0 4px" }}>
                                <span style={{ fontWeight: 700, fontSize: 18, color: "#f0f4ff" }}>Menu</span>
                                <button onClick={() => setMobileOpen(false)} style={{ background: "none", border: "none", color: "rgba(240,244,255,0.6)", cursor: "pointer" }}>
                                    <X size={22} />
                                </button>
                            </div>

                            {/* User info (if logged in) */}
                            {session?.user && (
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    padding: "14px 12px", borderRadius: 12,
                                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                                    marginBottom: 20,
                                }}>
                                    {session.user.image ? (
                                        <img src={session.user.image} alt="" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: 13 }}>
                                            {session.user.name?.substring(0, 2).toUpperCase() || "U"}
                                        </div>
                                    )}
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 14, color: "#f0f4ff" }}>{session.user.name}</div>
                                        <div style={{ fontSize: 12, color: "rgba(240,244,255,0.45)" }}>{session.user.email}</div>
                                    </div>
                                </div>
                            )}

                            {/* Primary links */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                {visiblePrimary.map(link => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        style={{
                                            padding: "11px 14px", borderRadius: 10, textDecoration: "none",
                                            fontSize: 14, fontWeight: 500,
                                            color: isActive(link.href) ? "#f97316" : "rgba(240,244,255,0.8)",
                                            background: isActive(link.href) ? "rgba(249,115,22,0.1)" : "transparent",
                                            display: "flex", alignItems: "center", gap: 12,
                                        }}
                                    >
                                        <span style={{ opacity: isActive(link.href) ? 1 : 0.5 }}>{link.icon}</span>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Sectioned links */}
                            {visibleSections.map(section => (
                                <div key={section.title} style={{ marginTop: 16 }}>
                                    <div style={{
                                        fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                                        letterSpacing: "1.2px", color: "rgba(240,244,255,0.3)",
                                        padding: "6px 14px",
                                    }}>
                                        {section.title}
                                    </div>
                                    {section.links.map(link => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            style={{
                                                padding: "11px 14px", borderRadius: 10, textDecoration: "none",
                                                fontSize: 14, fontWeight: 500,
                                                color: isActive(link.href) ? "#f97316" : "rgba(240,244,255,0.8)",
                                                background: isActive(link.href) ? "rgba(249,115,22,0.1)" : "transparent",
                                                display: "flex", alignItems: "center", gap: 12,
                                            }}
                                        >
                                            <span style={{ opacity: isActive(link.href) ? 1 : 0.5 }}>{link.icon}</span>
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            ))}

                            {/* Utility links */}
                            {session?.user && (
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 8px 12px" }} />
                                    <Link href="/profile" onClick={() => setMobileOpen(false)}
                                        style={{ padding: "11px 14px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 500, color: isActive("/profile") ? "#f97316" : "rgba(240,244,255,0.8)", display: "flex", alignItems: "center", gap: 12 }}>
                                        <Users size={16} style={{ opacity: 0.5 }} /> Profile
                                    </Link>
                                    <Link href="/settings" onClick={() => setMobileOpen(false)}
                                        style={{ padding: "11px 14px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 500, color: isActive("/settings") ? "#f97316" : "rgba(240,244,255,0.8)", display: "flex", alignItems: "center", gap: 12 }}>
                                        <Settings size={16} style={{ opacity: 0.5 }} /> Settings
                                    </Link>
                                    <Link href="/notifications" onClick={() => setMobileOpen(false)}
                                        style={{ padding: "11px 14px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 500, color: isActive("/notifications") ? "#f97316" : "rgba(240,244,255,0.8)", display: "flex", alignItems: "center", gap: 12 }}>
                                        <Bell size={16} style={{ opacity: 0.5 }} /> Notifications
                                    </Link>
                                    {isMod && (
                                        <Link href="/moderation" onClick={() => setMobileOpen(false)}
                                            style={{ padding: "11px 14px", borderRadius: 10, textDecoration: "none", fontSize: 14, fontWeight: 600, color: "#f59e0b", display: "flex", alignItems: "center", gap: 12 }}>
                                            <Shield size={16} /> Mod Tools
                                        </Link>
                                    )}
                                </div>
                            )}

                            {/* Footer actions */}
                            <div style={{ marginTop: "auto", paddingTop: 16 }}>
                                <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />
                                {session?.user ? (
                                    <button
                                        onClick={() => signOut()}
                                        style={{
                                            width: "100%", padding: "12px 0", borderRadius: 10,
                                            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                            color: "#ef4444", fontSize: 14, fontWeight: 600,
                                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                        }}
                                    >
                                        <LogOut size={16} /> Log Out
                                    </button>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                        <Link href="/auth/login" className="btn-secondary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>
                                            Login
                                        </Link>
                                        <Link href="/auth/signup" className="btn-primary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style>{`
                .hidden-mobile { display: flex; }
                .hidden-tablet { display: flex; }
                .show-tablet { display: none !important; }
                .show-mobile-only { display: none; }

                @media (max-width: 1100px) {
                    .hidden-tablet { display: none !important; }
                    .show-tablet { display: flex !important; }
                }

                @media (max-width: 768px) {
                    .hidden-mobile { display: none !important; }
                    .show-mobile-only { display: block !important; }
                }

                .nav-dropdown-item:hover {
                    background: rgba(255,255,255,0.05);
                    color: #f0f4ff !important;
                }
            `}</style>
        </nav>
    );
}
