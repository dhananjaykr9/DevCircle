import { createEvent } from "@/lib/actions/create";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Calendar, ArrowLeft } from "lucide-react";

export const metadata = { title: "Host Event — DevCircle" };

export default async function NewEventPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const cities = await prisma.city.findMany();

    return (
        <div className="form-page">
            <section className="page-header grid-bg">
                <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "#f59e0b", filter: "blur(120px)", opacity: 0.08, top: -100, right: -50, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2, maxWidth: 620 }}>
                    <div className="breadcrumb">
                        <Link href="/events"><ArrowLeft size={14} /> Events</Link>
                        <span>/</span>
                        <span>Host New</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Calendar size={22} color="#f59e0b" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px" }}>Host a Local Event</h1>
                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.45)", marginTop: 4 }}>Organize a meetup, workshop, or hack night for your city.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="form-container section" style={{ paddingTop: 40 }}>
                <div className="container" style={{ maxWidth: 620 }}>
                    <div className="glass-card" style={{ padding: 36 }}>
                        <form action={createEvent} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                            <div>
                                <label className="label">Event Title</label>
                                <input name="title" className="input" placeholder="e.g. Weekend Hack Night" required style={{ width: "100%", fontSize: 15 }} />
                            </div>
                            <div>
                                <label className="label">Description</label>
                                <textarea name="description" className="input" placeholder="What is this event about?" rows={3} required style={{ width: "100%", resize: "vertical" }}></textarea>
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Event Type</label>
                                    <select name="type" className="input" required style={{ width: "100%" }}>
                                        <option value="Hack Night">Hack Night</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Talk">Tech Talk / Panel</option>
                                        <option value="Networking">Networking</option>
                                        <option value="Contribution Sprint">Contribution Sprint</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label">City</label>
                                    <select name="cityId" className="input" required style={{ width: "100%" }}>
                                        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Date</label>
                                    <input name="date" type="date" className="input" required style={{ width: "100%", color: "#f0f4ff", colorScheme: "dark" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Time</label>
                                    <input name="time" type="time" className="input" required style={{ width: "100%", color: "#f0f4ff", colorScheme: "dark" }} />
                                </div>
                            </div>
                            <div>
                                <label className="label">Venue / Location Address</label>
                                <input name="venue" className="input" placeholder="e.g. Example Coworking Space, 1st Floor" required style={{ width: "100%" }} />
                            </div>
                            <div style={{ display: "flex", gap: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Capacity (Max RSVP)</label>
                                    <input name="capacity" type="number" className="input" placeholder="50" required style={{ width: "100%" }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label className="label">Entry Fee</label>
                                    <input name="fee" className="input" defaultValue="Free" required style={{ width: "100%" }} />
                                </div>
                            </div>
                            <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "flex-end" }}>
                                <Link href="/events" className="btn-secondary" style={{ padding: "12px 24px", textDecoration: "none" }}>Cancel</Link>
                                <button type="submit" className="btn-primary" style={{ padding: "12px 28px" }}>Host Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
