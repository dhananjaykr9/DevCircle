import { createJob } from "@/lib/actions/jobs-polls";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Briefcase, ArrowLeft } from "lucide-react";

export const metadata = { title: "Post Opportunity — DevCircle" };

export default async function NewJobPage() {
    const session = await auth();
    if (!session?.user) redirect("/api/auth/signin");

    const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="form-page">
            <section className="page-header grid-bg">
                <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "#8b5cf6", filter: "blur(120px)", opacity: 0.08, top: -100, right: -50, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: 660 }}>
                    <div className="breadcrumb">
                        <Link href="/jobs"><ArrowLeft size={14} /> Job Board</Link>
                        <span>/</span>
                        <span>Post New</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Briefcase size={22} color="#8b5cf6" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px" }}>Post an Opportunity</h1>
                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.45)", marginTop: 4 }}>Share a job, internship, or freelance role with DevCircle.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="form-container section" style={{ paddingTop: 40 }}>
                <div className="container" style={{ maxWidth: 660 }}>
                    <div className="glass-card" style={{ padding: 36 }}>
                        <form action={createJob} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Job Title *</label>
                                    <input name="title" className="input" placeholder="e.g. Backend Engineer" required style={{ width: "100%", fontSize: 15 }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Company / Organisation *</label>
                                    <input name="company" className="input" placeholder="e.g. Acme Corp" required style={{ width: "100%" }} />
                                </div>
                            </div>
                            <div>
                                <label className="label">Description *</label>
                                <textarea name="description" className="input" placeholder="Role responsibilities, requirements, and what you're looking for..." rows={5} required style={{ width: "100%", resize: "vertical" }}></textarea>
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Job Type *</label>
                                    <select name="type" className="input" required style={{ width: "100%" }}>
                                        <option value="Full-time">Full-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Experience Required</label>
                                    <select name="experience" className="input" style={{ width: "100%" }}>
                                        <option value="Any">Any</option>
                                        <option value="Fresher">Fresher</option>
                                        <option value="Junior Developer">Junior Developer</option>
                                        <option value="Mid-Level Engineer">Mid-Level Engineer</option>
                                        <option value="Senior Engineer">Senior Engineer</option>
                                        <option value="Architect / Tech Lead">Architect / Tech Lead</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ flex: 2 }}>
                                    <label className="label">Tech Stack (comma-separated)</label>
                                    <input name="techStack" className="input" placeholder="e.g. React, Node.js, PostgreSQL" style={{ width: "100%" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Salary / Stipend</label>
                                    <input name="salary" className="input" placeholder="e.g. ₹8–12 LPA" style={{ width: "100%" }} />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ flex: 2 }}>
                                    <label className="label">Apply URL</label>
                                    <input name="applyUrl" className="input" type="url" placeholder="https://..." style={{ width: "100%" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label">City *</label>
                                    <select name="cityId" className="input" required style={{ width: "100%" }}>
                                        {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#f0f4ff", cursor: "pointer", padding: "8px 0" }}>
                                <input type="checkbox" name="isRemote" style={{ accentColor: "#8b5cf6", width: 18, height: 18 }} />
                                This is a remote role
                            </label>
                            <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "flex-end" }}>
                                <Link href="/jobs" className="btn-secondary" style={{ padding: "12px 24px", textDecoration: "none" }}>Cancel</Link>
                                <button type="submit" className="btn-primary" style={{ padding: "12px 28px" }}>Post Opportunity</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
