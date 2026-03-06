import Link from "next/link";
import { MapPin, Calendar, Clock, Users, Tag, Filter, Search } from "lucide-react";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import RsvpButton from "@/components/RsvpButton";
import { auth } from "../../../auth";

export const metadata = {
    title: "Events — DevCircle",
    description: "Discover local tech events — hack nights, workshops, talks, and networking meetups in your city.",
};

const typeColors: Record<string, string> = {
    "Hack Night": "",
    "Workshop": "tag-purple",
    "Talk": "tag-blue",
    "Panel": "tag-green",
    "Contribution Sprint": "tag-green",
};

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ q?: string; city?: string }> }) {
    const session = await auth();
    const userId = session?.user?.id;
    const params = await searchParams;
    const searchQuery = params.q || "";
    const selectedCity = params.city || "";

    // Build filter
    const where: any = {};
    if (searchQuery) {
        where.OR = [
            { title: { contains: searchQuery } },
            { description: { contains: searchQuery } },
            { venue: { contains: searchQuery } },
        ];
    }
    if (selectedCity) {
        where.city = { name: selectedCity };
    }

    const events = await prisma.event.findMany({
        where,
        orderBy: { date: 'asc' },
        include: {
            organizer: true,
            city: true,
            _count: { select: { rsvps: true } }
        }
    });

    // Fetch current user's RSVPs
    const rsvpdEventIds = userId
        ? (await prisma.rsvp.findMany({ where: { userId }, select: { eventId: true } })).map(r => r.eventId)
        : [];

    // Fetch cities dynamically for filter buttons
    const cities = await prisma.city.findMany({ where: { isActive: true }, select: { name: true }, orderBy: { name: "asc" } });

    const hackNightCount = await prisma.event.count({ where: { type: "Hack Night" } });
    const workshopCount = await prisma.event.count({ where: { type: "Workshop" } });
    const talkCount = await prisma.event.count({ where: { type: "Talk" } });
    const networkingCount = await prisma.event.count({ where: { type: "Networking" } });
    const sprintCount = await prisma.event.count({ where: { type: "Contribution Sprint" } });

    function buildUrl(overrides: Record<string, string>) {
        const p: Record<string, string> = {};
        if (searchQuery) p.q = searchQuery;
        if (selectedCity) p.city = selectedCity;
        Object.assign(p, overrides);
        Object.keys(p).forEach(k => { if (!p[k]) delete p[k]; });
        const qs = new URLSearchParams(p).toString();
        return `/events${qs ? `?${qs}` : ""}`;
    }

    return (
        <>
            {/* Header */}
            <section style={{ padding: "64px 0 48px", background: "rgba(13,17,32,0.5)" }} className="grid-bg">
                <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "#f59e0b", filter: "blur(100px)", WebkitFilter: "blur(100px)", opacity: 0.1, top: -100, right: -50, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2 }}>
                    <span className="tag fade-in-up" style={{ marginBottom: 14, display: "inline-flex", background: "rgba(245,158,11,0.12)", color: "#fbbf24", borderColor: "rgba(245,158,11,0.25)" }}>
                        Local Events
                    </span>
                    <h1
                        style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "clamp(28px, 4vw, 46px)",
                            fontWeight: 800,
                            letterSpacing: "-1px",
                            color: "#f0f4ff",
                            marginBottom: 12,
                        }}
                    >
                        Events &amp; <span style={{ color: "#f59e0b" }}>Meetups</span>
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.45)", maxWidth: 520, lineHeight: 1.7, marginBottom: 28 }}>
                        Hack nights, workshops, tech talks, and networking events — all happening in your city for professionals and freshers.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32 }} className="events-layout">

                        {/* Main list */}
                        <div>
                            {/* Filters */}
                            <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
                                <form action="/events" method="get" style={{ position: "relative", flex: 1, minWidth: 180 }}>
                                    {selectedCity && <input type="hidden" name="city" value={selectedCity} />}
                                    <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,244,255,0.3)" }} />
                                    <input className="input" name="q" defaultValue={searchQuery} placeholder="Search events..." style={{ paddingLeft: 36 }} suppressHydrationWarning />
                                </form>
                                <Link
                                    href={buildUrl({ city: "" })}
                                    style={{
                                        padding: "10px 14px", borderRadius: 9, border: "1px solid", fontSize: 13,
                                        textDecoration: "none",
                                        background: !selectedCity ? "rgba(249,115,22,0.15)" : "transparent",
                                        color: !selectedCity ? "#f97316" : "rgba(240,244,255,0.5)",
                                        borderColor: !selectedCity ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.08)",
                                        fontWeight: !selectedCity ? 500 : 400,
                                    }}
                                >
                                    All Cities
                                </Link>
                                {cities.map((c) => (
                                    <Link
                                        key={c.name}
                                        href={buildUrl({ city: c.name })}
                                        style={{
                                            padding: "10px 14px", borderRadius: 9, border: "1px solid", fontSize: 13,
                                            textDecoration: "none",
                                            background: selectedCity === c.name ? "rgba(249,115,22,0.15)" : "transparent",
                                            color: selectedCity === c.name ? "#f97316" : "rgba(240,244,255,0.5)",
                                            borderColor: selectedCity === c.name ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.08)",
                                            fontWeight: selectedCity === c.name ? 500 : 400,
                                        }}
                                    >
                                        {c.name}
                                    </Link>
                                ))}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }} className="stagger">
                                {events.map((ev) => (
                                    <div key={ev.id} className="glass-card" style={{ padding: 26, display: "flex", gap: 24 }} >
                                        {/* Date block */}
                                        <div
                                            style={{
                                                minWidth: 64,
                                                height: 64,
                                                borderRadius: 14,
                                                background: "rgba(249,115,22,0.12)",
                                                border: "1px solid rgba(249,115,22,0.2)",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <div style={{ fontSize: 22, fontWeight: 800, color: "#f97316", lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
                                                {ev.date.getDate()}
                                            </div>
                                            <div style={{ fontSize: 11, color: "rgba(240,244,255,0.45)", fontWeight: 500 }}>
                                                {ev.date.toLocaleString('default', { month: 'short' }).toUpperCase()}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap", alignItems: "center" }}>
                                                <span className={`tag ${typeColors[ev.type] || ""}`} style={{ fontSize: 11 }}>{ev.type}</span>
                                                <span
                                                    style={{
                                                        fontSize: 11,
                                                        padding: "3px 9px",
                                                        borderRadius: 100,
                                                        background: ev.fee === "Free" ? "rgba(16,185,129,0.12)" : "rgba(59,130,246,0.12)",
                                                        color: ev.fee === "Free" ? "#34d399" : "#60a5fa",
                                                    }}
                                                >
                                                    {ev.fee}
                                                </span>
                                            </div>

                                            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", marginBottom: 10, lineHeight: 1.4 }}>{ev.title}</h3>
                                            <p style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", lineHeight: 1.65, marginBottom: 14 }}>{ev.description}</p>

                                            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(240,244,255,0.45)" }}>
                                                    <Clock size={12} color="#f59e0b" /> {ev.time}
                                                </span>
                                                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(240,244,255,0.45)" }}>
                                                    <MapPin size={12} color="#f97316" /> {ev.venue}
                                                </span>
                                                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "rgba(240,244,255,0.45)" }}>
                                                    <Users size={12} color="#8b5cf6" /> {ev._count.rsvps} / {ev.capacity} RSVP&apos;d
                                                </span>
                                            </div>

                                            {/* Progress bar */}
                                            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 16, overflow: "hidden" }}>
                                                <div
                                                    style={{
                                                        height: "100%",
                                                        borderRadius: 2,
                                                        background: "linear-gradient(90deg, #f97316, #fbbf24)",
                                                        width: `${(ev._count.rsvps / ev.capacity) * 100}%`,
                                                    }}
                                                />
                                            </div>

                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <span style={{ fontSize: 12, color: "rgba(240,244,255,0.35)" }}>by {ev.organizer.name}</span>
                                                {session?.user?.id === ev.organizerId ? (
                                                    <Link href={`/events/${ev.id}/manage`} className="btn-secondary" style={{ padding: "6px 14px", fontSize: 12, borderRadius: 100 }}>
                                                        Manage Attendees
                                                    </Link>
                                                ) : (
                                                    <RsvpButton
                                                        eventId={ev.id}
                                                        initialRsvpd={rsvpdEventIds.includes(ev.id)}
                                                        isFull={ev._count.rsvps >= ev.capacity}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div>
                            {/* Host an event */}
                            <div
                                className="glass-card"
                                style={{
                                    padding: 24,
                                    marginBottom: 20,
                                    background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(139,92,246,0.08))",
                                    borderColor: "rgba(249,115,22,0.15)",
                                }}
                            >
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", marginBottom: 10, fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Host a Local Event
                                </h3>
                                <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: 16, lineHeight: 1.65 }}>
                                    Organize a meetup, workshop, or hack night for your city&apos;s tech community.
                                </p>
                                <Link href="/events/new" className="btn-primary" style={{ display: "flex", width: "100%", justifyContent: "center", textDecoration: "none" }}>
                                    Submit Event
                                </Link>
                            </div>

                            {/* Event types */}
                            <div className="glass-card" style={{ padding: 22 }}>
                                <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.6)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    Event Types
                                </h3>
                                {[
                                    { type: "Hack Nights", count: hackNightCount, icon: "⚡" },
                                    { type: "Workshops", count: workshopCount, icon: "🛠️" },
                                    { type: "Tech Talks", count: talkCount, icon: "🎙️" },
                                    { type: "Networking", count: networkingCount, icon: "🤝" },
                                    { type: "Contribution Sprints", count: sprintCount, icon: "💻" },
                                ].map((t) => (
                                    <div
                                        key={t.type}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "9px 0",
                                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "rgba(240,244,255,0.65)" }}>
                                            {t.icon} {t.type}
                                        </span>
                                        <span style={{ fontSize: 12, color: "rgba(240,244,255,0.3)", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 100 }}>
                                            {t.count}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
            <style>{`
        @media (max-width: 900px) { .events-layout { grid-template-columns: 1fr !important; } }
      `}</style>
        </>
    );
}
