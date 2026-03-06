import Link from "next/link";
import { MapPin, Users, ExternalLink, Github } from "lucide-react";

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

export default function ProjectCard({ project, currentUserId }: { project: any, currentUserId?: string }) {
    const status = statusColors[project.status] || statusColors.Active;

    return (
        <div className="glass-card" style={{ padding: 28, display: "flex", flexDirection: "column" }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span className={`tag ${typeColors[project.type] || ""}`} style={{ fontSize: 11 }}>{project.type}</span>
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
                        {project.status}
                    </span>
                    {project.repositoryUrl && (
                        <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", color: "#f0f4ff", opacity: 0.6 }}>
                            <Github size={14} />
                        </a>
                    )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(240,244,255,0.35)", textAlign: "right" }}>
                    <MapPin size={11} /> {project.city?.name || "Global"}
                </div>
            </div>

            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 700, color: "#f0f4ff", marginBottom: 10, lineHeight: 1.35 }}>
                {project.title}
            </h3>
            <p style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", lineHeight: 1.7, marginBottom: 18 }}>{project.description}</p>

            {/* Tech stack */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {project.techStack?.split(',').map((t: string) => (
                    <span key={t} className="tag tag-blue" style={{ fontSize: 11 }}>{t.trim()}</span>
                ))}
            </div>

            {/* Looking for */}
            <div style={{ marginBottom: 20, flex: 1 }}>
                <div style={{ fontSize: 12, color: "rgba(240,244,255,0.35)", marginBottom: 7 }}>Looking for:</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {project.lookingFor?.split(',').map((r: string) => (
                        <span key={r} className="tag" style={{ fontSize: 11 }}>{r.trim()}</span>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="divider" style={{ marginBottom: 18 }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link href={`/members/${project.authorId}`} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                    {project.author?.image ? (
                        <img src={project.author.image} alt={project.author.name} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
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
                            {project.author?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                    )}
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#f0f4ff" }}>{project.author?.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>
                            <Users size={10} style={{ display: "inline", marginRight: 3 }} />
                            {project._count?.projectMembers || project.teamSize || 1} members
                        </div>
                    </div>
                </Link>
                {project.repositoryUrl ? (
                    <a href={project.repositoryUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "8px 16px", fontSize: 12, borderRadius: 9, display: "inline-flex", gap: 6, textDecoration: "none" }}>
                        View Repo <ExternalLink size={12} />
                    </a>
                ) : (
                    <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 12, borderRadius: 9, display: "inline-flex", gap: 6 }}>
                        Apply <ExternalLink size={12} />
                    </button>
                )}
            </div>
        </div>
    );
}
