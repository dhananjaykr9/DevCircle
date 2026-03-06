import Link from "next/link";
import { Github, MapPin, Heart, ArrowUpRight, Code2, Star, Terminal, ChevronUp, Zap, Globe, Shield, Sparkles, Coffee, ArrowRight } from "lucide-react";

const communities = [
    { name: "Nagpur", href: "/communities/nagpur", active: true },
    { name: "Pune", href: "/communities/pune", active: false },
    { name: "Bangalore", href: "/communities/bangalore", active: false },
    { name: "Hyderabad", href: "/communities/hyderabad", active: false },
    { name: "Indore", href: "/communities/indore", active: false },
    { name: "Ahmedabad", href: "/communities/ahmedabad", active: false },
    { name: "Kochi", href: "/communities/kochi", active: false },
    { name: "Surat", href: "/communities/surat", active: false },
];

const platformLinks = [
    { href: "/communities", label: "Communities" },
    { href: "/discussions", label: "Discussions" },
    { href: "/projects", label: "Projects" },
    { href: "/events", label: "Events" },
    { href: "/mentorship", label: "Mentorship" },
    { href: "/jobs", label: "Jobs" },
    { href: "/learning", label: "Learning Hub" },
    { href: "/leaderboard", label: "Leaderboard" },
];

const openSourceLinks = [
    { href: "https://github.com/dhananjaykr9/DevCircle", label: "GitHub Repo", external: true },
    { href: "/open-source", label: "Contribute" },
    { href: "https://github.com/dhananjaykr9/DevCircle/issues", label: "Report Issues", external: true },
    { href: "https://github.com/dhananjaykr9/DevCircle/issues/new", label: "Feature Requests", external: true },
    { href: "https://github.com/dhananjaykr9/DevCircle/pulls", label: "Pull Requests", external: true },
];

const communityLinks = [
    { href: "/about", label: "About DevCircle" },
    { href: "/guidelines", label: "Community Guidelines" },
    { href: "/code-of-conduct", label: "Code of Conduct" },
    { href: "/governance", label: "Governance" },
    { href: "/moderation", label: "Moderation" },
];

const resourceLinks = [
    { href: "/help", label: "Help Center" },
    { href: "/faq", label: "FAQs" },
    { href: "/learning", label: "Learning Hub" },
];

const legalLinks = [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/code-of-conduct", label: "Code of Conduct" },
];

const techStack = [
    { name: "Next.js" },
    { name: "TypeScript" },
    { name: "Prisma" },
    { name: "PostgreSQL" },
    { name: "NextAuth" },
];

export default function Footer() {
    return (
        <footer style={{ position: "relative", overflow: "hidden", background: "linear-gradient(180deg, rgba(5,8,15,0) 0%, rgba(5,8,15,1) 6%)" }}>
            {/* Background glow orbs */}
            <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.03) 0%, transparent 70%)", bottom: -200, left: -200, pointerEvents: "none" }} />
            <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)", top: 100, right: -200, pointerEvents: "none" }} />

            {/* Animated gradient top border */}
            <div className="footer-top-glow" style={{ height: 2, background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.5) 20%, rgba(139,92,246,0.5) 50%, rgba(59,130,246,0.5) 80%, transparent)" }} />

            <div style={{ paddingTop: 72 }}>
                {/* Open Source CTA */}
                <div className="container" style={{ marginBottom: 52 }}>
                    <div className="footer-cta" style={{
                        background: "linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(139,92,246,0.08) 50%, rgba(59,130,246,0.06) 100%)",
                        border: "1px solid rgba(249,115,22,0.12)",
                        borderRadius: 24,
                        padding: "52px 56px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 40,
                        position: "relative",
                        overflow: "hidden",
                    }}>
                        {/* Decorative orbs */}
                        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)" }} />
                        <div style={{ position: "absolute", bottom: -40, left: "30%", width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)" }} />
                        <div style={{ position: "absolute", top: 20, left: 20, width: 80, height: 80, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />

                        <div style={{ position: "relative", zIndex: 1, flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Terminal size={16} color="#f97316" />
                                </div>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#f97316", letterSpacing: "0.08em", textTransform: "uppercase" }}>100% Open Source</span>
                            </div>
                            <h3 style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px", margin: "0 0 10px", lineHeight: 1.3 }}>
                                Build the future of local dev communities
                            </h3>
                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.45)", lineHeight: 1.8, margin: 0, maxWidth: 480 }}>
                                Contribute code, report bugs, suggest features, or star the repo. Every contribution makes DevCircle better for developers across India.
                            </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 1, flexShrink: 0 }} className="footer-cta-btns">
                            <a
                                href="https://github.com/dhananjaykr9/DevCircle"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                                style={{ textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, justifyContent: "center" }}
                            >
                                <Star size={16} /> Star on GitHub
                            </a>
                            <Link
                                href="/open-source"
                                className="btn-secondary"
                                style={{ textDecoration: "none", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 28px", borderRadius: 12, justifyContent: "center" }}
                            >
                                <Code2 size={16} /> Start Contributing
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Strip */}
                <div className="container" style={{ marginBottom: 52 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, borderRadius: 16, overflow: "hidden", background: "rgba(255,255,255,0.06)" }} className="footer-stats">
                        {[
                            { icon: <Zap size={20} />, value: "Nagpur", label: "Live City", color: "#10b981", glow: "rgba(16,185,129,0.15)" },
                            { icon: <Globe size={20} />, value: "11+", label: "Cities Waitlisted", color: "#8b5cf6", glow: "rgba(139,92,246,0.15)" },
                            { icon: <Code2 size={20} />, value: "100%", label: "Open Source", color: "#f97316", glow: "rgba(249,115,22,0.15)" },
                            { icon: <Shield size={20} />, value: "Free", label: "Forever", color: "#3b82f6", glow: "rgba(59,130,246,0.15)" },
                        ].map((stat) => (
                            <div key={stat.label} style={{ background: "rgba(5,8,15,0.95)", padding: "28px 20px", textAlign: "center", position: "relative" }}>
                                <div style={{ color: stat.color, marginBottom: 10, display: "flex", justifyContent: "center", filter: `drop-shadow(0 0 6px ${stat.glow})` }}>{stat.icon}</div>
                                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 20, color: "#f0f4ff", marginBottom: 4, letterSpacing: "-0.5px" }}>{stat.value}</div>
                                <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", letterSpacing: "0.02em" }}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Footer Grid */}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "60px 0 0" }}>
                    <div className="container">
                        <div style={{ display: "grid", gridTemplateColumns: "2.4fr 1fr 1fr 1fr 1.2fr", gap: 48, marginBottom: 56 }} className="footer-grid">

                            {/* Brand Column */}
                            <div>
                                <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                                    <img src="/images/3logo.png" alt="DevCircle" style={{ height: 38, objectFit: "contain", borderRadius: 10 }} />
                                </Link>
                                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.45)", lineHeight: 1.85, marginBottom: 22, maxWidth: 300 }}>
                                    Hyper-local open-source tech community platform connecting developers across Indian cities.
                                </p>

                                {/* Tech Stack Badges */}
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(240,244,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Built with</div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                        {techStack.map((tech) => (
                                            <span key={tech.name} style={{
                                                fontSize: 11,
                                                padding: "4px 10px",
                                                borderRadius: 6,
                                                background: "rgba(255,255,255,0.04)",
                                                border: "1px solid rgba(255,255,255,0.07)",
                                                color: "rgba(240,244,255,0.5)",
                                                fontWeight: 500,
                                            }}>
                                                {tech.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Social Buttons */}
                                <div style={{ display: "flex", gap: 8 }}>
                                    <a href="https://github.com/dhananjaykr9/DevCircle" target="_blank" rel="noopener noreferrer" className="footer-social-btn" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,244,255,0.6)", textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "all 0.2s" }}>
                                        <Github size={15} /> GitHub
                                    </a>
                                    <a href="https://github.com/dhananjaykr9/DevCircle/issues/new" target="_blank" rel="noopener noreferrer" className="footer-social-btn" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(240,244,255,0.6)", textDecoration: "none", fontSize: 13, fontWeight: 500, transition: "all 0.2s" }}>
                                        <Sparkles size={15} /> Feedback
                                    </a>
                                </div>
                            </div>

                            {/* Platform Column */}
                            <div>
                                <h4 style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,244,255,0.3)", marginBottom: 20, letterSpacing: "0.12em", textTransform: "uppercase" }}>Platform</h4>
                                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                                    {platformLinks.map((link) => (
                                        <li key={link.label}>
                                            <Link href={link.href} className="footer-link" style={{ color: "rgba(240,244,255,0.5)", textDecoration: "none", fontSize: 14, transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 6 }}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Open Source Column */}
                            <div>
                                <h4 style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,244,255,0.3)", marginBottom: 20, letterSpacing: "0.12em", textTransform: "uppercase" }}>Open Source</h4>
                                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                                    {openSourceLinks.map((link) => (
                                        <li key={link.label}>
                                            {link.external ? (
                                                <a href={link.href} target="_blank" rel="noopener noreferrer" className="footer-link" style={{ color: "rgba(240,244,255,0.5)", textDecoration: "none", fontSize: 14, transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 4 }}>
                                                    {link.label} <ArrowUpRight size={11} style={{ opacity: 0.35 }} />
                                                </a>
                                            ) : (
                                                <Link href={link.href} className="footer-link" style={{ color: "rgba(240,244,255,0.5)", textDecoration: "none", fontSize: 14, transition: "all 0.2s" }}>
                                                    {link.label}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Community + Support Column */}
                            <div>
                                <h4 style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,244,255,0.3)", marginBottom: 20, letterSpacing: "0.12em", textTransform: "uppercase" }}>Community</h4>
                                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                                    {communityLinks.map((link) => (
                                        <li key={link.label}>
                                            <Link href={link.href} className="footer-link" style={{ color: "rgba(240,244,255,0.5)", textDecoration: "none", fontSize: 14, transition: "all 0.2s" }}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <h4 style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,244,255,0.3)", marginTop: 28, marginBottom: 20, letterSpacing: "0.12em", textTransform: "uppercase" }}>Support</h4>
                                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                                    {resourceLinks.map((link) => (
                                        <li key={link.label}>
                                            <Link href={link.href} className="footer-link" style={{ color: "rgba(240,244,255,0.5)", textDecoration: "none", fontSize: 14, transition: "all 0.2s" }}>
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Cities Column — Enhanced */}
                            <div>
                                <h4 style={{ fontSize: 11, fontWeight: 700, color: "rgba(240,244,255,0.3)", marginBottom: 20, letterSpacing: "0.12em", textTransform: "uppercase" }}>Cities</h4>

                                {/* Active city highlight */}
                                <div style={{ marginBottom: 16 }}>
                                    {communities.filter(c => c.active).map((city) => (
                                        <Link key={city.name} href={city.href} className="footer-link" style={{
                                            color: "#f0f4ff", textDecoration: "none", fontSize: 14, display: "flex", alignItems: "center", gap: 8,
                                            padding: "10px 14px", borderRadius: 12, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)", transition: "all 0.2s",
                                        }}>
                                            <span className="footer-live-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 8px rgba(16,185,129,0.5)", flexShrink: 0 }} />
                                            <MapPin size={13} color="#10b981" />
                                            <span style={{ fontWeight: 600 }}>{city.name}</span>
                                            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: "rgba(16,185,129,0.12)", color: "#10b981", fontWeight: 600, marginLeft: "auto", letterSpacing: "0.05em" }}>LIVE</span>
                                        </Link>
                                    ))}
                                </div>

                                {/* Waitlist cities */}
                                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                                    {communities.filter(c => !c.active).map((city) => (
                                        <li key={city.name}>
                                            <Link href={city.href} className="footer-link" style={{ color: "rgba(240,244,255,0.35)", textDecoration: "none", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.2s" }}>
                                                <MapPin size={11} style={{ opacity: 0.35 }} />
                                                {city.name}
                                                <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "rgba(139,92,246,0.1)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.15)", fontWeight: 500 }}>Waitlist</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <div style={{ marginTop: 14 }}>
                                    <Link href="/communities" className="footer-link" style={{ color: "#f97316", textDecoration: "none", fontSize: 13, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
                                        All Communities <ArrowRight size={13} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Gradient Divider */}
                        <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(249,115,22,0.15) 20%, rgba(139,92,246,0.15) 50%, rgba(59,130,246,0.15) 80%, transparent)", margin: "0 0 28px" }} />

                        {/* Bottom Bar */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 32, flexWrap: "wrap", gap: 16 }} className="footer-bottom">
                            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(240,244,255,0.3)", flexWrap: "wrap" }}>
                                <span>© {new Date().getFullYear()} DevCircle</span>
                                <span style={{ opacity: 0.3 }}>·</span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    Built with <Heart size={11} color="#ef4444" fill="#ef4444" /> in India
                                </span>
                                <span style={{ opacity: 0.3 }}>·</span>
                                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                                    <Coffee size={11} /> for developers, by developers
                                </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                                {legalLinks.map((link) => (
                                    <Link key={link.label} href={link.href} className="footer-link" style={{ fontSize: 12, color: "rgba(240,244,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}>
                                        {link.label}
                                    </Link>
                                ))}
                                <a href="#" className="footer-back-top" style={{ fontSize: 12, color: "rgba(240,244,255,0.3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, transition: "all 0.2s", padding: "4px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                    Top <ChevronUp size={13} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .footer-link:hover {
                    color: #f0f4ff !important;
                    transform: translateX(2px);
                }
                .footer-social-btn:hover {
                    background: rgba(255,255,255,0.08) !important;
                    border-color: rgba(255,255,255,0.15) !important;
                    color: #f0f4ff !important;
                    transform: translateY(-1px);
                }
                .footer-back-top:hover {
                    color: #f0f4ff !important;
                    background: rgba(255,255,255,0.06) !important;
                    border-color: rgba(255,255,255,0.12) !important;
                }
                .footer-top-glow {
                    animation: footerGlow 4s ease-in-out infinite;
                }
                @keyframes footerGlow {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                .footer-live-dot {
                    animation: livePulse 2s ease-in-out infinite;
                }
                @keyframes livePulse {
                    0%, 100% { box-shadow: 0 0 4px rgba(16,185,129,0.3); }
                    50% { box-shadow: 0 0 12px rgba(16,185,129,0.6); }
                }
                @media (max-width: 1100px) {
                    .footer-grid { grid-template-columns: 1fr 1fr 1fr !important; gap: 36px !important; }
                    .footer-cta { flex-direction: column !important; text-align: center !important; padding: 40px 28px !important; }
                    .footer-cta-btns { flex-direction: row !important; justify-content: center !important; }
                    .footer-stats { grid-template-columns: repeat(2, 1fr) !important; }
                }
                @media (max-width: 768px) {
                    .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 28px !important; }
                    .footer-bottom { flex-direction: column !important; text-align: center !important; }
                    .footer-cta-btns { flex-direction: column !important; width: 100% !important; }
                    .footer-cta-btns a { justify-content: center !important; }
                }
                @media (max-width: 480px) {
                    .footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
                    .footer-stats { grid-template-columns: 1fr 1fr !important; }
                }
            `}</style>
        </footer>
    );
}
