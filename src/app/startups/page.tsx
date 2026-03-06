import Link from "next/link";
import { Search, Rocket, Briefcase, Zap, Users } from "lucide-react";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import prisma from "@/lib/prisma";
import { auth } from "../../../auth";

export const metadata = {
    title: "Startup Co-Founding Hub — DevCircle",
    description: "Find co-founders, join early-stage startups, and build the next big thing in your city.",
};

export default async function StartupsHubPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const params = await searchParams;
    const searchQuery = params.q || "";
    const session = await auth();

    const where: any = { type: "Startup" };
    if (searchQuery) {
        where.OR = [
            { title: { contains: searchQuery } },
            { description: { contains: searchQuery } },
            { techStack: { contains: searchQuery } },
            { lookingFor: { contains: searchQuery } },
        ];
        where.type = "Startup";
        // Rebuild with AND to combine type + search
        delete where.OR;
        where.AND = [
            { type: "Startup" },
            { OR: [
                { title: { contains: searchQuery } },
                { description: { contains: searchQuery } },
                { techStack: { contains: searchQuery } },
                { lookingFor: { contains: searchQuery } },
            ]}
        ];
    }

    const startups = await prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            author: true,
            city: true
        }
    });

    const activeStartupsCount = await prisma.project.count({ where: { type: "Startup", status: "Recruiting" } });
    const totalStartupsCount = await prisma.project.count({ where: { type: "Startup" } });
    const inProgressCount = await prisma.project.count({ where: { type: "Startup", status: "In Progress" } });

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <section style={{ padding: "64px 0 48px", background: "rgba(13,17,32,0.5)", borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="grid-bg">
                <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#f59e0b", filter: "blur(120px)", WebkitFilter: "blur(120px)", opacity: 0.1, top: -100, left: -50, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 16, color: "#f59e0b", fontSize: 13, fontWeight: 600 }}>
                        <Rocket size={14} /> Founder Matching
                    </div>
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
                        Startup <span style={{ color: "#f59e0b" }}>Co-Founding Hub</span>
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.45)", maxWidth: 520, lineHeight: 1.7, marginBottom: 28 }}>
                        Find technical co-founders, early engineers, and designers to build the next big thing in your city. Stop searching globally when talent is local.
                    </p>
                    <div style={{ display: "flex", gap: 14 }}>
                        <Link href="/projects/new" className="btn-primary" style={{ display: "inline-flex", background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none" }}>
                            Pitch Your Startup
                        </Link>
                    </div>
                </div>
            </section>

            <section className="section" style={{ flex: 1 }}>
                <div className="container">

                    {/* Metrics */}
                    <div style={{ display: "flex", gap: 20, marginBottom: 40, flexWrap: "wrap" }}>
                        {[
                            { icon: <Zap size={16} />, val: String(activeStartupsCount), lbl: "Actively Recruiting" },
                            { icon: <Briefcase size={16} />, val: String(totalStartupsCount), lbl: "Total Startups Listed" },
                            { icon: <Users size={16} />, val: String(inProgressCount), lbl: "Teams Formed" },
                        ].map((s) => (
                            <div
                                key={s.lbl}
                                className="glass-card"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    padding: "16px 24px",
                                    flex: "1 1 200px"
                                }}
                            >
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245,158,11,0.1)", color: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {s.icon}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: 24, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{s.val}</div>
                                    <div style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", marginTop: 4 }}>{s.lbl}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div style={{ display: "flex", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
                        <form action="/startups" method="get" style={{ position: "relative", flex: 1, minWidth: 200 }}>
                            <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,244,255,0.3)" }} />
                            <input className="input" name="q" defaultValue={searchQuery} placeholder="Search startups by tech stack or role..." style={{ paddingLeft: 38 }} />
                        </form>
                    </div>

                    {/* Startup cards */}
                    {startups.length === 0 ? (
                        <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
                            <Rocket size={40} style={{ margin: "0 auto 16px", opacity: 0.2 }} color="#f0f4ff" />
                            <h3 style={{ fontSize: 18, color: "#f0f4ff", margin: "0 0 8px 0" }}>No startups listed yet</h3>
                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", margin: 0 }}>Be the first founder to list a startup in your city.</p>
                        </div>
                    ) : (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="projects-grid">
                            {startups.map((p) => (
                                <ProjectCard key={p.id} project={p as any} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />

            <style>{`
                @media (max-width: 768px) { .projects-grid { grid-template-columns: 1fr !important; } }
            `}</style>
        </main>
    );
}
