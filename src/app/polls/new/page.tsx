import { createPoll } from "@/lib/actions/jobs-polls";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import Footer from "@/components/Footer";
import Link from "next/link";
import { BarChart3, ArrowLeft } from "lucide-react";

export const metadata = { title: "Create Poll — DevCircle" };

export default async function NewPollPage() {
    const session = await auth();
    if (!session?.user) redirect("/api/auth/signin");

    const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="form-page">
            <section className="page-header grid-bg">
                <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "#ec4899", filter: "blur(120px)", opacity: 0.08, top: -100, right: -50, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: 600 }}>
                    <div className="breadcrumb">
                        <Link href="/polls"><ArrowLeft size={14} /> Polls</Link>
                        <span>/</span>
                        <span>Create New</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <BarChart3 size={22} color="#ec4899" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px" }}>Create a Poll</h1>
                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.45)", marginTop: 4 }}>Ask your community a question and collect votes.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="form-container section" style={{ paddingTop: 40 }}>
                <div className="container" style={{ maxWidth: 600 }}>
                    <div className="glass-card" style={{ padding: 36 }}>
                        <form action={createPoll} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                            <div>
                                <label className="label">Question *</label>
                                <input name="question" className="input" placeholder="What should we focus on next?" required style={{ width: "100%", fontSize: 15 }} />
                            </div>
                            <div>
                                <label className="label">Description (optional)</label>
                                <textarea name="description" className="input" placeholder="Add context or details about the poll..." rows={3} style={{ width: "100%", resize: "vertical" }}></textarea>
                            </div>
                            <div>
                                <label className="label" style={{ marginBottom: 12 }}>Options * (minimum 2, max 6)</label>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: i <= 2 ? "rgba(236,72,153,0.6)" : "rgba(240,244,255,0.2)", minWidth: 24, height: 24, borderRadius: 8, background: i <= 2 ? "rgba(236,72,153,0.08)" : "rgba(240,244,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>{i}</span>
                                            <input
                                                name={`option${i}`}
                                                className="input"
                                                placeholder={i <= 2 ? `Option ${i} *` : `Option ${i} (optional)`}
                                                required={i <= 2}
                                                style={{ flex: 1 }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="label">City Context *</label>
                                    <select name="cityId" className="input" required style={{ width: "100%" }}>
                                        {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Poll End Date (optional)</label>
                                    <input name="endsAt" type="date" className="input" style={{ width: "100%", color: "#f0f4ff", colorScheme: "dark" }} />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "flex-end" }}>
                                <Link href="/polls" className="btn-secondary" style={{ padding: "12px 24px", textDecoration: "none" }}>Cancel</Link>
                                <button type="submit" className="btn-primary" style={{ padding: "12px 28px" }}>Create Poll</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
