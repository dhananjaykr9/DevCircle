import Link from "next/link";
import { MapPin, Users, Plus, Search, Filter, ExternalLink, GitBranch, Lightbulb, Rocket } from "lucide-react";
import Footer from "@/components/Footer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export default async function ProjectsPage() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
            city: true
        }
    });

    const openSourceCount = await prisma.project.count({ where: { type: "Open Source" } });
    const startupCount = await prisma.project.count({ where: { type: "Startup" } });
    const researchCount = await prisma.project.count({ where: { type: "Research" } });

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
                        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,244,255,0.3)" }} />
                            <input className="input" placeholder="Search projects..." style={{ paddingLeft: 38 }} />
                        </div>
                        {["All Types", "Open Source", "Startup", "Research"].map((f, i) => (
                            <button
                                key={f}
                                style={{
                                    padding: "10px 16px",
                                    borderRadius: 10,
                                    border: "1px solid",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    background: i === 0 ? "rgba(249,115,22,0.15)" : "transparent",
                                    color: i === 0 ? "#f97316" : "rgba(240,244,255,0.5)",
                                    borderColor: i === 0 ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.08)",
                                }}
                            >
                                {f}
                            </button>
                        ))}
                        <button className="btn-secondary" style={{ padding: "10px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                            <Filter size={14} /> City
                        </button>
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
                        {projects.map((p) => {
                            const status = statusColors[p.status] || statusColors.Active;
                            return (
                                <div key={p.id} className="glass-card" style={{ padding: 28 }}>
                                    {/* Header */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                            <span className={`tag ${typeColors[p.type] || ""}`} style={{ fontSize: 11 }}>{p.type}</span>
                                            <span
                                                style={{
                                                    fontSize: 11,
                                                    padding: "3px 9px",
                                                    borderRadius: 100,
                                                    fontWeight: 500,
                                                    background: status.bg,
                                                    color: status.color,
                                                }}
                                            >
                                                {p.status}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(240,244,255,0.35)" }}>
                                            <MapPin size={11} /> {p.city.name}
                                        </div>
                                    </div>

                                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 700, color: "#f0f4ff", marginBottom: 10, lineHeight: 1.35 }}>
                                        {p.title}
                                    </h3>
                                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", lineHeight: 1.7, marginBottom: 18 }}>{p.description}</p>

                                    {/* Tech stack */}
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                                        {p.techStack?.split(',').map((t) => (
                                            <span key={t} className="tag tag-blue" style={{ fontSize: 11 }}>{t}</span>
                                        ))}
                                    </div>

                                    {/* Looking for */}
                                    <div style={{ marginBottom: 20 }}>
                                        <div style={{ fontSize: 12, color: "rgba(240,244,255,0.35)", marginBottom: 7 }}>Looking for:</div>
                                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                            {p.lookingFor?.split(',').map((r) => (
                                                <span key={r} className="tag" style={{ fontSize: 11 }}>{r}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="divider" style={{ marginBottom: 18 }} />
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div
                                                style={{
                                                    width: 28,
                                                    height: 28,
                                                    borderRadius: "50%",
                                                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    color: "white",
                                                }}
                                            >
                                                {p.author.name?.substring(0, 2).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 12, fontWeight: 500, color: "#f0f4ff" }}>{p.author.name}</div>
                                                <div style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>
                                                    <Users size={10} style={{ display: "inline", marginRight: 3 }} />
                                                    {p.teamSize} members · Recently
                                                </div>
                                            </div>
                                        </div>
                                        <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 12, borderRadius: 9 }}>
                                            Apply <ExternalLink size={12} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
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
