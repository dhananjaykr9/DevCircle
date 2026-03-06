import Footer from "@/components/Footer";
import Link from "next/link";
import { FileText, Users, Shield, AlertTriangle, Scale, Globe, Mail } from "lucide-react";

export const metadata = {
    title: "Terms of Service — DevCircle",
    description: "DevCircle's terms of service — the rules and agreements for using the platform.",
};

const sections = [
    {
        icon: <Users size={22} />,
        title: "1. Acceptance of Terms",
        paragraphs: [
            "By accessing or using DevCircle, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you should not use the platform.",
            "DevCircle reserves the right to update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.",
        ],
    },
    {
        icon: <Globe size={22} />,
        title: "2. Platform Description",
        paragraphs: [
            "DevCircle is an open-source, community-driven platform that connects technology professionals across cities in India. The platform provides discussions, events, project sharing, mentorship, job listings, governance, and other community features.",
            "DevCircle is provided 'as is' and 'as available.' As an open-source community project, we strive for reliability but do not guarantee uninterrupted service or data permanence.",
        ],
    },
    {
        icon: <Shield size={22} />,
        title: "3. User Accounts",
        paragraphs: [
            "You must provide accurate information when creating your account. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account.",
            "You must be at least 16 years of age to use DevCircle. By creating an account, you confirm that you meet this requirement.",
            "DevCircle reserves the right to suspend or terminate accounts that violate these Terms, our Community Guidelines, or our Code of Conduct.",
        ],
    },
    {
        icon: <FileText size={22} />,
        title: "4. Content & Intellectual Property",
        paragraphs: [
            "You retain ownership of all content you post on DevCircle (discussions, comments, projects, job listings, etc.). By posting content, you grant DevCircle a non-exclusive, worldwide license to display, distribute, and make available your content within the platform.",
            "You are responsible for ensuring you have the right to share any content you post. Do not post copyrighted material, proprietary code, or confidential information belonging to others without proper authorization.",
            "The DevCircle platform code itself is open-source and licensed under its respective open-source license. The community content is owned by its respective authors.",
        ],
    },
    {
        icon: <AlertTriangle size={22} />,
        title: "5. Prohibited Conduct",
        list: [
            "Posting spam, malware, phishing links, or other malicious content",
            "Harassing, threatening, or intimidating other users",
            "Impersonating other users, organizations, or entities",
            "Attempting to access other users' accounts or private data",
            "Using automated tools (bots, scrapers) without permission",
            "Posting fraudulent job listings or misleading opportunities",
            "Circumventing moderation actions (e.g., creating new accounts after a ban)",
            "Any activity that violates applicable laws or regulations",
        ],
    },
    {
        icon: <Scale size={22} />,
        title: "6. Community Governance",
        paragraphs: [
            "DevCircle operates a community governance model where members can participate in proposals and votes that shape the platform's direction. Governance features are available to members who meet minimum reputation requirements.",
            "Governance decisions are advisory and subject to review by platform maintainers to ensure they align with the platform's core values and technical feasibility.",
        ],
    },
    {
        icon: <Shield size={22} />,
        title: "7. Moderation & Enforcement",
        paragraphs: [
            "DevCircle moderators may remove content, restrict accounts, or take other actions to enforce these Terms, our Community Guidelines, and Code of Conduct. Moderation decisions aim to be fair and transparent.",
            "Users can appeal moderation decisions by contacting the moderation team. See our Moderation Policy for detailed enforcement procedures.",
        ],
    },
    {
        icon: <AlertTriangle size={22} />,
        title: "8. Disclaimers & Limitations",
        paragraphs: [
            "DevCircle is a community platform — we do not verify the accuracy of user-posted content including job listings, project claims, or professional credentials. Users should independently verify information before acting on it.",
            "DevCircle is not responsible for interactions between users, including mentorship relationships, job applications, or collaboration agreements. Exercise appropriate caution in all interactions.",
            "To the maximum extent permitted by law, DevCircle and its contributors shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.",
        ],
    },
    {
        icon: <FileText size={22} />,
        title: "9. Data & Privacy",
        paragraphs: [
            "Your use of DevCircle is also governed by our Privacy Policy, which describes how we collect, use, and protect your data.",
            "By using DevCircle, you consent to the data practices described in our Privacy Policy.",
        ],
    },
    {
        icon: <Scale size={22} />,
        title: "10. Open Source",
        paragraphs: [
            "DevCircle's platform code is open-source. Contributions to the codebase are governed by the project's open-source license and Contribution Guidelines.",
            "Being open-source means anyone can inspect, audit, and contribute to the platform's code. This transparency is a core part of our commitment to the community.",
        ],
    },
];

export default function TermsPage() {
    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Hero */}
            <section className="grid-bg" style={{ padding: "80px 0 60px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", marginBottom: 24, fontSize: 13, color: "#3b82f6", fontWeight: 600 }}>
                        <FileText size={14} /> Terms of Service
                    </div>
                    <h1 style={{ fontSize: 40, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-1.5px", lineHeight: 1.15, margin: "0 0 20px" }}>
                        Terms of Service
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.55)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
                        The terms and conditions for using DevCircle. Simple, fair, and community-first.
                    </p>
                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.35)", marginTop: 16 }}>
                        Last updated: March 2026
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="section" style={{ padding: "48px 0 80px" }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        {sections.map(section => (
                            <div key={section.title} className="glass-card" style={{ padding: 40 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316" }}>
                                        {section.icon}
                                    </div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>{section.title}</h2>
                                </div>

                                {section.paragraphs && section.paragraphs.map((p, i) => (
                                    <p key={i} style={{ fontSize: 14, color: "rgba(240,244,255,0.55)", lineHeight: 1.8, margin: i === section.paragraphs!.length - 1 ? 0 : "0 0 14px" }}>
                                        {p}
                                    </p>
                                ))}

                                {section.list && (
                                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, margin: 0, padding: 0 }}>
                                        {section.list.map(item => (
                                            <li key={item} style={{ fontSize: 14, color: "rgba(240,244,255,0.55)", lineHeight: 1.6, paddingLeft: 20, position: "relative" }}>
                                                <span style={{ position: "absolute", left: 0, color: "#ef4444" }}>•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Related Links */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 32 }}>
                        {[
                            { label: "Privacy Policy", href: "/privacy", icon: <Shield size={18} />, color: "#10b981" },
                            { label: "Community Guidelines", href: "/guidelines", icon: <Users size={18} />, color: "#f59e0b" },
                            { label: "Code of Conduct", href: "/code-of-conduct", icon: <Scale size={18} />, color: "#8b5cf6" },
                        ].map(link => (
                            <Link key={link.label} href={link.href} className="glass-card" style={{ padding: "20px 24px", textDecoration: "none", display: "flex", alignItems: "center", gap: 12, transition: "border-color 0.2s" }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${link.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: link.color, flexShrink: 0 }}>
                                    {link.icon}
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="glass-card" style={{ padding: 40, textAlign: "center", marginTop: 32, border: "1px solid rgba(59,130,246,0.15)" }}>
                        <Mail size={28} color="#3b82f6" style={{ marginBottom: 16 }} />
                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", margin: "0 0 12px" }}>Questions About These Terms?</h2>
                        <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto 20px" }}>
                            If anything is unclear, feel free to reach out through our Help Center.
                        </p>
                        <Link href="/help" className="btn-primary" style={{ textDecoration: "none", fontSize: 14 }}>
                            Visit Help Center
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
