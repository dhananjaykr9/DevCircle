import { auth } from "../../../auth";
import prisma from "@/lib/prisma";
import Footer from "@/components/Footer";
import { Shield, ShieldAlert, CheckCircle, Trash2, ExternalLink } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { resolveReport } from "@/lib/actions/moderation";

export const metadata = {
    title: "Moderation Dashboard — DevCircle",
};

export default async function ModerationPage() {
    const session = await auth();

    if (!session?.user || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
        redirect("/network");
    }

    const reports = await prisma.report.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            reporter: { select: { name: true, image: true } }
        }
    });

    const pendingCount = reports.filter(r => r.status === "Pending").length;
    const resolvedCount = reports.filter(r => r.status !== "Pending").length;

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            {/* Header section */}
            <section style={{ padding: "60px 0 40px", background: "rgba(13,17,32,0.5)", borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="grid-bg">
                <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <div className="fade-in-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", marginBottom: 16, color: "#f97316", fontSize: 13, fontWeight: 600 }}>
                            <Shield size={14} /> Mod Tools
                        </div>
                        <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 8px 0", letterSpacing: "-1px" }}>
                            Moderation Dashboard
                        </h1>
                        <p style={{ fontSize: 16, color: "rgba(240,244,255,0.5)", margin: 0, maxWidth: 600 }}>
                            Review reported content and enforce community guidelines.
                        </p>
                    </div>
                    <div style={{ display: "flex", gap: 20 }}>
                        <div className="glass-card" style={{ padding: "16px 24px", minWidth: 140 }}>
                            <div style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><ShieldAlert size={14} color="#f97316" /> Pending</div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: "#f0f4ff" }}>{pendingCount}</div>
                        </div>
                        <div className="glass-card" style={{ padding: "16px 24px", minWidth: 140 }}>
                            <div style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}><CheckCircle size={14} color="#10b981" /> Resolved</div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: "#f0f4ff" }}>{resolvedCount}</div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" style={{ flex: 1 }}>
                <div className="container" style={{ maxWidth: 1000 }}>
                    {reports.length === 0 ? (
                        <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
                            <Shield size={48} style={{ margin: "0 auto 20px", opacity: 0.3 }} color="#10b981" />
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f0f4ff", margin: "0 0 8px 0" }}>All clear!</h2>
                            <p style={{ fontSize: 15, color: "rgba(240,244,255,0.5)", margin: 0 }}>There are no reported items to review.</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {reports.map((report) => (
                                <div key={report.id} className="glass-card" style={{ padding: 24, display: "flex", gap: 24, opacity: report.status !== "Pending" ? 0.6 : 1 }}>

                                    {/* Left Status Icon */}
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: report.status === "Pending" ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        {report.status === "Pending" ? <ShieldAlert size={20} color="#f97316" /> : <CheckCircle size={20} color="rgba(240,244,255,0.3)" />}
                                    </div>

                                    {/* Content */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                            <div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                                    <span className="tag" style={{ fontSize: 11, background: "rgba(255,255,255,0.1)" }}>{report.targetType}</span>
                                                    <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>
                                                        Reported by {report.reporter.name} · {report.createdAt.toLocaleDateString()}
                                                    </span>
                                                    {report.status !== "Pending" && (
                                                        <span style={{ fontSize: 11, color: "rgba(240,244,255,0.5)", border: "1px solid rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: 100 }}>{report.status}</span>
                                                    )}
                                                </div>
                                                <h3 style={{ fontSize: 15, fontWeight: 500, color: "#f0f4ff", margin: 0, lineHeight: 1.5 }}>
                                                    "{report.reason}"
                                                </h3>
                                            </div>
                                            {report.targetUrl && (
                                                <a href={report.targetUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: "6px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                                                    View Context <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>

                                        <div style={{ fontSize: 12, color: "rgba(240,244,255,0.3)", padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: 8, marginBottom: 16 }}>
                                            ID: {report.targetId}
                                        </div>

                                        {report.status === "Pending" && (
                                            <div style={{ display: "flex", gap: 12 }}>
                                                <form action={async () => { "use server"; await resolveReport(report.id, "Dismiss"); }}>
                                                    <button type="submit" className="btn-secondary" style={{ padding: "8px 20px", fontSize: 13, background: "rgba(255,255,255,0.05)" }}>
                                                        Dismiss Report
                                                    </button>
                                                </form>
                                                <form action={async () => { "use server"; await resolveReport(report.id, "DeleteContent"); }}>
                                                    <button type="submit" className="btn-primary" style={{ padding: "8px 20px", fontSize: 13, background: "#ef4444", color: "white", display: "flex", alignItems: "center", gap: 6 }}>
                                                        <Trash2 size={14} /> Delete {report.targetType}
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
