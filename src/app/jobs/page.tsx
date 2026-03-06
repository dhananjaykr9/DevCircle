import Link from "next/link";
import { Briefcase, MapPin, Clock, Code, ArrowRight, Plus, Search, Wifi } from "lucide-react";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import { auth } from "../../../auth";

export const metadata = {
    title: "Job Board — DevCircle",
    description: "Find tech jobs, internships, and freelance opportunities posted by the DevCircle community across India.",
};

const typeColors: Record<string, { bg: string; color: string; border: string }> = {
    "Full-time": { bg: "rgba(139,92,246,0.12)", color: "#c4b5fd", border: "rgba(139,92,246,0.25)" },
    "Internship": { bg: "rgba(16,185,129,0.12)", color: "#6ee7b7", border: "rgba(16,185,129,0.25)" },
    "Freelance": { bg: "rgba(249,115,22,0.12)", color: "#fdba74", border: "rgba(249,115,22,0.25)" },
    "Contract": { bg: "rgba(59,130,246,0.12)", color: "#93c5fd", border: "rgba(59,130,246,0.25)" },
};

export default async function JobsPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string; q?: string; remote?: string }>;
}) {
    const session = await auth();
    const params = await searchParams;
    const typeFilter = params.type || "";
    const query = params.q || "";
    const remoteOnly = params.remote === "true";

    const where: any = {};
    if (typeFilter) where.type = typeFilter;
    if (remoteOnly) where.isRemote = true;
    if (query) {
        where.OR = [
            { title: { contains: query } },
            { company: { contains: query } },
            { techStack: { contains: query } },
        ];
    }

    const jobs = await prisma.job.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { poster: true, city: true },
    });

    const counts = {
        fullTime: await prisma.job.count({ where: { type: "Full-time" } }),
        internship: await prisma.job.count({ where: { type: "Internship" } }),
        freelance: await prisma.job.count({ where: { type: "Freelance" } }),
        contract: await prisma.job.count({ where: { type: "Contract" } }),
        remote: await prisma.job.count({ where: { isRemote: true } }),
    };

    return (
        <>
            {/* Header */}
            <section style={{ padding: "64px 0 48px", background: "rgba(13,17,32,0.5)" }} className="grid-bg">
                <div style={{ position: "absolute", width: 380, height: 380, borderRadius: "50%", background: "#8b5cf6", filter: "blur(100px)", opacity: 0.1, top: -80, right: -60, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2 }}>
                    <span className="tag tag-purple" style={{ marginBottom: 14, display: "inline-flex" }}>Opportunities</span>
                    <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-1px", color: "#f0f4ff", marginBottom: 12 }}>
                        Job & <span className="gradient-text-purple">Opportunity</span> Board
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.45)", maxWidth: 520, lineHeight: 1.7, marginBottom: 28 }}>
                        Tech jobs, internships, freelance gigs, and contract work posted by the DevCircle community. Support local hiring networks.
                    </p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {session?.user && (
                            <Link href="/jobs/new" className="btn-primary" style={{ display: "inline-flex" }}>
                                <Plus size={16} /> Post Opportunity
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 32 }} className="jobs-layout">

                        {/* Main: Job Listings */}
                        <div>
                            {/* Search + Filter bar */}
                            <form style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
                                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                                    <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,244,255,0.35)" }} />
                                    <input name="q" defaultValue={query} className="input" placeholder="Search job title, company, tech..." style={{ paddingLeft: 38 }} suppressHydrationWarning />
                                </div>
                                <select name="type" defaultValue={typeFilter} className="input" style={{ minWidth: 140 }}>
                                    <option value="">All Types</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Freelance">Freelance</option>
                                    <option value="Contract">Contract</option>
                                </select>
                                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#f0f4ff", padding: "10px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, cursor: "pointer" }}>
                                    <input type="checkbox" name="remote" value="true" defaultChecked={remoteOnly} style={{ accentColor: "#8b5cf6" }} />
                                    Remote Only
                                </label>
                                <button type="submit" className="btn-primary" style={{ padding: "10px 20px" }}>Search</button>
                            </form>

                            {jobs.length === 0 ? (
                                <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
                                    <Briefcase size={48} color="rgba(240,244,255,0.1)" style={{ margin: "0 auto 16px" }} />
                                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f0f4ff", marginBottom: 8 }}>No listings found</h3>
                                    <p style={{ color: "rgba(240,244,255,0.5)", fontSize: 14 }}>Try adjusting your filters. Be the first to post an opportunity!</p>
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                                    {jobs.map((job) => {
                                        const tc = typeColors[job.type] || typeColors["Full-time"];
                                        const daysAgo = Math.floor((Date.now() - job.createdAt.getTime()) / 86400000);
                                        return (
                                            <div key={job.id} className="glass-card" style={{ padding: "22px 26px" }}>
                                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                                                    <div>
                                                        <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f0f4ff", marginBottom: 5, fontFamily: "'Space Grotesk', sans-serif" }}>{job.title}</h3>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                                            <span style={{ fontSize: 14, fontWeight: 600, color: "#f97316" }}>{job.company}</span>
                                                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(240,244,255,0.45)" }}>
                                                                <MapPin size={11} /> {job.isRemote ? "Remote" : job.city.name}
                                                            </span>
                                                            {job.isRemote && (
                                                                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#34d399", padding: "2px 8px", background: "rgba(16,185,129,0.1)", borderRadius: 100 }}>
                                                                    <Wifi size={10} /> Remote
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                                        <span style={{ padding: "4px 10px", borderRadius: 100, fontSize: 12, fontWeight: 500, background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>{job.type}</span>
                                                        {job.salary && (
                                                            <span style={{ fontSize: 13, fontWeight: 600, color: "#a78bfa" }}>{job.salary}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", lineHeight: 1.65, marginBottom: 14 }}>
                                                    {job.description.substring(0, 200)}{job.description.length > 200 ? "..." : ""}
                                                </p>

                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                        {job.techStack.split(",").filter(Boolean).slice(0, 4).map((t) => (
                                                            <span key={t} style={{ fontSize: 11, color: "rgba(240,244,255,0.5)", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 4, border: "1px solid rgba(255,255,255,0.07)" }}>{t.trim()}</span>
                                                        ))}
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "rgba(240,244,255,0.3)" }}>
                                                            <Clock size={10} /> {daysAgo === 0 ? "Today" : `${daysAgo}d ago`}
                                                        </span>
                                                        {job.applyUrl ? (
                                                            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "7px 18px", fontSize: 13, borderRadius: 8, display: "flex", alignItems: "center", gap: 5, textDecoration: "none" }}>
                                                                Apply <ArrowRight size={13} />
                                                            </a>
                                                        ) : (
                                                            <span style={{ fontSize: 12, color: "rgba(240,244,255,0.3)", fontStyle: "italic" }}>Contact via profile</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {/* Stats */}
                            <div className="glass-card" style={{ padding: 22 }}>
                                <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.6)", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.06em" }}>Opportunity Types</h3>
                                {[
                                    { label: "Full-time", count: counts.fullTime, icon: "💼" },
                                    { label: "Internship", count: counts.internship, icon: "🎓" },
                                    { label: "Freelance", count: counts.freelance, icon: "⚡" },
                                    { label: "Contract", count: counts.contract, icon: "📋" },
                                    { label: "Remote roles", count: counts.remote, icon: "🌐" },
                                ].map((s) => (
                                    <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <span style={{ fontSize: 14, color: "rgba(240,244,255,0.65)" }}>{s.icon} {s.label}</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: "#f97316", background: "rgba(249,115,22,0.1)", padding: "2px 8px", borderRadius: 100 }}>{s.count}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Post CTA */}
                            {session?.user && (
                                <div className="glass-card" style={{ padding: 22, background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(249,115,22,0.06))", borderColor: "rgba(139,92,246,0.15)" }}>
                                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f4ff", marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>Hiring?</h3>
                                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: 16, lineHeight: 1.6 }}>Post your job opening or internship to the DevCircle network.</p>
                                    <Link href="/jobs/new" className="btn-primary" style={{ display: "flex", justifyContent: "center", textDecoration: "none", padding: "10px 0" }}>
                                        Post a Job
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
            <style>{`
                @media (max-width: 900px) { .jobs-layout { grid-template-columns: 1fr !important; } }
            `}</style>
        </>
    );
}
