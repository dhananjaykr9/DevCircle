import { createPoll } from "@/lib/actions/jobs-polls";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";

export default async function NewPollPage() {
    const session = await auth();
    if (!session?.user) redirect("/api/auth/signin");

    const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });

    return (
        <div className="container" style={{ paddingTop: 100, paddingBottom: 60, maxWidth: 600 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f0f4ff", marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>Create a Poll</h1>
            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", marginBottom: 28 }}>Ask your community a question and collect votes.</p>

            <div className="glass-card" style={{ padding: 30 }}>
                <form action={createPoll} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                    {/* Question */}
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Question *</label>
                        <input name="question" className="input" placeholder="What should we focus on next?" required style={{ width: "100%" }} />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Description (optional)</label>
                        <textarea name="description" className="input" placeholder="Add context or details about the poll..." rows={3} style={{ width: "100%", resize: "vertical" }}></textarea>
                    </div>

                    {/* Options */}
                    <div>
                        <label style={{ display: "block", marginBottom: 12, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Options * (minimum 2, max 6)</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <span style={{ fontSize: 13, color: "rgba(240,244,255,0.3)", minWidth: 20, textAlign: "center" }}>{i}</span>
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

                    {/* City + Ends At */}
                    <div style={{ display: "flex", gap: 16 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>City Context *</label>
                            <select name="cityId" className="input" required style={{ width: "100%" }}>
                                {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Poll End Date (optional)</label>
                            <input name="endsAt" type="date" className="input" style={{ width: "100%" }} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: 8, alignSelf: "flex-start", padding: "12px 28px" }}>
                        Create Poll
                    </button>
                </form>
            </div>
        </div>
    );
}
