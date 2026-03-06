import Footer from "@/components/Footer";
import Link from "next/link";
import { Scale, Heart, Shield, AlertTriangle, Eye, Mail } from "lucide-react";

export const metadata = {
    title: "Code of Conduct — DevCircle",
    description: "The DevCircle Contributor Covenant Code of Conduct — our commitment to a harassment-free, inclusive community.",
};

export default function CodeOfConductPage() {
    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Hero */}
            <section className="grid-bg" style={{ padding: "80px 0 60px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", marginBottom: 24, fontSize: 13, color: "#8b5cf6", fontWeight: 600 }}>
                        <Scale size={14} /> Code of Conduct
                    </div>
                    <h1 style={{ fontSize: 40, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-1.5px", lineHeight: 1.15, margin: "0 0 20px" }}>
                        Code of Conduct
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.55)", lineHeight: 1.7, maxWidth: 600, margin: "0 auto" }}>
                        Based on the Contributor Covenant — our pledge to make DevCircle a welcoming space for everyone.
                    </p>
                </div>
            </section>

            <section className="section" style={{ padding: "48px 0 80px" }}>
                <div className="container" style={{ maxWidth: 800 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

                        {/* Our Pledge */}
                        <div className="glass-card" style={{ padding: 40 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Heart size={22} color="#f97316" />
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>Our Pledge</h2>
                            </div>
                            <p style={{ fontSize: 15, color: "rgba(240,244,255,0.6)", lineHeight: 1.8, margin: 0 }}>
                                We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.
                            </p>
                            <p style={{ fontSize: 15, color: "rgba(240,244,255,0.6)", lineHeight: 1.8, marginTop: 16, marginBottom: 0 }}>
                                We pledge to act and interact in ways that contribute to an open, welcoming, diverse, inclusive, and healthy community.
                            </p>
                        </div>

                        {/* Our Standards */}
                        <div className="glass-card" style={{ padding: 40 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Shield size={22} color="#10b981" />
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>Our Standards</h2>
                            </div>

                            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#10b981", marginBottom: 12, marginTop: 0 }}>
                                Examples of positive behavior:
                            </h3>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, margin: "0 0 24px", padding: 0 }}>
                                {[
                                    "Demonstrating empathy and kindness toward other people",
                                    "Being respectful of differing opinions, viewpoints, and experiences",
                                    "Giving and gracefully accepting constructive feedback",
                                    "Accepting responsibility and apologizing to those affected by our mistakes, and learning from the experience",
                                    "Focusing on what is best not just for us as individuals, but for the overall community",
                                ].map(item => (
                                    <li key={item} style={{ fontSize: 14, color: "rgba(240,244,255,0.55)", lineHeight: 1.7, paddingLeft: 20, position: "relative" }}>
                                        <span style={{ position: "absolute", left: 0, color: "#10b981" }}>✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#ef4444", marginBottom: 12, marginTop: 0 }}>
                                Examples of unacceptable behavior:
                            </h3>
                            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, margin: 0, padding: 0 }}>
                                {[
                                    "The use of sexualized language or imagery, and sexual attention or advances of any kind",
                                    "Trolling, insulting or derogatory comments, and personal or political attacks",
                                    "Public or private harassment",
                                    "Publishing others' private information, such as a physical or email address, without their explicit permission",
                                    "Other conduct which could reasonably be considered inappropriate in a professional setting",
                                ].map(item => (
                                    <li key={item} style={{ fontSize: 14, color: "rgba(240,244,255,0.55)", lineHeight: 1.7, paddingLeft: 20, position: "relative" }}>
                                        <span style={{ position: "absolute", left: 0, color: "#ef4444" }}>✗</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Enforcement Responsibilities */}
                        <div className="glass-card" style={{ padding: 40 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Eye size={22} color="#3b82f6" />
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>Enforcement Responsibilities</h2>
                            </div>
                            <p style={{ fontSize: 15, color: "rgba(240,244,255,0.6)", lineHeight: 1.8, margin: 0 }}>
                                Community leaders and moderators are responsible for clarifying and enforcing our standards of acceptable behavior. They will take appropriate and fair corrective action in response to any behavior that they deem inappropriate, threatening, offensive, or harmful. Moderators have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct.
                            </p>
                        </div>

                        {/* Scope */}
                        <div className="glass-card" style={{ padding: 40 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(245,158,11,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Scale size={22} color="#f59e0b" />
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>Scope</h2>
                            </div>
                            <p style={{ fontSize: 15, color: "rgba(240,244,255,0.6)", lineHeight: 1.8, margin: 0 }}>
                                This Code of Conduct applies within all community spaces — including the DevCircle platform, GitHub repositories, events, and social media channels — and also applies when an individual is officially representing the community in public spaces. This includes using an official email address, posting via an official social media account, or acting as an appointed representative at an online or offline event.
                            </p>
                        </div>

                        {/* Enforcement Guidelines */}
                        <div className="glass-card" style={{ padding: 40, border: "1px solid rgba(239,68,68,0.15)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                                <div style={{ width: 42, height: 42, borderRadius: 10, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <AlertTriangle size={22} color="#ef4444" />
                                </div>
                                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>Enforcement Guidelines</h2>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                {[
                                    { level: "1. Correction", impact: "Use of inappropriate language or other behavior deemed unprofessional.", consequence: "A private, written warning providing clarity around the nature of the violation and an explanation of why the behavior was inappropriate. A public apology may be requested." },
                                    { level: "2. Warning", impact: "A violation through a single incident or series of actions.", consequence: "A warning with consequences for continued behavior. No interaction with the people involved for a specified period. This includes avoiding interactions in community spaces as well as external channels like social media." },
                                    { level: "3. Temporary Ban", impact: "A serious violation of community standards, including sustained inappropriate behavior.", consequence: "A temporary ban from any sort of interaction or public communication with the community for a specified period. Violating these terms may lead to a permanent ban." },
                                    { level: "4. Permanent Ban", impact: "Demonstrating a pattern of violations, including sustained inappropriate behavior, harassment, or aggression.", consequence: "A permanent ban from any sort of public interaction within the community." },
                                ].map(item => (
                                    <div key={item.level} style={{ padding: "20px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f97316", margin: "0 0 8px" }}>{item.level}</h3>
                                        <p style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", margin: "0 0 4px" }}><strong style={{ color: "rgba(240,244,255,0.7)" }}>Community Impact:</strong> {item.impact}</p>
                                        <p style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", margin: 0 }}><strong style={{ color: "rgba(240,244,255,0.7)" }}>Consequence:</strong> {item.consequence}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reporting */}
                        <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
                            <Mail size={28} color="#f97316" style={{ marginBottom: 16 }} />
                            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f4ff", margin: "0 0 12px" }}>Reporting a Violation</h2>
                            <p style={{ fontSize: 15, color: "rgba(240,244,255,0.55)", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 24px" }}>
                                If you experience or witness behavior that violates this Code of Conduct, please report it using the Report button on any content, or contact the moderation team directly. All reports are handled confidentially.
                            </p>
                            <Link href="/moderation" className="btn-primary" style={{ textDecoration: "none", fontSize: 14 }}>
                                View Moderation Policy
                            </Link>
                        </div>

                        {/* Attribution */}
                        <div style={{ textAlign: "center", fontSize: 13, color: "rgba(240,244,255,0.35)", lineHeight: 1.7, marginTop: 16 }}>
                            This Code of Conduct is adapted from the <a href="https://www.contributor-covenant.org" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(240,244,255,0.5)", textDecoration: "underline" }}>Contributor Covenant</a>, version 2.1.
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
