import { auth } from "../../../../../auth";
import prisma from "@/lib/prisma";
import Footer from "@/components/Footer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Mail, MapPin, Calendar, Clock } from "lucide-react";

export const metadata = {
    title: "Manage Event — DevCircle",
};

export default async function ManageEventPage({ params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user?.id) redirect("/events");

    const event = await prisma.event.findUnique({
        where: { id: params.id },
        include: {
            rsvps: {
                include: { user: true },
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!event) redirect("/events");
    if (event.organizerId !== session.user.id) redirect("/events"); // Only organizer can access

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            <section style={{ padding: "40px 0 60px", background: "rgba(13,17,32,0.5)", borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="grid-bg">
                <div className="container">
                    <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(240,244,255,0.4)", textDecoration: "none", fontSize: 14, marginBottom: 20 }}>
                        <ArrowLeft size={16} /> Back to Events
                    </Link>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
                        <div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 100, background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)", marginBottom: 16, color: "#f97316", fontSize: 13, fontWeight: 600 }}>
                                <Users size={14} /> Organizer Tools
                            </div>
                            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
                                {event.title}
                            </h1>
                            <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "rgba(240,244,255,0.5)" }}>
                                    <Calendar size={14} color="#f59e0b" /> {event.date.toLocaleDateString()}
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "rgba(240,244,255,0.5)" }}>
                                    <Clock size={14} color="#f97316" /> {event.time}
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "rgba(240,244,255,0.5)" }}>
                                    <MapPin size={14} color="#8b5cf6" /> {event.venue}
                                </span>
                            </div>
                        </div>

                        <div className="glass-card" style={{ padding: "16px 24px", minWidth: 160, display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: 4 }}>RSVPs</div>
                            <div style={{ fontSize: 28, fontWeight: 700, color: "#10b981", display: "flex", alignItems: "baseline", gap: 4 }}>
                                {event.rsvps.length} <span style={{ fontSize: 14, color: "rgba(240,244,255,0.3)" }}>/ {event.capacity}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" style={{ flex: 1 }}>
                <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 30, alignItems: "start" }}>

                    {/* Attendee List */}
                    <div>
                        <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f0f4ff", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                            <Users size={18} color="#8b5cf6" /> Attendee List
                        </h2>

                        {event.rsvps.length === 0 ? (
                            <div className="glass-card" style={{ padding: 40, textAlign: "center" }}>
                                <Users size={40} style={{ margin: "0 auto 16px", opacity: 0.2 }} color="#f0f4ff" />
                                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", margin: 0 }}>No one has RSVP'd yet.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {event.rsvps.map((rsvp) => (
                                    <div key={rsvp.id} className="glass-card" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white" }}>
                                                {rsvp.user.name?.substring(0, 2).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", margin: "0 0 4px 0" }}>{rsvp.user.name}</h4>
                                                <p style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", margin: 0 }}>
                                                    {rsvp.user.jobTitle || rsvp.user.experienceLevel || "Member"}
                                                </p>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: 11, color: "rgba(240,244,255,0.3)", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 100 }}>
                                            RSVP'd on {rsvp.createdAt.toLocaleDateString()}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Announcement Tool */}
                    <div style={{ position: "sticky", top: 100 }}>
                        <div className="glass-card" style={{ padding: 24 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                <Mail size={16} color="#f97316" /> Announce Update
                            </h3>
                            <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: 20, lineHeight: 1.5 }}>
                                Send an email update to all attendees. Use this for venue changes, reminders, or post-event wrap-ups.
                            </p>

                            <form style={{ display: "flex", flexDirection: "column", gap: 12 }} action={async () => { "use server"; /* Mock send */ }}>
                                <input className="input" placeholder="Subject" style={{ fontSize: 13 }} disabled />
                                <textarea className="input" placeholder="Message content..." rows={6} style={{ fontSize: 13, resize: "none" }} disabled />
                                <button type="button" className="btn-primary" disabled style={{ opacity: 0.5, cursor: "not-allowed", display: "flex", justifyContent: "center" }}>
                                    Send to {event.rsvps.length} attendees
                                </button>
                                <span style={{ fontSize: 11, color: "rgba(240,244,255,0.3)", textAlign: "center", marginTop: 4 }}>
                                    (Email delivery is simulated in MVP)
                                </span>
                            </form>
                        </div>
                    </div>

                </div>
            </section>

            <Footer />
        </main>
    );
}
