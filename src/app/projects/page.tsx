import Link from "next/link";
import { MapPin, Users, Plus, Search, Filter, ExternalLink, GitBranch, Lightbulb, Rocket } from "lucide-react";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import prisma from "@/lib/prisma";

export const metadata = {
    title: "Projects — DevCircle",
    description: "Collaborate on startups, open-source projects, and research with professionals and freshers in your city.",
};

const typeColors: Record<string, string> = {
    "Open Source": "tag-green",
    "Startup": "",
    "Research": "tag-purple",
};

const statusColors: Record<string, { bg: string; color: string }> = {
    Active: { bg: "rgba(16,185,129,0.12)", color: "#34d399" },
    Recruiting: { bg: "rgba(249,115,22,0.12)", color: "#fb923c" },
    Ideation: { bg: "rgba(139,92,246,0.12)", color: "#a78bfa" },
};

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
    const params = await searchParams;
    const searchQuery = params.q || "";
    const selectedType = params.type || "";

    const where: any = {};
    if (searchQuery) {
        where.OR = [
            { title: { contains: searchQuery } },
            { description: { contains: searchQuery } },
            { techStack: { contains: searchQuery } },
            { lookingFor: { contains: searchQuery } },
        ];
    }
    if (selectedType) {
        where.type = selectedType;
    }

    const projects = await prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
            city: true
        }
    });

    const openSourceCount = await prisma.project.count({ where: { type: "Open Source" } });
    const startupCount = await prisma.project.count({ where: { type: "Startup" } });
    const researchCount = await prisma.project.count({ where: { type: "Research" } });

    function buildProjectUrl(overrides: Record<string, string>) {
        const p: Record<string, string> = {};
        if (searchQuery) p.q = searchQuery;
        if (selectedType) p.type = selectedType;
        Object.assign(p, overrides);
        Object.keys(p).forEach(k => { if (!p[k]) delete p[k]; });
        const qs = new URLSearchParams(p).toString();
        return `/projects${qs ? `?${qs}` : ""}`;
    }

    return (
        <>
            {/* Header */}
            <section style={{ padding: "64px 0 48px", background: "rgba(13,17,32,0.5)" }} className="grid-bg">
                <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "#10b981", filter: "blur(100px)", WebkitFilter: "blur(100px)", opacity: 0.1, top: -100, right: -50, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2 }}>
                    <span className="tag tag-green" style={{ marginBottom: 14, display: "inline-flex" }}>Collaboration</span>
                    <h1
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "clamp(28px, 4vw, 46px)",
                            fontWeight: 800,
                            letterSpacing: "-1px",
                            color: "#f0f4ff",
                            marginBottom: 12,
                        }}
                    >
                        Project <span style={{ color: "#10b981" }}>Marketplace</span>
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.45)", maxWidth: 520, lineHeight: 1.7, marginBottom: 28 }}>
                        Find co-founders, teammates, and contributors for startups, research, and open-source projects — all within your city.
                    </p>
                    <Link href="/projects/new" className="btn-primary" style={{ display: "inline-flex" }}>
                        <Plus size={16} /> Post a Project
                    </Link>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    {/* Filters */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
                        <form action="/projects" method="get" style={{ position: "relative", flex: 1, minWidth: 200 }}>
                            {selectedType && <input type="hidden" name="type" value={selectedType} />}
                            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,244,255,0.3)" }} />
                            <input className="input" name="q" defaultValue={searchQuery} placeholder="Search projects..." style={{ paddingLeft: 38 }} suppressHydrationWarning />
                        </form>
                        {[{ key: "", label: "All Types" }, { key: "Open Source", label: "Open Source" }, { key: "Startup", label: "Startup" }, { key: "Research", label: "Research" }].map((f) => (
                            <Link
                                key={f.label}
                                href={buildProjectUrl({ type: f.key })}
                                style={{
                                    padding: "10px 16px",
                                    borderRadius: 10,
                                    border: "1px solid",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    background: selectedType === f.key ? "rgba(249,115,22,0.15)" : "transparent",
                                    color: selectedType === f.key ? "#f97316" : "rgba(240,244,255,0.5)",
                                    borderColor: selectedType === f.key ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.08)",
                                }}
                            >
                                {f.label}
                            </Link>
                        ))}
                    </div>

                    <div style={{ display: "flex", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
                        {[
                            { icon: <GitBranch size={14} />, val: String(openSourceCount), lbl: "Open Source Projects" },
                            { icon: <Rocket size={14} />, val: String(startupCount), lbl: "Startups" },
                            { icon: <Lightbulb size={14} />, val: String(researchCount), lbl: "Research Collabs" },
                        ].map((s) => (
                            <div
                                key={s.lbl}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "10px 16px",
                                    borderRadius: 10,
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                }}
                            >
                                <span style={{ color: "#f97316" }}>{s.icon}</span>
                                <span style={{ fontWeight: 700, fontSize: 15, color: "#f0f4ff" }}>{s.val}</span>
                                <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>{s.lbl}</span>
                            </div>
                        ))}
                    </div>

                    {/* Project cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="projects-grid">
                        {projects.map((p) => (
                            <ProjectCard key={p.id} project={p as any} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
        @media (max-width: 768px) { .projects-grid { grid-template-columns: 1fr !important; } }
      `}</style>
        </>
    );
}
