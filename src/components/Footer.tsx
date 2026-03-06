import Link from "next/link";
import { Github, Twitter, Linkedin, MapPin, Mail } from "lucide-react";

const footerLinks = {
    Platform: [
        { href: "/communities", label: "Communities" },
        { href: "/discussions", label: "Discussions" },
        { href: "/projects", label: "Projects" },
        { href: "/events", label: "Events" },
    ],
    Company: [
        { href: "#", label: "About Us" },
        { href: "#", label: "Blog" },
        { href: "#", label: "Careers" },
        { href: "#", label: "Press" },
    ],
    Support: [
        { href: "#", label: "Help Center" },
        { href: "#", label: "Community Guidelines" },
        { href: "#", label: "Privacy Policy" },
        { href: "#", label: "Terms of Service" },
    ],
};

const cities = ["Nagpur", "Pune", "Hyderabad", "Bangalore", "Mumbai", "Kochi", "Ahmedabad", "Indore"];

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
                        gridTemplateColumns: "2fr 1fr 1fr 1fr",
                        gap: 48,
                        marginBottom: 64,
                    }}
                    className="footer-grid"
                >
                    {/* Brand */}
                    <div>
                        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                            <img src="/images/logo.png" alt="DevCircle" style={{ height: 36, width: "auto", borderRadius: 8 }} />
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: "#f0f4ff" }}>
                                Dev<span style={{ color: "#f97316" }}>Circle</span>
                            </span>
                        </Link>
                        <p style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", lineHeight: 1.7, marginBottom: 20 }}>
                            Hyper-local tech community for professionals and freshers in India. Connecting the tech ecosystem, one city at a time.
                        </p>
                        {/* Cities */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                            {cities.map((city) => (
                                <span
                                    key={city}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        fontSize: 12,
                                        color: "rgba(240,244,255,0.4)",
                                        padding: "2px 8px",
                                        borderRadius: 6,
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.06)",
                                    }}
                                >
                                    <MapPin size={10} /> {city}
                                </span>
                            ))}
                        </div>
                        {/* Social */}
                        <div style={{ display: "flex", gap: 12 }}>
                            {[
                                { icon: <Github size={16} />, href: "#" },
                                { icon: <Twitter size={16} />, href: "#" },
                                { icon: <Linkedin size={16} />, href: "#" },
                                { icon: <Mail size={16} />, href: "#" },
                            ].map((social, i) => (
                                <a
                                    key={`social-${i}`}
                                    href={social.href}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 8,
                                        background: "rgba(255,255,255,0.05)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "rgba(240,244,255,0.5)",
                                        textDecoration: "none",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([section, links]) => (
                        <div key={section}>
                            <h4 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.9)", marginBottom: 16, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                                {section}
                            </h4>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                                {links.map((link, i) => (
                                    <li key={`${link.label}-${i}`}>
                                        <Link
                                            href={link.href}
                                            style={{
                                                color: "rgba(240,244,255,0.45)",
                                                textDecoration: "none",
                                                fontSize: 14,
                                                transition: "color 0.2s",
                                            }}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="divider" />

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
                        © 2026 DevCircle. Built for India&apos;s tech ecosystem.
                    </div>
                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.3)" }}>
                        Made with ❤️ in <span style={{ color: "#f97316" }}>Nagpur</span>
                    </p>
                </div>
            </div>

            <style>{`
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
