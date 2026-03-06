import Footer from "@/components/Footer";
import Link from "next/link";
import { Users, MapPin, Code2, Heart, Globe, Zap, Shield, GitBranch } from "lucide-react";

export const metadata = {
    title: "About — DevCircle",
    description: "Learn about DevCircle, the open-source hyper-local tech community platform connecting professionals across Indian cities.",
};

const values = [
    { icon: <Users size={24} />, title: "Community First", description: "Every decision is driven by what's best for our community of developers, designers, and tech enthusiasts." },
    { icon: <MapPin size={24} />, title: "Hyper-Local", description: "We believe the strongest connections happen locally. DevCircle organizes communities city-by-city for real-world impact." },
    { icon: <Code2 size={24} />, title: "Open Source", description: "DevCircle is 100% open-source. Every line of code is transparent, auditable, and community-owned." },
    { icon: <Heart size={24} />, title: "Inclusive", description: "We welcome everyone — from first-year students to seasoned architects. Diversity makes us stronger." },
    { icon: <Globe size={24} />, title: "Accessible", description: "Free forever. No paywalls, no premium tiers. Quality community tools should be available to all." },
    { icon: <Shield size={24} />, title: "Safe & Respectful", description: "We enforce a strict Code of Conduct to ensure every member feels welcome and respected." },
];

const stats = [
    { value: "8+", label: "City Communities" },
    { value: "100%", label: "Open Source" },
    { value: "Free", label: "Forever" },
    { value: "0", label: "Paywalls" },
];

export default function AboutPage() {
    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Hero */}
            <section className="grid-bg" style={{ padding: "80px 0 60px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", marginBottom: 24, fontSize: 13, color: "#f97316", fontWeight: 600 }}>
                        <Heart size={14} /> About Us
                    </div>
                    <h1 style={{ fontSize: 44, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-1.5px", lineHeight: 1.15, margin: "0 0 20px" }}>
                        Building India's Largest<br />
                        <span style={{ background: "linear-gradient(135deg, #f97316, #fb923c)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            Open-Source Dev Community
                        </span>
                    </h1>
                    <p style={{ fontSize: 17, color: "rgba(240,244,255,0.55)", lineHeight: 1.7, maxWidth: 620, margin: "0 auto" }}>
                        DevCircle is a community-driven, open-source platform that connects technology professionals and freshers across cities in India — enabling real-world collaboration, mentorship, and growth.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="section" style={{ padding: "48px 0" }}>
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                        {stats.map(s => (
                            <div key={s.label} className="stat-card" style={{ textAlign: "center", padding: 28 }}>
                                <div style={{ fontSize: 36, fontWeight: 800, color: "#f97316", fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
                                <div style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginTop: 6, fontWeight: 500 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="section" style={{ padding: "48px 0 64px" }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div className="glass-card" style={{ padding: 48 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Zap size={22} color="#8b5cf6" />
                            </div>
                            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>Our Mission</h2>
                        </div>
                        <p style={{ fontSize: 15, color: "rgba(240,244,255,0.6)", lineHeight: 1.8, margin: "0 0 16px" }}>
                            India has one of the world's largest developer populations, yet most tech communities operate in isolation — scattered across WhatsApp groups, Discord servers, and LinkedIn posts. DevCircle brings structure, discoverability, and permanence to local tech communities.
                        </p>
                        <p style={{ fontSize: 15, color: "rgba(240,244,255,0.6)", lineHeight: 1.8, margin: 0 }}>
                            We provide a unified platform where developers can find their city's tech scene, discover events, collaborate on projects, mentor newcomers, and grow together — all without corporate gatekeeping or paywalls.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="section" style={{ padding: "0 0 80px" }}>
                <div className="container" style={{ maxWidth: 900 }}>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: "#f0f4ff", textAlign: "center", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 40 }}>Our Values</h2>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                        {values.map(v => (
                            <div key={v.title} className="glass-card" style={{ padding: 32 }}>
                                <div style={{ color: "#f97316", marginBottom: 16 }}>{v.icon}</div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", margin: "0 0 10px" }}>{v.title}</h3>
                                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", lineHeight: 1.7, margin: 0 }}>{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="section" style={{ padding: "0 0 80px" }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <h2 style={{ fontSize: 28, fontWeight: 800, color: "#f0f4ff", textAlign: "center", fontFamily: "'Space Grotesk', sans-serif", marginBottom: 16 }}>How DevCircle Works</h2>
                    <p style={{ fontSize: 15, color: "rgba(240,244,255,0.5)", textAlign: "center", marginBottom: 40, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>Get started in three simple steps</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {[
                            { step: "1", title: "Join Your City", desc: "Sign up and select your city. You'll instantly be connected with the local tech community — developers, designers, and founders in your area." },
                            { step: "2", title: "Engage & Collaborate", desc: "Participate in discussions, attend local events, join open-source projects, find mentors, and discover job opportunities — all tailored to your city." },
                            { step: "3", title: "Grow Together", desc: "Earn reputation through contributions, climb the leaderboard, mentor newcomers, propose governance changes, and help shape the future of your community." },
                        ].map(item => (
                            <div key={item.step} className="glass-card" style={{ padding: "28px 32px", display: "flex", alignItems: "flex-start", gap: 20 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #f97316, #fb923c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "white", flexShrink: 0 }}>{item.step}</div>
                                <div>
                                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", margin: "0 0 8px" }}>{item.title}</h3>
                                    <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Source CTA */}
            <section className="section" style={{ padding: "0 0 80px" }}>
                <div className="container" style={{ maxWidth: 700 }}>
                    <div className="glass-card" style={{ padding: 48, textAlign: "center", border: "1px solid rgba(249,115,22,0.15)" }}>
                        <GitBranch size={32} color="#f97316" style={{ marginBottom: 16 }} />
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: "#f0f4ff", margin: "0 0 12px" }}>Built in the Open</h2>
                        <p style={{ fontSize: 15, color: "rgba(240,244,255,0.5)", lineHeight: 1.7, marginBottom: 28, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
                            DevCircle is fully open-source. Contribute code, report bugs, suggest features, or simply explore how we build community software.
                        </p>
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                            <a href="https://github.com/devcircle" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: "none", fontSize: 14 }}>
                                View on GitHub
                            </a>
                            <Link href="/open-source" className="btn-secondary" style={{ textDecoration: "none", fontSize: 14 }}>
                                Contribution Guide
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
