import { createJob } from "@/lib/actions/jobs-polls";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";

export default async function NewJobPage() {
    const session = await auth();
    if (!session?.user) redirect("/api/auth/signin");

    const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="container" style={{ paddingTop: 100, paddingBottom: 60, maxWidth: 660 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f0f4ff", marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>Post an Opportunity</h1>
            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", marginBottom: 28 }}>Share a job opening, internship, or freelance role with the DevCircle network.</p>

            <div className="glass-card" style={{ padding: 32 }}>
                <form action={createJob} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Title + Company */}
                    <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Job Title *</label>
                            <input name="title" className="input" placeholder="e.g. Backend Engineer" required style={{ width: "100%" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Company / Organisation *</label>
                            <input name="company" className="input" placeholder="e.g. Acme Corp" required style={{ width: "100%" }} />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Description *</label>
                        <textarea name="description" className="input" placeholder="Role responsibilities, requirements, and what you're looking for..." rows={5} required style={{ width: "100%", resize: "vertical" }}></textarea>
                    </div>

                    {/* Type + Experience */}
                    <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Job Type *</label>
                            <select name="type" className="input" required style={{ width: "100%" }}>
                                <option value="Full-time">Full-time</option>
                                <option value="Internship">Internship</option>
                                <option value="Freelance">Freelance</option>
                                <option value="Contract">Contract</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Experience Required</label>
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

                    {/* Tech Stack + Salary */}
                    <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ flex: 2 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Tech Stack (comma-separated)</label>
                            <input name="techStack" className="input" placeholder="e.g. React, Node.js, PostgreSQL" style={{ width: "100%" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Salary / Stipend</label>
                            <input name="salary" className="input" placeholder="e.g. ₹8–12 LPA" style={{ width: "100%" }} />
                        </div>
                    </div>

                    {/* Apply URL + City */}
                    <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ flex: 2 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Apply URL</label>
                            <input name="applyUrl" className="input" type="url" placeholder="https://..." style={{ width: "100%" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>City *</label>
                            <select name="cityId" className="input" required style={{ width: "100%" }}>
                                {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Remote checkbox */}
                    <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#f0f4ff", cursor: "pointer" }}>
                        <input type="checkbox" name="isRemote" style={{ accentColor: "#8b5cf6", width: 16, height: 16 }} />
                        This is a remote role
                    </label>

                    <button type="submit" className="btn-primary" style={{ marginTop: 8, alignSelf: "flex-start", padding: "12px 28px" }}>
                        Post Opportunity
                    </button>
                </form>
            </div>
        </div>
    );
}
