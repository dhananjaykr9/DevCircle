import { auth } from "../../../auth";
import prisma from "@/lib/prisma";
import Footer from "@/components/Footer";
import { BookOpen, Link as LinkIcon, Plus, Lightbulb, Search, BookMarked, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { submitResource } from "@/lib/actions/learning";

export const metadata = {
    title: "Learning Hub — DevCircle",
};

export default async function LearningHubPage({ searchParams }: { searchParams: Promise<{ category?: string; tag?: string }> }) {
    const session = await auth();
    const params = await searchParams;
    const activeCategory = params.category || "All";
    const activeTag = params.tag || "";

    const whereClause: any = {};
    if (activeCategory !== "All") whereClause.category = activeCategory;
    if (activeTag) whereClause.techStack = { contains: activeTag };

    const resources = await prisma.resource.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: { submitter: { select: { name: true, image: true } } }
    });

    // Extract all unique tags for the sidebar filter
    const allResources = await prisma.resource.findMany({ select: { techStack: true } });
    const rawTags = allResources.map(r => r.techStack.split(',').map(t => t.trim())).flat();
    const tagCounts = rawTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    const topTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(e => e[0]);

    const categories = [
        { label: "All", icon: <BookOpen size={16} /> },
        { label: "Courses", icon: <MonitorPlay size={16} /> },
        { label: "Tutorials", icon: <Lightbulb size={16} /> },
        { label: "Documentation", icon: <BookMarked size={16} /> },
    ];

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            <section style={{ padding: "60px 0 40px", background: "rgba(13,17,32,0.5)", borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="grid-bg">
                <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 30 }}>
                    <div style={{ maxWidth: 600 }}>
                        <div className="fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: 16, color: "#10b981", fontSize: 13, fontWeight: 600 }}>
                            <BookOpen size={14} /> Learning Resources
                        </div>
                        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 12px 0", letterSpacing: "-1px" }}>
                            Community Curated Knowledge
                        </h1>
                        <p style={{ fontSize: 16, color: "rgba(240,244,255,0.5)", margin: 0, lineHeight: 1.6 }}>
                            Discover the best tutorials, courses, and official documentation shared by senior developers in your city.
                        </p>
                    </div>

                    {session?.user && (
                        <div className="glass-card" style={{ padding: 24, flex: "1 1 350px", maxWidth: 450 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: 8 }}>
                                <Plus size={18} color="#10b981" /> Share a Resource
                            </h3>
                            <form action={async (formData) => { "use server"; await submitResource(formData); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                <input name="title" className="input" placeholder="e.g. Next.js 15 Full Course" required style={{ fontSize: 13 }} />
                                <input name="url" type="url" className="input" placeholder="https://..." required style={{ fontSize: 13 }} />
                                <div style={{ display: "flex", gap: 10 }}>
                                    <select name="category" className="input" required style={{ fontSize: 13, flex: 1 }}>
                                        <option value="Courses">Course</option>
                                        <option value="Tutorials">Tutorial</option>
                                        <option value="Documentation">Documentation</option>
                                        <option value="Tools">Tool</option>
                                    </select>
                                    <input name="techStack" className="input" placeholder="React, Next.js" required style={{ fontSize: 13, flex: 1 }} />
                                </div>
                                <textarea name="description" className="input" placeholder="Why is this resource good?" rows={2} required style={{ fontSize: 13, resize: "none" }} />
                                <button type="submit" className="btn-primary" style={{ padding: "8px", background: "linear-gradient(135deg, #10b981, #059669)", border: "none" }}>
                                    Submit
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>

            <section className="section" style={{ flex: 1 }}>
                <div className="container" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 30 }}>

                    {/* Sidebar Filters */}
                    <div>
                        <div className="glass-card" style={{ padding: 20 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Categories</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 30 }}>
                                {categories.map(c => (
                                    <Link key={c.label} href={`/learning?category=${c.label}${activeTag ? `&tag=${activeTag}` : ''}`} style={{
                                        display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8,
                                        textDecoration: "none", fontSize: 14, fontWeight: 500,
                                        background: activeCategory === c.label ? "rgba(16,185,129,0.15)" : "transparent",
                                        color: activeCategory === c.label ? "#10b981" : "rgba(240,244,255,0.7)",
                                        transition: "all 0.2s"
                                    }}>
                                        {c.icon} {c.label}
                                    </Link>
                                ))}
                            </div>

                            <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Top Tech</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {topTags.map(tag => (
                                    <Link key={tag} href={`/learning?tag=${tag}${activeCategory !== "All" ? `&category=${activeCategory}` : ''}`} style={{
                                        fontSize: 12, padding: "4px 10px", borderRadius: 100, textDecoration: "none",
                                        background: activeTag === tag ? "#10b981" : "rgba(255,255,255,0.05)",
                                        color: activeTag === tag ? "#000" : "rgba(240,244,255,0.6)",
                                        fontWeight: activeTag === tag ? 600 : 400
                                    }}>
                                        {tag}
                                    </Link>
                                ))}
                                {activeTag && (
                                    <Link href={`/learning?category=${activeCategory}`} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 100, color: "rgba(239,68,68,0.8)", textDecoration: "none", background: "rgba(239,68,68,0.1)" }}>
                                        Clear Tag
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Resources Grid */}
                    <div>
                        {resources.length === 0 ? (
                            <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
                                <BookOpen size={40} style={{ margin: "0 auto 16px", opacity: 0.2 }} color="#f0f4ff" />
                                <h3 style={{ fontSize: 18, color: "#f0f4ff", margin: "0 0 8px 0" }}>No resources found</h3>
                                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", margin: 0 }}>Be the first to share a resource for this category or tag.</p>
                            </div>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
                                {resources.map(res => (
                                    <a href={res.url} target="_blank" rel="noopener noreferrer" key={res.id} style={{ textDecoration: "none" }}>
                                        <div className="glass-card" style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column", transition: "transform 0.2s" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                                <span className="tag" style={{ fontSize: 11, background: "rgba(16,185,129,0.1)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>
                                                    {res.category}
                                                </span>
                                                <LinkIcon size={14} color="rgba(240,244,255,0.3)" />
                                            </div>

                                            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#f0f4ff", marginBottom: 8, lineHeight: 1.4 }}>{res.title}</h3>
                                            <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                {res.description}
                                            </p>

                                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                                                {res.techStack.split(',').map(tag => (
                                                    <span key={tag} style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", background: "rgba(255,255,255,0.03)", padding: "2px 8px", borderRadius: 4 }}>
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>

                                            <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 16 }}>
                                                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white" }}>
                                                    {res.submitter.name?.charAt(0) || 'U'}
                                                </div>
                                                <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>Shared by {res.submitter.name}</span>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
