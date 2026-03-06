import Link from "next/link";
import { Github, MapPin } from "lucide-react";

const communities = [
    { name: "Nagpur", href: "/communities/nagpur" },
    { name: "Pune", href: "/communities/pune" },
    { name: "Hyderabad", href: "/communities/hyderabad" },
    { name: "Bangalore", href: "/communities/bangalore" },
    { name: "Mumbai", href: "/communities/mumbai" },
    { name: "Kochi", href: "/communities/kochi" },
    { name: "Ahmedabad", href: "/communities/ahmedabad" },
    { name: "Indore", href: "/communities/indore" },
];

const platformLinks = [
    { href: "/communities", label: "Communities" },
    { href: "/discussions", label: "Discussions" },
    { href: "/projects", label: "Projects" },
    { href: "/events", label: "Events" },
    { href: "/mentorship", label: "Mentorship" },
    { href: "/jobs", label: "Jobs" },
];

const openSourceLinks = [
    { href: "https://github.com/devcircle", label: "GitHub Repository", external: true },
    { href: "/open-source", label: "Contribution Guide" },
    { href: "/learning", label: "Developer Documentation" },
    { href: "https://github.com/devcircle/issues", label: "Report Issues", external: true },
    { href: "https://github.com/devcircle/issues/new", label: "Feature Requests", external: true },
];

const communityLinks = [
    { href: "#about", label: "About DevCircle" },
    { href: "#guidelines", label: "Community Guidelines" },
    { href: "#code-of-conduct", label: "Code of Conduct" },
    { href: "/moderation", label: "Moderation Policy" },
    { href: "/governance", label: "Governance Model" },
];

const resourceLinks = [
    { href: "#help", label: "Help Center" },
    { href: "/learning", label: "Documentation" },
    { href: "#faq", label: "FAQs" },
];

const legalLinks = [
    { href: "#privacy", label: "Privacy Policy" },
    { href: "#terms", label: "Terms of Service" },
];

export default function Footer() {
    return (
        <footer
            style={{
                background: "rgba(5, 8, 15, 0.95)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                padding: "80px 0 32px",
            }}
        >
            <div className="container">
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "2.5fr 1fr 1fr 1fr 1fr 1fr",
                        gap: 40,
                        marginBottom: 64,
                    }}
                    className="footer-grid"
                >
                    {/* Brand / Identity */}
                    <div>
                        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <img src="/images/3logo.png" alt="DevCircle" style={{ height: 34, objectFit: "contain", borderRadius: 10 }} />
                        </Link>
                        <p style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", lineHeight: 1.8, marginBottom: 20 }}>
                            Open-source hyper-local tech community connecting professionals and freshers across cities in India.
                        </p>
                        <p style={{ fontSize: 12, color: "rgba(240,244,255,0.35)", lineHeight: 1.7, fontStyle: "italic" }}>
                            Built and maintained by the community, for the community.
                        </p>
                        {/* GitHub button */}
                        <a
                            href="https://github.com/devcircle"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                marginTop: 20,
                                padding: "8px 16px",
                                borderRadius: 8,
                                background: "rgba(255,255,255,0.05)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(240,244,255,0.7)",
                                textDecoration: "none",
                                fontSize: 13,
                                fontWeight: 500,
                                transition: "all 0.2s",
                            }}
                        >
                            <Github size={16} /> Star us on GitHub
                        </a>
                    </div>

                    {/* Communities */}
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.9)", marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            Communities
                        </h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                            {communities.map((city) => (
                                <li key={city.name}>
                                    <Link href={city.href} style={{ color: "rgba(240,244,255,0.45)", textDecoration: "none", fontSize: 14, display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}>
                                        <MapPin size={11} color="#f97316" style={{ opacity: 0.6 }} /> {city.name}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/communities" style={{ color: "#f97316", textDecoration: "none", fontSize: 13, fontWeight: 500, marginTop: 4, display: "inline-block" }}>
                                    Explore All Communities →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.9)", marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            Platform
                        </h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                            {platformLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} style={{ color: "rgba(240,244,255,0.45)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Open Source */}
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.9)", marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            Open Source
                        </h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                            {openSourceLinks.map((link) => (
                                <li key={link.label}>
                                    {link.external ? (
                                        <a href={link.href} target="_blank" rel="noopener noreferrer" style={{ color: "rgba(240,244,255,0.45)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link href={link.href} style={{ color: "rgba(240,244,255,0.45)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Community Governance */}
                    <div>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.9)", marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            Community
                        </h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                            {communityLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} style={{ color: "rgba(240,244,255,0.45)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Resources sub-section */}
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.9)", marginTop: 28, marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                            Resources
                        </h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                            {resourceLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} style={{ color: "rgba(240,244,255,0.45)", textDecoration: "none", fontSize: 14, transition: "color 0.2s" }}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="divider" />

                {/* Bottom bar */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 28,
                        flexWrap: "wrap",
                        gap: 12,
                    }}
                >
                    <div style={{ fontSize: 13, color: "rgba(240,244,255,0.4)" }}>
                        © DevCircle Community. Open-source project maintained by contributors.
                    </div>
                    <div style={{ display: "flex", gap: 20 }}>
                        {legalLinks.map((link) => (
                            <Link key={link.label} href={link.href} style={{ fontSize: 12, color: "rgba(240,244,255,0.35)", textDecoration: "none", transition: "color 0.2s" }}>
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 1100px) {
                    .footer-grid {
                        grid-template-columns: 1fr 1fr 1fr !important;
                        gap: 32px !important;
                    }
                }
                @media (max-width: 768px) {
                    .footer-grid {
                        grid-template-columns: 1fr !important;
                        gap: 32px !important;
                    }
                }
            `}</style>
        </footer>
    );
}
