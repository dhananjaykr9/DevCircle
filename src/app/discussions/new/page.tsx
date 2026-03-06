import { createDiscussion } from "@/lib/actions/create";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";

export default async function NewDiscussionPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const cities = await prisma.city.findMany();

    return (
        <div className="container" style={{ paddingTop: 100, paddingBottom: 60, maxWidth: 620 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f0f4ff", marginBottom: 20 }}>Start a Discussion</h1>
            <div className="glass-card" style={{ padding: 30 }}>
                <form action={createDiscussion} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Title */}
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Title</label>
                        <input name="title" className="input" placeholder="What's on your mind?" required style={{ width: "100%" }} />
                    </div>

                    {/* Content */}
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Content</label>
                        <textarea name="content" className="input" placeholder="Detailed description..." rows={5} required style={{ width: "100%", resize: "vertical" }}></textarea>
                    </div>

                    {/* Post Type + Category row */}
                    <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Post Type</label>
                            <select name="postType" className="input" style={{ width: "100%" }}>
                                <option value="Discussion">💬 Discussion</option>
                                <option value="Blog">📝 Blog Post</option>
                                <option value="Tutorial">🎓 Tutorial</option>
                                <option value="Resource">🔗 Resource</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Category</label>
                            <select name="category" className="input" required style={{ width: "100%" }}>
                                <option value="Careers">Careers</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Architecture">Architecture</option>
                                <option value="AI/ML">AI/ML</option>
                                <option value="Cloud">Cloud</option>
                                <option value="DevOps">DevOps</option>
                                <option value="Cybersecurity">Cybersecurity</option>
                                <option value="Mobile">Mobile</option>
                                <option value="Open Source">Open Source</option>
                            </select>
                        </div>
                    </div>

                    {/* City */}
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>City context</label>
                        <select name="cityId" className="input" required style={{ width: "100%" }}>
                            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* Tags */}
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Tags (comma-separated)</label>
                        <input name="tags" className="input" placeholder="e.g. Next.js, Tailwind, AWS" style={{ width: "100%" }} />
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: 10, alignSelf: "flex-start", padding: "12px 28px" }}>
                        Post Discussion
                    </button>
                </form>
            </div>
        </div>
    );
}
