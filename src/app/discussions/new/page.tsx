import { createDiscussion } from "@/lib/actions/create";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import Footer from "@/components/Footer";
import Link from "next/link";
import { MessageSquare, ArrowLeft } from "lucide-react";

export const metadata = { title: "New Discussion — DevCircle" };

export default async function NewDiscussionPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const cities = await prisma.city.findMany();

    return (
        <div className="form-page">
            {/* Header */}
            <section className="page-header grid-bg">
                <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "#3b82f6", filter: "blur(120px)", opacity: 0.08, top: -100, right: -50, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: 640 }}>
                    <div className="breadcrumb">
                        <Link href="/discussions"><ArrowLeft size={14} /> Discussions</Link>
                        <span>/</span>
                        <span>New</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <MessageSquare size={22} color="#3b82f6" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px" }}>Start a Discussion</h1>
                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.45)", marginTop: 4 }}>Share knowledge, ask questions, or spark a debate.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="form-container section" style={{ paddingTop: 40 }}>
                <div className="container" style={{ maxWidth: 640 }}>
                    <div className="glass-card" style={{ padding: 36 }}>
                        <form action={createDiscussion} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                            <div>
                                <label className="label">Title</label>
                                <input name="title" className="input" placeholder="What's on your mind?" required style={{ width: "100%", fontSize: 15 }} />
                            </div>
                            <div>
                                <label className="label">Content</label>
                                <textarea name="content" className="input" placeholder="Detailed description..." rows={5} required style={{ width: "100%", resize: "vertical" }}></textarea>
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Post Type</label>
                                    <select name="postType" className="input" style={{ width: "100%" }}>
                                        <option value="Discussion">💬 Discussion</option>
                                        <option value="Blog">📝 Blog Post</option>
                                        <option value="Tutorial">🎓 Tutorial</option>
                                        <option value="Resource">🔗 Resource</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Category</label>
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
                            <div>
                                <label className="label">City context</label>
                                <select name="cityId" className="input" required style={{ width: "100%" }}>
                                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="label">Tags (comma-separated)</label>
                                <input name="tags" className="input" placeholder="e.g. Next.js, Tailwind, AWS" style={{ width: "100%" }} />
                            </div>
                            <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "flex-end" }}>
                                <Link href="/discussions" className="btn-secondary" style={{ padding: "12px 24px", textDecoration: "none" }}>Cancel</Link>
                                <button type="submit" className="btn-primary" style={{ padding: "12px 28px" }}>Post Discussion</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
