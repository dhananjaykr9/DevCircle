import Footer from "@/components/Footer";
import Link from "next/link";
import { HelpCircle, ChevronDown, MessageSquare, Users, Code2, MapPin, Shield, Briefcase, Award } from "lucide-react";

export const metadata = {
    title: "FAQs — DevCircle",
    description: "Frequently asked questions about DevCircle — the open-source hyper-local tech community platform.",
};

const faqs = [
    {
        category: "General",
        icon: <HelpCircle size={20} />,
        questions: [
            { q: "What is DevCircle?", a: "DevCircle is an open-source, hyper-local technology community platform that connects professionals and freshers across cities in India. Think of it as a dedicated space for your city's tech scene — discussions, events, projects, mentorship, jobs, and more." },
            { q: "Is DevCircle free?", a: "Yes, DevCircle is completely free and always will be. We're an open-source project maintained by the community. There are no premium plans, subscriptions, or hidden costs." },
            { q: "Who can join DevCircle?", a: "Anyone interested in technology! Whether you're a student, fresher, working professional, freelancer, startup founder, or tech enthusiast — DevCircle welcomes you. We have members across all experience levels." },
            { q: "How is DevCircle different from LinkedIn or Discord?", a: "DevCircle is purpose-built for local tech communities. Unlike LinkedIn (professional networking) or Discord (chat-focused), DevCircle combines structured discussions, local events, project collaboration, mentorship matching, governance, and reputation — all organized by city." },
        ],
    },
    {
        category: "Account & Profile",
        icon: <Users size={20} />,
        questions: [
            { q: "How do I sign up?", a: "You can sign up using your email with a password, or use Google or GitHub OAuth for one-click sign up. After signing up, you'll go through an onboarding flow to select your city and set up your profile." },
            { q: "Can I change my city after signing up?", a: "Currently, city selection is done during onboarding. Contact a moderator if you need to change your city community." },
            { q: "How do I connect my GitHub account?", a: "Go to Settings → Connected Accounts and click 'Connect' next to GitHub. This links your GitHub profile and can be used for faster sign-in." },
            { q: "How do I delete my account?", a: "Account deletion is currently handled by contacting the moderation team. Self-service account deletion is on our roadmap." },
        ],
    },
    {
        category: "Discussions & Content",
        icon: <MessageSquare size={20} />,
        questions: [
            { q: "What can I post in Discussions?", a: "Anything tech-related! Ask questions, share tutorials, discuss trends, seek code reviews, share learning resources, or start conversations about local tech scene. Keep posts relevant and respectful." },
            { q: "How do I format my posts?", a: "Discussions support plain text content. Simply write your post with a clear title and detailed description. Markdown support is planned for a future update." },
            { q: "Can I edit or delete my posts?", a: "Post editing is on our roadmap. If you need content removed, use the Report button or contact a moderator." },
        ],
    },
    {
        category: "Events",
        icon: <MapPin size={20} />,
        questions: [
            { q: "Can anyone create an event?", a: "Yes! Any registered member can create events. Fill in the event details including title, date, location type (in-person or virtual), and description." },
            { q: "How do RSVPs work?", a: "Click the RSVP button on any event to confirm your attendance. Event organizers can see the list of attendees on their event's manage page." },
            { q: "Are events free?", a: "DevCircle itself doesn't charge for events. Individual event organizers set their own terms. Most community events on DevCircle are free." },
        ],
    },
    {
        category: "Projects & Open Source",
        icon: <Code2 size={20} />,
        questions: [
            { q: "How do I showcase my project?", a: "Navigate to Projects → New Project. Add your project name, description, GitHub link, tech stack, and a brief overview. Projects are visible to the entire community." },
            { q: "How do I find projects to contribute to?", a: "Browse the Projects page to discover projects from fellow community members. Look for projects tagged with frameworks or languages you're interested in." },
            { q: "Can I contribute to DevCircle itself?", a: "Absolutely! DevCircle is open-source. Check out our Contribution Guide on the Open Source page, or visit our GitHub repository to find issues you can work on." },
        ],
    },
    {
        category: "Reputation & Leaderboard",
        icon: <Award size={20} />,
        questions: [
            { q: "How does the reputation system work?", a: "You earn reputation points through community contributions — posting discussions, receiving upvotes, creating projects, attending events, mentoring others, and more. Higher reputation unlocks badges and governance privileges." },
            { q: "What are badges?", a: "Badges are awarded for specific achievements and milestones. They appear on your profile and showcase your contributions to the community." },
            { q: "How is the leaderboard calculated?", a: "The leaderboard ranks members by their total reputation points within each city community. It's updated in real-time as members earn points through contributions." },
        ],
    },
    {
        category: "Jobs",
        icon: <Briefcase size={20} />,
        questions: [
            { q: "Can I post a job listing?", a: "Yes! Navigate to Jobs → Post Job. Add the job title, company, location, salary range, and description. Job listings are visible to the entire community." },
            { q: "Are job listings verified?", a: "Job listings are community-posted. While moderators review reported listings, we encourage users to verify job opportunities independently before applying." },
        ],
    },
    {
        category: "Safety & Privacy",
        icon: <Shield size={20} />,
        questions: [
            { q: "How is my data used?", a: "DevCircle only stores information you provide (profile, posts, etc.) to power the platform. We don't sell data, show ads, or share information with third parties. See our Privacy Policy for full details." },
            { q: "How do I report harassment or abuse?", a: "Use the Report button on any content or profile. Reports are confidential and reviewed by the moderation team. See our Community Guidelines and Code of Conduct for details." },
            { q: "Can I block someone?", a: "User blocking is on our roadmap. Currently, if someone is harassing you, report them using the Report button and moderators will take action." },
        ],
    },
];

export default function FAQPage() {
    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Hero */}
            <section className="grid-bg" style={{ padding: "80px 0 60px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container" style={{ maxWidth: 800, textAlign: "center" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 24, fontSize: 13, color: "#f59e0b", fontWeight: 600 }}>
                        <HelpCircle size={14} /> FAQs
                    </div>
                    <h1 style={{ fontSize: 40, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-1.5px", lineHeight: 1.15, margin: "0 0 20px" }}>
                        Frequently Asked Questions
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.55)", lineHeight: 1.7, maxWidth: 560, margin: "0 auto" }}>
                        Quick answers to the most common questions about DevCircle.
                    </p>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="section" style={{ padding: "48px 0 80px" }}>
                <div className="container" style={{ maxWidth: 850 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
                        {faqs.map(category => (
                            <div key={category.category}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                    <div style={{ color: "#f97316" }}>{category.icon}</div>
                                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>{category.category}</h2>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    {category.questions.map(faq => (
                                        <div key={faq.q} className="glass-card" style={{ padding: "20px 24px" }}>
                                            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", margin: "0 0 10px", display: "flex", alignItems: "flex-start", gap: 8 }}>
                                                <span style={{ color: "#f97316", flexShrink: 0, marginTop: 2 }}>Q.</span>
                                                {faq.q}
                                            </h3>
                                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", lineHeight: 1.7, margin: 0, paddingLeft: 22 }}>
                                                {faq.a}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Still have questions */}
                    <div className="glass-card" style={{ padding: 48, textAlign: "center", marginTop: 48, border: "1px solid rgba(249,115,22,0.15)" }}>
                        <HelpCircle size={32} color="#f97316" style={{ marginBottom: 16 }} />
                        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f0f4ff", margin: "0 0 12px" }}>Still Have Questions?</h2>
                        <p style={{ fontSize: 15, color: "rgba(240,244,255,0.5)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 24px" }}>
                            Check out our Help Center for detailed guides, or ask the community directly.
                        </p>
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                            <Link href="/help" className="btn-primary" style={{ textDecoration: "none", fontSize: 14 }}>
                                Help Center
                            </Link>
                            <Link href="/discussions" className="btn-secondary" style={{ textDecoration: "none", fontSize: 14 }}>
                                Ask in Discussions
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
