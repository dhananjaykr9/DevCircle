import prisma from "@/lib/prisma";
import Link from "next/link";
import Footer from "@/components/Footer";
import { Search, MapPin, Briefcase, Code, Award, SlidersHorizontal, User, Sparkles } from "lucide-react";
import { auth } from "../../../auth";

export const metadata = {
    title: "Network | DevCircle",
    description: "Connect with developers, find mentors, and collaborate on projects.",
};

export default async function NetworkPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; city?: string; level?: string; mentor?: string; collab?: string }>
}) {
    const params = await searchParams;
    const query = params.q || "";
    const cityId = params.city || "";
    const experienceLevel = params.level || "";
    const isMentor = params.mentor === "true";
    const isCollab = params.collab === "true";

    // Build Prisma Where Clause based on filters
    const whereClause: any = {};

    if (query) {
        whereClause.OR = [
            { name: { contains: query } },
            { skills: { contains: query } },
            { jobTitle: { contains: query } },
        ];
    }

    if (cityId) whereClause.cityId = cityId;
    if (experienceLevel) whereClause.experienceLevel = experienceLevel;
    if (isMentor) whereClause.openToMentoring = true;
    if (isCollab) whereClause.openToCollaborate = true;

    // Fetch filtered users
    const users = await prisma.user.findMany({
        where: whereClause,
        orderBy: { reputation: "desc" },
        include: { city: true },
        take: 50 // Limit for now
    });

    const session = await auth();
    let recommendedUsers: any[] = [];
    const isFiltered = query || cityId || experienceLevel || isMentor || isCollab;

    if (session?.user?.id && !isFiltered) {
        const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (currentUser) {
            const mySkills = currentUser.skills?.toLowerCase().split(',').map(s => s.trim()) || [];

            recommendedUsers = users
                .filter(u => u.id !== currentUser.id)
                .map(u => {
                    let score = 0;
                    if (u.cityId === currentUser.cityId) score += 2;
                    if (u.experienceLevel && u.experienceLevel === currentUser.experienceLevel) score += 1;

                    const theirSkills = u.skills?.toLowerCase().split(',').map(s => s.trim()) || [];
                    const commonSkills = mySkills.filter(s => theirSkills.includes(s));
                    score += commonSkills.length * 3;

                    return { ...u, matchScore: score };
                })
                .filter(u => u.matchScore > 2)
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, 3);
        }
    }

    const cities = await prisma.city.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" }
    });

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <header className="hero-gradient grid-bg" style={{ padding: "60px 0 40px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="container">
                    <div className="fade-in-up">
                    <h1 style={{ fontSize: 36, fontWeight: 800, color: "#f0f4ff", marginBottom: 12, fontFamily: "'Space Grotesk', sans-serif" }}>
                        Developer Network
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.6)", maxWidth: 600, lineHeight: 1.6 }}>
                        Discover and connect with professionals and freshers across the ecosystem. Find mentors, team up for projects, and build your local tech network.
                    </p>
                    </div>
                </div>
            </header>

            <main style={{ flex: 1, padding: "40px 0" }} className="section">
                <div className="container">

                    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 32 }} className="discussions-layout">

                        {/* Filters Sidebar */}
                        <div className="glass-card" style={{ padding: 24, height: "fit-content" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
                                <SlidersHorizontal size={18} color="#f97316" />
                                <h2 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff" }}>Filters</h2>
                            </div>

                            <form action="/network" method="get" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                                {/* Search */}
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(240,244,255,0.6)", marginBottom: 8 }}>Search Name or Skills</label>
                                    <div style={{ position: "relative" }}>
                                        <Search size={16} color="rgba(240,244,255,0.4)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                                        <input
                                            type="text"
                                            name="q"
                                            defaultValue={query}
                                            placeholder="e.g. React, Python, John..."
                                            className="input"
                                            style={{ paddingLeft: 36, fontSize: 14 }}
                                            suppressHydrationWarning
                                        />
                                    </div>
                                </div>

                                {/* City */}
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(240,244,255,0.6)", marginBottom: 8 }}>City</label>
                                    <select name="city" defaultValue={cityId} className="input" style={{ fontSize: 14 }} suppressHydrationWarning>
                                        <option value="">Any City</option>
                                        {cities.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "rgba(240,244,255,0.6)", marginBottom: 8 }}>Experience Level</label>
                                    <select name="level" defaultValue={experienceLevel} className="input" style={{ fontSize: 14 }} suppressHydrationWarning>
                                        <option value="">Any Experience</option>
                                        <option value="Fresher">Fresher</option>
                                        <option value="Junior Developer">Junior Developer</option>
                                        <option value="Mid-Level Engineer">Mid-Level Engineer</option>
                                        <option value="Senior Engineer">Senior Engineer</option>
                                        <option value="Architect / Tech Lead">Architect / Tech Lead</option>
                                    </select>
                                </div>

                                {/* Toggles */}
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#f0f4ff" }}>
                                        <input type="checkbox" name="mentor" value="true" defaultChecked={isMentor} style={{ accentColor: "#8b5cf6", width: 16, height: 16 }} />
                                        Open to Mentoring
                                    </label>
                                    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#f0f4ff" }}>
                                        <input type="checkbox" name="collab" value="true" defaultChecked={isCollab} style={{ accentColor: "#f97316", width: 16, height: 16 }} />
                                        Open to Collaborate
                                    </label>
                                </div>

                                <button type="submit" className="btn-primary" style={{ marginTop: 8, padding: "10px", width: "100%", justifyContent: "center" }} suppressHydrationWarning>
                                    Apply Filters
                                </button>

                                {(query || cityId || experienceLevel || isMentor || isCollab) && (
                                    <Link href="/network" style={{ textAlign: "center", fontSize: 13, color: "rgba(240,244,255,0.5)", textDecoration: "none" }}>
                                        Clear all filters
                                    </Link>
                                )}
                            </form>
                        </div>

                        {/* Members Grid */}
                        <div>
                            {recommendedUsers.length > 0 && (
                                <div style={{ marginBottom: 40 }}>
                                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f4ff", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                                        <Sparkles size={18} color="#8b5cf6" /> Recommended For You
                                    </h2>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                                        {recommendedUsers.map((u) => {
                                            const avatar = u.image || `https://ui-avatars.com/api/?name=${u.name || "U"}&background=8b5cf6&color=fff`;
                                            return (
                                                <Link href={`/members/${u.id}`} key={"rec_" + u.id} style={{ textDecoration: "none" }}>
                                                    <div className="glass-card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 16, border: "1px solid rgba(139,92,246,0.2)", background: "linear-gradient(135deg, rgba(139,92,246,0.05), rgba(139,92,246,0.02))", transition: "transform 0.2s" }}
                                                    >
                                                        <img src={avatar} alt={u.name || "User"} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                                                        <div>
                                                            <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 2 }}>{u.name || "Anonymous"}</h3>
                                                            <div style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 500, marginBottom: 4 }}>
                                                                {u.matchScore}% Match Score
                                                            </div>
                                                            <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                                {u.skills?.split(',').slice(0, 2).map((s: string) => <span key={s}>{s.trim()}</span>)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div style={{ marginBottom: 20, fontSize: 14, color: "rgba(240,244,255,0.5)", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 12 }}>
                                <span>Showing {users.length} member{users.length !== 1 ? 's' : ''}</span>
                                {isFiltered && <span style={{ color: "#f97316", fontSize: 13, fontWeight: 500 }}>Filtered Results</span>}
                            </div>

                            {users.length === 0 ? (
                                <div className="glass-card" style={{ padding: 60, textAlign: "center" }}>
                                    <User size={48} color="rgba(240,244,255,0.1)" style={{ margin: "0 auto 16px" }} />
                                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f0f4ff", marginBottom: 8 }}>No members found</h3>
                                    <p style={{ color: "rgba(240,244,255,0.5)", fontSize: 14 }}>Try adjusting your filters or search query to find more people.</p>
                                </div>
                            ) : (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                                    {users.map((u) => {
                                        const avatar = u.image || `https://ui-avatars.com/api/?name=${u.name || "U"}&background=8b5cf6&color=fff`;
                                        return (
                                            <Link href={`/members/${u.id}`} key={u.id} style={{ textDecoration: "none" }}>
                                                <div className="glass-card" style={{ padding: 20, height: "100%", display: "flex", flexDirection: "column", transition: "transform 0.2s, background 0.2s" }}
                                                >
                                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
                                                        <img src={avatar} alt={u.name || "User"} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }} />
                                                        <div>
                                                            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", marginBottom: 4 }}>{u.name || "Anonymous"}</h3>
                                                            <div style={{ fontSize: 13, color: "rgba(240,244,255,0.6)", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                                                                <Briefcase size={12} color="#f97316" /> {u.jobTitle || "Member"}
                                                            </div>
                                                            {u.city && (
                                                                <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", display: "flex", alignItems: "center", gap: 6 }}>
                                                                    <MapPin size={12} /> {u.city.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Badges Layout */}
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                                                        {u.experienceLevel && (
                                                            <span style={{ padding: "4px 8px", background: "rgba(139,92,246,0.1)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.2)", borderRadius: 100, fontSize: 11, fontWeight: 500 }}>
                                                                {u.experienceLevel}
                                                            </span>
                                                        )}
                                                        {u.openToMentoring && (
                                                            <span style={{ padding: "4px 8px", background: "rgba(16,185,129,0.1)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 100, fontSize: 11, fontWeight: 500 }}>
                                                                Mentor
                                                            </span>
                                                        )}
                                                        {u.openToCollaborate && (
                                                            <span style={{ padding: "4px 8px", background: "rgba(249,115,22,0.1)", color: "#fdba74", border: "1px solid rgba(249,115,22,0.2)", borderRadius: 100, fontSize: 11, fontWeight: 500 }}>
                                                                Collaborator
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div style={{ marginTop: "auto" }}>
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                                            {u.skills ? u.skills.split(',').slice(0, 3).map(skill => (
                                                                <span key={skill} style={{ fontSize: 11, color: "rgba(240,244,255,0.5)", background: "rgba(255,255,255,0.03)", padding: "2px 8px", borderRadius: 4 }}>
                                                                    {skill.trim()}
                                                                </span>
                                                            )) : <span style={{ fontSize: 12, color: "rgba(240,244,255,0.3)", fontStyle: "italic" }}>No skills listed</span>}
                                                            {u.skills && u.skills.split(',').length > 3 && (
                                                                <span style={{ fontSize: 11, color: "rgba(240,244,255,0.3)", padding: "2px" }}>+{u.skills.split(',').length - 3}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
