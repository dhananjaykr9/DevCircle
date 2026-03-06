import { createProject } from "@/lib/actions/create";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@/../../auth";

const prisma = new PrismaClient();

export default async function NewProjectPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const cities = await prisma.city.findMany();

    return (
        <div className="container" style={{ paddingTop: 100, paddingBottom: 60, maxWidth: 600 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f0f4ff", marginBottom: 20 }}>Post a Project</h1>
            <div className="glass-card" style={{ padding: 30 }}>
                <form action={createProject} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Project Title</label>
                        <input name="title" className="input" placeholder="e.g. Distributed Task Queue" required style={{ width: "100%" }} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Description</label>
                        <textarea name="description" className="input" placeholder="Describe the project goals and what you are building..." rows={4} required style={{ width: "100%", resize: "vertical" }}></textarea>
                    </div>

                    <div style={{ display: "flex", gap: 20 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Type</label>
                            <select name="type" className="input" required style={{ width: "100%" }}>
                                <option value="Open Source">Open Source</option>
                                <option value="Startup">Startup</option>
                                <option value="Research">Research / Labs</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>City Base</label>
                            <select name="cityId" className="input" required style={{ width: "100%" }}>
                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Tech Stack (comma-separated)</label>
                        <input name="techStack" className="input" placeholder="e.g. React, Node.js, Postgres" required style={{ width: "100%" }} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Looking For (comma-separated roles)</label>
                        <input name="lookingFor" className="input" placeholder="e.g. Frontend Eng, UI Designer" required style={{ width: "100%" }} />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: 10, alignSelf: "flex-start", padding: "12px 24px" }}>
                        Post Project
                    </button>
                </form>
            </div>
        </div>
    );
}
