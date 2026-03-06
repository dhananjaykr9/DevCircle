import { auth } from "../../../auth";
import prisma from "@/lib/prisma";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import { Github, Plus, Search } from "lucide-react";

export const metadata = {
    title: "Open Source Hub — DevCircle",
};

export default async function OpenSourcePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams;
    const searchQuery = params.q || "";
    const session = await auth();

    const where: any = { type: "Open Source" };
    if (searchQuery) {
        where.AND = [
            { type: "Open Source" },
            { OR: [
                { title: { contains: searchQuery } },
                { description: { contains: searchQuery } },
                { techStack: { contains: searchQuery } },
            ]}
        ];
        delete where.type;
    }

    const osProjects = await prisma.project.findMany({
        where,
        include: {
            author: { select: { name: true, image: true, id: true } },
            city: true
        },
        orderBy: { createdAt: "desc" }
    });

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            {/* Hero Section */}
            <section style={{ padding: "80px 0 60px", background: "rgba(13,17,32,0.5)", position: "relative", overflow: "hidden" }} className="grid-bg">
                <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "#10b981", filter: "blur(150px)", opacity: 0.1, top: -150, right: -100, zIndex: 0, pointerEvents: "none" }} />

                <div className="container" style={{ position: "relative", zIndex: 2, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 30 }}>
                    <div style={{ maxWidth: 600 }}>
                        <div className="fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", marginBottom: 20, color: "#10b981", fontSize: 13, fontWeight: 600 }}>
                            <Github size={14} /> Official Hub
                        </div>
                        <h1 style={{ fontSize: 42, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 16px 0", letterSpacing: "-1px" }}>
                            Contribute to <span style={{ color: "#10b981" }}>Open Source</span>
                        </h1>
                        <p style={{ fontSize: 18, color: "rgba(240,244,255,0.6)", margin: 0, lineHeight: 1.6 }}>
                            Discover community-led open source projects. Join teams, write code, and build your portfolio alongside other DevCircle members.
                        </p>
                    </div>
                    <div>
                        <Link href="/projects/new" className="btn-primary" style={{ padding: "14px 28px", fontSize: 15, display: "inline-flex", alignItems: "center", gap: 8 }}>
                            <Plus size={18} /> Add Your Repository
                        </Link>
                    </div>
                </div>
            </section>

            {/* Search */}
            <section style={{ padding: "24px 0 0" }}>
                <div className="container" style={{ maxWidth: 1000 }}>
                    <form action="/open-source" method="get" style={{ position: "relative", maxWidth: 480 }}>
                        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,244,255,0.3)" }} />
                        <input className="input" name="q" defaultValue={searchQuery} placeholder="Search open source projects..." style={{ paddingLeft: 38 }} suppressHydrationWarning />
                    </form>
                </div>
            </section>

            {/* List */}
            <section className="section" style={{ flex: 1 }}>
                <div className="container" style={{ maxWidth: 1000 }}>
                    {osProjects.length === 0 ? (
                        <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
                            <Github size={48} style={{ margin: "0 auto 20px", opacity: 0.3 }} color="#f0f4ff" />
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", margin: "0 0 8px 0" }}>No open source projects yet</h2>
                            <p style={{ fontSize: 15, color: "rgba(240,244,255,0.5)", margin: "0 0 24px 0" }}>Be the first to share an open source repository with the community.</p>
                            <Link href="/projects/new" className="btn-primary" style={{ padding: "10px 20px" }}>Share Repository</Link>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))" }}>
                            {osProjects.map((project) => (
                                <ProjectCard key={project.id} project={project as any} currentUserId={session?.user?.id} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
