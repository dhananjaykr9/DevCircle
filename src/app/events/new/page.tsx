import { createEvent } from "@/lib/actions/create";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "../../../../auth";

export default async function NewEventPage() {
    const session = await auth();
    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    const cities = await prisma.city.findMany();

    return (
        <div className="container" style={{ paddingTop: 100, paddingBottom: 60, maxWidth: 600 }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: "#f0f4ff", marginBottom: 20 }}>Host a Local Event</h1>
            <div className="glass-card" style={{ padding: 30 }}>
                <form action={createEvent} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Event Title</label>
                        <input name="title" className="input" placeholder="e.g. Weekend Hack Night" required style={{ width: "100%" }} />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Description</label>
                        <textarea name="description" className="input" placeholder="What is this event about?" rows={3} required style={{ width: "100%", resize: "vertical" }}></textarea>
                    </div>

                    <div style={{ display: "flex", gap: 20 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Event Type</label>
                            <select name="type" className="input" required style={{ width: "100%" }}>
                                <option value="Hack Night">Hack Night</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Talk">Tech Talk / Panel</option>
                                <option value="Networking">Networking</option>
                                <option value="Contribution Sprint">Contribution Sprint</option>
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>City</label>
                            <select name="cityId" className="input" required style={{ width: "100%" }}>
                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 20 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Date</label>
                            <input name="date" type="date" className="input" required style={{ width: "100%", color: "#f0f4ff", colorScheme: "dark" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Time</label>
                            <input name="time" type="time" className="input" required style={{ width: "100%", color: "#f0f4ff", colorScheme: "dark" }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Venue / Location Address</label>
                        <input name="venue" className="input" placeholder="e.g. Example Coworking Space, 1st Floor" required style={{ width: "100%" }} />
                    </div>

                    <div style={{ display: "flex", gap: 20 }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Capacity (Max RSVP)</label>
                            <input name="capacity" type="number" className="input" placeholder="50" required style={{ width: "100%" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: "rgba(240,244,255,0.7)" }}>Entry Fee</label>
                            <input name="fee" className="input" defaultValue="Free" required style={{ width: "100%" }} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: 10, alignSelf: "flex-start", padding: "12px 24px" }}>
                        Host Event
                    </button>
                </form>
            </div>
        </div>
    );
}
