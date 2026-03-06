import Footer from "@/components/Footer";
import Link from "next/link";
import { HelpCircle, Search, MessageSquare, BookOpen, Users, MapPin, Code2, Shield, Mail } from "lucide-react";

export const metadata = {
    title: "Help Center — DevCircle",
    description: "Get help with DevCircle — find answers, learn how to use the platform, and get support from the community.",
};

const categories = [
    {
        icon: <Users size={24} />,
        title: "Getting Started",
        description: "New to DevCircle? Start here.",
        articles: [
            { q: "How do I create an account?", a: "Click 'Join DevCircle' on the homepage or navigate to the signup page. You can sign up with your email, GitHub, or Google account." },
            { q: "How do I join my city's community?", a: "During onboarding, select your city from the available list. You can change your city later from your profile settings." },
            { q: "Is DevCircle free to use?", a: "Yes! DevCircle is 100% free and open-source. There are no premium plans, no paywalls — community tools should be accessible to everyone." },
            { q: "How do I complete my profile?", a: "Go to Profile → Edit Profile. Add your skills, interests, experience level, bio, and connect your GitHub account for a stronger profile." },
        ],
    },
    {
        icon: <MessageSquare size={24} />,
        title: "Discussions & Content",
        description: "Post, comment, and engage.",
        articles: [
            { q: "How do I start a discussion?", a: "Navigate to Discussions → New Discussion. Choose a tag, write your content, and submit. Discussions are visible to your city's community." },
            { q: "How do upvotes work?", a: "Upvote discussions, comments, and answers you find helpful. Upvotes contribute to the author's reputation score and help surface quality content." },
            { q: "Can I edit or delete my posts?", a: "Currently, posts can be reported for moderation. Full post editing features are on our roadmap." },
        ],
    },
    {
        icon: <Code2 size={24} />,
        title: "Projects & Collaboration",
        description: "Share and collaborate on projects.",
        articles: [
            { q: "How do I share a project?", a: "Go to Projects → New Project. Add your project details, GitHub link, tech stack, and description. Projects are discoverable by all community members." },
            { q: "How do I find collaborators?", a: "Post your project with 'Looking for Contributors' tag, or browse the Network page to find developers with matching skills." },
        ],
    },
    {
        icon: <MapPin size={24} />,
        title: "Events",
        description: "Find and create local events.",
        articles: [
            { q: "How do I find events in my city?", a: "Visit the Events page to see upcoming events in your city. RSVP to events to receive reminders." },
            { q: "How do I create an event?", a: "Navigate to Events → New Event. Fill in the title, date, location, and description. Events are visible to members in the relevant city." },
            { q: "Can I manage RSVPs for my event?", a: "Yes! As an event organizer, visit your event's manage page to see attendee lists and manage event details." },
        ],
    },
    {
        icon: <BookOpen size={24} />,
        title: "Mentorship",
        description: "Find or become a mentor.",
        articles: [
            { q: "How do I find a mentor?", a: "Visit the Mentorship page to browse available mentors. Send a mentorship request explaining what you'd like help with." },
            { q: "How do I become a mentor?", a: "Enable 'Open to Mentoring' in your profile edit page. This displays you in the mentorship directory for your city." },
        ],
    },
    {
        icon: <Shield size={24} />,
        title: "Safety & Moderation",
        description: "Keep the community safe.",
        articles: [
            { q: "How do I report someone or content?", a: "Use the Report button available on posts, comments, and member profiles. Reports are reviewed confidentially by moderators." },
            { q: "What happens when I report something?", a: "The moderation team reviews the report, assesses it against our Community Guidelines and Code of Conduct, and takes appropriate action. You may receive a follow-up." },
            { q: "Where can I read the rules?", a: "See our Community Guidelines and Code of Conduct linked in the footer of every page." },
        ],
    },
];

export default function HelpPage() {
    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Hero */}
            <section className="grid-bg" style={{ padding: "80px 0 60px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", marginBottom: 24, fontSize: 13, color: "#3b82f6", fontWeight: 600 }}>
                        <HelpCircle size={14} /> Help Center
                    </div>
                    <h1 style={{ fontSize: 40, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-1.5px", lineHeight: 1.15, margin: "0 0 20px" }}>
                        How Can We Help?
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.55)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
                        Find answers to common questions about using DevCircle, or browse topics below.
                    </p>
                </div>
            </section>

            {/* Quick Links */}
            <section className="section" style={{ padding: "48px 0 24px" }}>
                <div className="container" style={{ maxWidth: 900 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                        {[
                            { label: "Community Guidelines", href: "/guidelines", icon: <BookOpen size={20} />, color: "#10b981" },
                            { label: "Code of Conduct", href: "/code-of-conduct", icon: <Shield size={20} />, color: "#8b5cf6" },
                            { label: "Moderation Policy", href: "/moderation", icon: <Shield size={20} />, color: "#ef4444" },
                        ].map(link => (
                            <Link key={link.label} href={link.href} className="glass-card" style={{ padding: "20px 24px", textDecoration: "none", display: "flex", alignItems: "center", gap: 14, transition: "border-color 0.2s" }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${link.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: link.color, flexShrink: 0 }}>
                                    {link.icon}
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Categories */}
            <section className="section" style={{ padding: "24px 0 80px" }}>
                <div className="container" style={{ maxWidth: 900 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                        {categories.map(cat => (
                            <div key={cat.title}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(249,115,22,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f97316" }}>
                                        {cat.icon}
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>{cat.title}</h2>
                                        <p style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", margin: "4px 0 0" }}>{cat.description}</p>
                                    </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {cat.articles.map(article => (
                                        <div key={article.q} className="glass-card" style={{ padding: "20px 24px" }}>
                                            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", margin: "0 0 8px" }}>{article.q}</h3>
                                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", lineHeight: 1.7, margin: 0 }}>{article.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Still need help */}
                    <div className="glass-card" style={{ padding: 48, textAlign: "center", marginTop: 48, border: "1px solid rgba(249,115,22,0.15)" }}>
                        <Mail size={32} color="#f97316" style={{ marginBottom: 16 }} />
                        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f4ff", margin: "0 0 12px" }}>Still Need Help?</h2>
                        <p style={{ fontSize: 15, color: "rgba(240,244,255,0.5)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 24px" }}>
                            Can't find what you're looking for? Reach out to the community in Discussions, or open an issue on our GitHub repository.
                        </p>
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href="/discussions" className="btn-primary" style={{ textDecoration: "none", fontSize: 14 }}>
                                Ask the Community
                            </Link>
                            <a href="https://github.com/devcircle/issues" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: "none", fontSize: 14 }}>
                                Open GitHub Issue
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
