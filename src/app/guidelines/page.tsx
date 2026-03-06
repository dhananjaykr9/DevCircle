import Footer from "@/components/Footer";
import Link from "next/link";
import { BookOpen, MessageSquare, Users, ThumbsUp, AlertTriangle, Shield, Heart } from "lucide-react";

export const metadata = {
    title: "Community Guidelines — DevCircle",
    description: "Guidelines for participating in the DevCircle community. Learn how to contribute positively and keep our spaces welcoming.",
};

const guidelines = [
    {
        icon: <Heart size={22} />,
        title: "Be Welcoming & Inclusive",
        dos: [
            "Welcome newcomers warmly — everyone was a beginner once",
            "Use inclusive language that respects all backgrounds",
            "Encourage questions, no matter how basic they seem",
            "Celebrate diverse perspectives and experiences",
        ],
        donts: [
            "Gate-keep based on experience, education, or background",
            "Dismiss someone's contribution because they're new",
            "Use jargon without explanation when helping beginners",
        ],
    },
    {
        icon: <MessageSquare size={22} />,
        title: "Communicate Respectfully",
        dos: [
            "Be constructive in feedback — suggest improvements, not just criticism",
            "Assume good intent in conversations",
            "Disagree with ideas, not people",
            "Keep discussions professional and on-topic",
        ],
        donts: [
            "Engage in personal attacks, insults, or name-calling",
            "Use sarcasm or passive-aggressive language",
            "Derail discussions with off-topic content",
            "Spam or repeatedly self-promote without adding value",
        ],
    },
    {
        icon: <Users size={22} />,
        title: "Collaborate Openly",
        dos: [
            "Share knowledge freely — write tutorials, answer questions, mentor others",
            "Give credit to others' contributions and ideas",
            "Provide context and documentation when sharing code",
            "Be open to pair programming and collaborative learning",
        ],
        donts: [
            "Claim others' work as your own",
            "Gatekeep resources or knowledge",
            "Refuse to collaborate because of technology or framework preferences",
        ],
    },
    {
        icon: <ThumbsUp size={22} />,
        title: "Contribute Quality Content",
        dos: [
            "Write clear, well-structured discussion posts",
            "Add meaningful context to questions — include what you've tried",
            "Share projects with proper documentation and screenshots",
            "Provide accurate job listings with transparent details",
        ],
        donts: [
            "Post low-effort content, clickbait, or misleading titles",
            "Cross-post the same content across multiple sections",
            "Post content primarily aimed at selling products or services",
            "Share confidential or proprietary information",
        ],
    },
    {
        icon: <Shield size={22} />,
        title: "Respect Privacy & Safety",
        dos: [
            "Protect others' personal information",
            "Report concerning behavior using the report button",
            "Use DMs responsibly and respect when someone doesn't respond",
            "Keep private conversations private",
        ],
        donts: [
            "Share others' personal info without explicit consent",
            "Screenshot and share private messages publicly",
            "Stalk, harass, or send unwanted messages to members",
            "Create fake accounts or impersonate others",
        ],
    },
];

export default function GuidelinesPage() {
    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Hero */}
            <section className="grid-bg" style={{ padding: "80px 0 60px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: 24, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
                        <BookOpen size={14} /> Community Guidelines
                    </div>
                    <h1 style={{ fontSize: 40, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-1.5px", lineHeight: 1.15, margin: "0 0 20px" }}>
                        Community Guidelines
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.55)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
                        These guidelines help us maintain a positive, productive, and welcoming environment for every member of DevCircle.
                    </p>
                </div>
            </section>

            {/* Intro */}
            <section className="section" style={{ padding: "48px 0 24px" }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div className="glass-card" style={{ padding: "32px 40px", borderLeft: "3px solid #f97316" }}>
                        <p style={{ fontSize: 15, color: "rgba(240,244,255,0.6)", lineHeight: 1.8, margin: 0 }}>
                            DevCircle is built by developers, for developers. Our guidelines exist to protect the collaborative spirit that makes this community special. By participating, you agree to follow these guidelines and our <Link href="/code-of-conduct" style={{ color: "#f97316", textDecoration: "none" }}>Code of Conduct</Link>.
                        </p>
                    </div>
                </div>
            </section>

            {/* Guidelines */}
            <section className="section" style={{ padding: "24px 0 80px" }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        {guidelines.map(g => (
                            <div key={g.title} className="glass-card" style={{ padding: 40 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316" }}>
                                        {g.icon}
                                    </div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>{g.title}</h2>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                    {/* Do's */}
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                                            <ThumbsUp size={14} /> Do
                                        </div>
                                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, margin: 0, padding: 0 }}>
                                            {g.dos.map(d => (
                                                <li key={d} style={{ fontSize: 14, color: "rgba(240,244,255,0.55)", lineHeight: 1.6, paddingLeft: 16, position: "relative" }}>
                                                    <span style={{ position: "absolute", left: 0, color: "#10b981" }}>✓</span>
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Don'ts */}
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                                            <AlertTriangle size={14} /> Don't
                                        </div>
                                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, margin: 0, padding: 0 }}>
                                            {g.donts.map(d => (
                                                <li key={d} style={{ fontSize: 14, color: "rgba(240,244,255,0.55)", lineHeight: 1.6, paddingLeft: 16, position: "relative" }}>
                                                    <span style={{ position: "absolute", left: 0, color: "#ef4444" }}>✗</span>
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Enforcement */}
                    <div className="glass-card" style={{ padding: 40, marginTop: 32, border: "1px solid rgba(239,68,68,0.15)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                            <AlertTriangle size={22} color="#ef4444" />
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>Enforcement</h2>
                        </div>
                        <p style={{ fontSize: 14, color: "rgba(240,244,255,0.55)", lineHeight: 1.8, margin: "0 0 16px" }}>
                            Violations of these guidelines may result in:
                        </p>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, margin: 0, padding: 0 }}>
                            {[
                                "A private warning from a moderator",
                                "Temporary muting or restriction of posting privileges",
                                "Removal of offending content",
                                "Temporary suspension of account",
                                "Permanent ban for severe or repeated violations",
                            ].map(item => (
                                <li key={item} style={{ fontSize: 14, color: "rgba(240,244,255,0.55)", paddingLeft: 20, position: "relative" }}>
                                    <span style={{ position: "absolute", left: 0, color: "#f97316" }}>•</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", lineHeight: 1.8, marginTop: 20, marginBottom: 0 }}>
                            If you witness a violation, please use the Report button or contact a moderator. All reports are handled confidentially. See our <Link href="/moderation" style={{ color: "#f97316", textDecoration: "none" }}>Moderation Policy</Link> for details.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
