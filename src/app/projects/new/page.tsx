import { createProject } from "@/lib/actions/create";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Code2, ArrowLeft } from "lucide-react";

export const metadata = { title: "New Project — DevCircle" };

export default async function NewProjectPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const cities = await prisma.city.findMany();

    return (
        <div className="form-page">
            <section className="page-header grid-bg">
                <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "#10b981", filter: "blur(120px)", opacity: 0.08, top: -100, right: -50, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: 620 }}>
                    <div className="breadcrumb">
                        <Link href="/projects"><ArrowLeft size={14} /> Projects</Link>
                        <span>/</span>
                        <span>Post New</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Code2 size={22} color="#10b981" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px" }}>Post a Project</h1>
                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.45)", marginTop: 4 }}>Find contributors and teammates for your idea.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="form-container section" style={{ paddingTop: 40 }}>
                <div className="container" style={{ maxWidth: 620 }}>
                    <div className="glass-card" style={{ padding: 36 }}>
                        <form action={createProject} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                            <div>
                                <label className="label">Project Title</label>
                                <input name="title" className="input" placeholder="e.g. Distributed Task Queue" required style={{ width: "100%", fontSize: 15 }} />
                            </div>
                            <div>
                                <label className="label">Description</label>
                                <textarea name="description" className="input" placeholder="Describe the project goals and what you are building..." rows={4} required style={{ width: "100%", resize: "vertical" }}></textarea>
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Type</label>
                                    <select name="type" className="input" required style={{ width: "100%" }}>
                                        <option value="Open Source">Open Source</option>
                                        <option value="Startup">Startup</option>
                                        <option value="Research">Research / Labs</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label">City Base</label>
                                    <select name="cityId" className="input" required style={{ width: "100%" }}>
                                        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="label">Tech Stack (comma-separated)</label>
                                <input name="techStack" className="input" placeholder="e.g. React, Node.js, Postgres" required style={{ width: "100%" }} />
                            </div>
                            <div>
                                <label className="label">Repository URL (Optional, for Open Source)</label>
                                <input type="url" name="repositoryUrl" className="input" placeholder="https://github.com/username/repo" style={{ width: "100%" }} />
                            </div>
                            <div>
                                <label className="label">Looking For (comma-separated roles)</label>
                                <input name="lookingFor" className="input" placeholder="e.g. Frontend Eng, UI Designer" required style={{ width: "100%" }} />
                            </div>
                            <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "flex-end" }}>
                                <Link href="/projects" className="btn-secondary" style={{ padding: "12px 24px", textDecoration: "none" }}>Cancel</Link>
                                <button type="submit" className="btn-primary" style={{ padding: "12px 28px" }}>Post Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
