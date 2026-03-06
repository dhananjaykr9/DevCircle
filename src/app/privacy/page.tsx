import Footer from "@/components/Footer";
import Link from "next/link";
import { Shield, Eye, Database, Lock, UserCheck, Globe, Trash2, Mail } from "lucide-react";

export const metadata = {
    title: "Privacy Policy — DevCircle",
    description: "DevCircle's privacy policy — how we collect, use, and protect your data.",
};

const sections = [
    {
        icon: <Database size={22} />,
        title: "Information We Collect",
        content: [
            { subtitle: "Account Information", text: "When you create an account, we collect your name, email address, and optionally a profile picture. If you sign up with Google or GitHub, we receive your public profile information from those services." },
            { subtitle: "Profile Information", text: "Information you voluntarily add to your profile — bio, job title, company, experience level, skills, interests, GitHub username, and portfolio URL." },
            { subtitle: "User-Generated Content", text: "Posts, comments, project descriptions, event details, job listings, messages, and other content you create on the platform." },
            { subtitle: "Usage Data", text: "Basic interaction data such as pages visited, features used, and timestamps of actions. We do not use third-party analytics trackers." },
        ],
    },
    {
        icon: <Eye size={22} />,
        title: "How We Use Your Information",
        content: [
            { subtitle: "Platform Functionality", text: "To provide core platform features — displaying your profile, connecting you with your city's community, delivering messages, showing relevant events and discussions." },
            { subtitle: "Community Features", text: "To power features like the reputation system, leaderboard, mentorship matching, and governance voting — all based on your public community activity." },
            { subtitle: "Communication", text: "To send platform notifications (event reminders, mentorship requests, discussion replies). We do not send marketing emails." },
            { subtitle: "Moderation", text: "To review reported content and enforce our Community Guidelines and Code of Conduct." },
        ],
    },
    {
        icon: <Lock size={22} />,
        title: "How We Protect Your Data",
        content: [
            { subtitle: "Encryption", text: "All data transmitted between your browser and DevCircle servers is encrypted using HTTPS/TLS. Passwords are hashed using bcrypt and never stored in plain text." },
            { subtitle: "Access Control", text: "Access to the database and server infrastructure is restricted to authorized maintainers only. We follow the principle of least privilege." },
            { subtitle: "Open Source", text: "DevCircle's codebase is fully open-source, meaning our data handling practices are transparent and auditable by anyone." },
        ],
    },
    {
        icon: <Globe size={22} />,
        title: "Information Sharing",
        content: [
            { subtitle: "Public Profile", text: "Your name, profile picture, bio, skills, and community activity are visible to other DevCircle members. This is essential for the community platform to function." },
            { subtitle: "No Third-Party Sales", text: "We never sell, rent, or trade your personal information to third parties. DevCircle is a community project, not an advertising business." },
            { subtitle: "No Advertising", text: "We do not serve advertisements or share data with ad networks. There is no tracking for advertising purposes." },
            { subtitle: "Legal Requirements", text: "We may disclose information if required by law or to protect the safety of our community members." },
        ],
    },
    {
        icon: <UserCheck size={22} />,
        title: "Your Rights",
        content: [
            { subtitle: "Access & Portability", text: "You can access all your personal data through your profile page. You have the right to request a copy of all data we hold about you." },
            { subtitle: "Correction", text: "You can update your profile information at any time through the Edit Profile page." },
            { subtitle: "Deletion", text: "You can request complete deletion of your account and associated data by contacting the moderation team." },
            { subtitle: "Consent Withdrawal", text: "You can disconnect OAuth providers (Google, GitHub) at any time from your settings page." },
        ],
    },
    {
        icon: <Shield size={22} />,
        title: "Cookies & Local Storage",
        content: [
            { subtitle: "Authentication", text: "We use a session cookie to keep you logged in. This is essential for the platform to function and cannot be disabled while using DevCircle." },
            { subtitle: "No Tracking Cookies", text: "We do not use advertising cookies, analytics cookies, or any third-party tracking cookies." },
            { subtitle: "Local Storage", text: "We may use browser local storage for UI preferences (such as theme settings). This data stays on your device." },
        ],
    },
];

export default function PrivacyPage() {
    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Hero */}
            <section className="grid-bg" style={{ padding: "80px 0 60px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: 24, fontSize: 13, color: "#10b981", fontWeight: 600 }}>
                        <Shield size={14} /> Privacy Policy
                    </div>
                    <h1 style={{ fontSize: 40, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-1.5px", lineHeight: 1.15, margin: "0 0 20px" }}>
                        Privacy Policy
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.55)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
                        Your privacy matters. Here's exactly how DevCircle handles your data — transparently and simply.
                    </p>
                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.35)", marginTop: 16 }}>
                        Last updated: March 2026
                    </p>
                </div>
            </section>

            {/* Summary */}
            <section className="section" style={{ padding: "48px 0 24px" }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div className="glass-card" style={{ padding: "32px 40px", borderLeft: "3px solid #10b981" }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f4ff", margin: "0 0 12px" }}>TL;DR</h2>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8, margin: 0, padding: 0 }}>
                            {[
                                "We only collect what's needed to run the platform",
                                "We never sell your data or show ads",
                                "Your password is hashed and never stored in plain text",
                                "All our code is open-source — audit it yourself",
                                "You can request data deletion at any time",
                            ].map(item => (
                                <li key={item} style={{ fontSize: 14, color: "rgba(240,244,255,0.6)", paddingLeft: 20, position: "relative", lineHeight: 1.6 }}>
                                    <span style={{ position: "absolute", left: 0, color: "#10b981" }}>✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Full Policy */}
            <section className="section" style={{ padding: "24px 0 80px" }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        {sections.map((section, idx) => (
                            <div key={section.title} className="glass-card" style={{ padding: 40 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                                    <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316" }}>
                                        {section.icon}
                                    </div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>{section.title}</h2>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                    {section.content.map(item => (
                                        <div key={item.subtitle}>
                                            <h3 style={{ fontSize: 15, fontWeight: 600, color: "rgba(240,244,255,0.8)", margin: "0 0 6px" }}>{item.subtitle}</h3>
                                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact */}
                    <div className="glass-card" style={{ padding: 48, textAlign: "center", marginTop: 32, border: "1px solid rgba(16,185,129,0.15)" }}>
                        <Mail size={28} color="#10b981" style={{ marginBottom: 16 }} />
                        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f4ff", margin: "0 0 12px" }}>Questions About Your Privacy?</h2>
                        <p style={{ fontSize: 15, color: "rgba(240,244,255,0.5)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 24px" }}>
                            If you have questions about this policy or want to exercise your rights regarding your data, reach out to the moderation team.
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
