import Link from "next/link";
import { MessageSquare, Eye, Star, Plus, Search, Filter } from "lucide-react";
import { categories } from "@/lib/data";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import UpvoteButton from "@/components/UpvoteButton";
import ReportButton from "@/components/ReportButton";
import { auth } from "../../../auth";

export const metadata = {
    title: "Discussions — DevCircle",
    description: "Join technical discussions with professionals and freshers across India. AI/ML, Cloud, Web Dev, DevOps, System Design, and more.",
};

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
}

export default async function DiscussionsPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; sort?: string }> }) {
    const session = await auth();
    const userId = session?.user?.id;
    const params = await searchParams;

    const searchQuery = params.q || "";
    const selectedCategory = params.category || "";
    const currentSort = params.sort || "latest";

    // Build Prisma where clause
    const where: any = {};
    if (searchQuery) {
        where.OR = [
            { title: { contains: searchQuery } },
            { preview: { contains: searchQuery } },
            { tags: { contains: searchQuery } },
        ];
    }
    if (selectedCategory) {
        where.category = selectedCategory;
    }

    // Build order clause
    let orderBy: any = { createdAt: "desc" };
    if (currentSort === "top") orderBy = { upvotes: { _count: "desc" } };
    if (currentSort === "unanswered") {
        where.comments = { none: {} };
        orderBy = { createdAt: "desc" };
    }

    const discussions = await prisma.post.findMany({
        where,
        orderBy,
        include: {
            author: true,
            city: true,
            _count: {
                select: {
                    comments: true,
                    upvotes: true
                }
            }
        }
    });

    // Fetch IDs of posts the current user already upvoted
    const upvotedIds = userId
        ? (await prisma.upvote.findMany({ where: { userId }, select: { postId: true } })).map(u => u.postId)
        : [];

    const totalDiscussions = await prisma.post.count();
    const totalComments = await prisma.comment.count();
    const totalUpvotes = await prisma.upvote.count();
    const totalMembers = await prisma.user.count();

    // Get real category counts from DB
    const categoryCounts = await prisma.post.groupBy({
        by: ["category"],
        _count: { _all: true },
    });
    const countMap: Record<string, number> = {};
    categoryCounts.forEach(c => { countMap[c.category] = c._count._all; });

    // Helper to build search URL preserving other params
    function buildUrl(overrides: Record<string, string>) {
        const p: Record<string, string> = {};
        if (searchQuery) p.q = searchQuery;
        if (selectedCategory) p.category = selectedCategory;
        if (currentSort && currentSort !== "latest") p.sort = currentSort;
        Object.assign(p, overrides);
        // Remove empty values
        Object.keys(p).forEach(k => { if (!p[k]) delete p[k]; });
        const qs = new URLSearchParams(p).toString();
        return `/discussions${qs ? `?${qs}` : ""}`;
    }

    return (
        <>
            {/* Header */}
            <section
                style={{ padding: "64px 0 48px", background: "rgba(13,17,32,0.5)" }}
                className="grid-bg"
            >
                <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "#3b82f6", filter: "blur(100px)", WebkitFilter: "blur(100px)", opacity: 0.1, top: -100, right: -50, zIndex: 0, pointerEvents: "none" }} />
                <div className="container" style={{ position: "relative", zIndex: 2 }}>
                    <span className="tag tag-blue fade-in-up" style={{ marginBottom: 14, display: "inline-flex" }}>Technical Forums</span>
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
                        Technical <span className="gradient-text-blue">Discussions</span>
                    </h1>
                    <p style={{ fontSize: 16, color: "rgba(240,244,255,0.45)", maxWidth: 520, lineHeight: 1.7, marginBottom: 28 }}>
                        High-signal discussions bridging the gap between experienced professionals and early-career talent. Learn and mentor locally.
                    </p>
                    {session ? (
                        <Link href="/discussions/new" className="btn-primary" style={{ display: "inline-flex" }}>
                            <Plus size={16} /> New Discussion
                        </Link>
                    ) : (
                        <Link href="/auth/login" className="btn-secondary" style={{ display: "inline-flex", textDecoration: "none" }}>
                            Sign in to join discussions
                        </Link>
                    )}
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 32 }} className="discussions-layout">

                        {/* Sidebar: Categories */}
                        <div>
                            <div className="glass-card" style={{ padding: 20, marginBottom: 16 }}>
                                <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.6)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    Categories
                                </h3>
                                <Link
                                    href={buildUrl({ category: "" })}
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "9px 12px",
                                        borderRadius: 8,
                                        marginBottom: 2,
                                        textDecoration: "none",
                                        background: !selectedCategory ? "rgba(249,115,22,0.1)" : "transparent",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    <span style={{ fontSize: 14, color: !selectedCategory ? "#f97316" : "rgba(240,244,255,0.65)", fontWeight: !selectedCategory ? 600 : 400 }}>All Categories</span>
                                    <span style={{ fontSize: 11, color: "rgba(240,244,255,0.3)", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 100 }}>
                                        {totalDiscussions}
                                    </span>
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={buildUrl({ category: cat.label })}
                                        style={{
                                            width: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            padding: "9px 12px",
                                            borderRadius: 8,
                                            marginBottom: 2,
                                            textDecoration: "none",
                                            background: selectedCategory === cat.label ? "rgba(249,115,22,0.1)" : "transparent",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: selectedCategory === cat.label ? "#f97316" : "rgba(240,244,255,0.65)", fontWeight: selectedCategory === cat.label ? 600 : 400 }}>
                                            <span>{cat.icon}</span>
                                            {cat.label}
                                        </div>
                                        <span style={{ fontSize: 11, color: "rgba(240,244,255,0.3)", background: "rgba(255,255,255,0.05)", padding: "2px 7px", borderRadius: 100 }}>
                                            {countMap[cat.label] || 0}
                                        </span>
                                    </Link>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="glass-card" style={{ padding: 20 }}>
                                <h3 style={{ fontSize: 13, fontWeight: 600, color: "rgba(240,244,255,0.6)", marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                    Community Stats
                                </h3>
                                {[
                                    { val: totalDiscussions.toLocaleString(), lbl: "Total discussions" },
                                    { val: totalComments.toLocaleString(), lbl: "Replies" },
                                    { val: totalUpvotes.toLocaleString(), lbl: "Total upvotes" },
                                    { val: totalMembers.toLocaleString(), lbl: "Active members" },
                                ].map((s) => (
                                    <div key={s.lbl} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <span style={{ fontSize: 13, color: "rgba(240,244,255,0.45)" }}>{s.lbl}</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: "#f97316" }}>{s.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Main: discussion list */}
                        <div>
                            {/* Search + Filter bar */}
                            <form action="/discussions" method="get" style={{ display: "flex", gap: 10, marginBottom: 24 }}>
                                {selectedCategory && <input type="hidden" name="category" value={selectedCategory} />}
                                {currentSort !== "latest" && <input type="hidden" name="sort" value={currentSort} />}
                                <div style={{ position: "relative", flex: 1 }}>
                                    <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,244,255,0.3)" }} />
                                    <input className="input" name="q" defaultValue={searchQuery} placeholder="Search discussions..." style={{ paddingLeft: 38 }} suppressHydrationWarning />
                                </div>
                                <button type="submit" className="btn-secondary" style={{ padding: "10px 16px", borderRadius: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                                    <Search size={14} /> Search
                                </button>
                            </form>

                            {/* Sort */}
                            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                                {[
                                    { key: "latest", label: "Latest" },
                                    { key: "top", label: "Top" },
                                    { key: "unanswered", label: "Unanswered" },
                                ].map((sort) => (
                                    <Link
                                        key={sort.key}
                                        href={buildUrl({ sort: sort.key === "latest" ? "" : sort.key })}
                                        style={{
                                            padding: "6px 14px",
                                            borderRadius: 8,
                                            border: "1px solid",
                                            fontSize: 13,
                                            fontWeight: 500,
                                            textDecoration: "none",
                                            background: currentSort === sort.key ? "rgba(249,115,22,0.15)" : "transparent",
                                            color: currentSort === sort.key ? "#f97316" : "rgba(240,244,255,0.45)",
                                            borderColor: currentSort === sort.key ? "rgba(249,115,22,0.3)" : "rgba(255,255,255,0.08)",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {sort.label}
                                    </Link>
                                ))}
                            </div>

                            {/* Discussion threads */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {discussions.map((d) => (
                                    <div
                                        key={d.id}
                                        className="glass-card"
                                        style={{
                                            padding: "20px 24px",
                                            cursor: "pointer",
                                            borderLeft: d.isPinned ? "3px solid #f97316" : "3px solid transparent",
                                        }}
                                    >
                                        <div style={{ display: "flex", gap: 18 }}>
                                            {/* Vote column */}
                                            <UpvoteButton
                                                postId={d.id}
                                                initialCount={d._count.upvotes}
                                                initialUpvoted={upvotedIds.includes(d.id)}
                                            />

                                            {/* Content */}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                                                    <span className="tag" style={{ fontSize: 11 }}>{d.category}</span>
                                                    {d.postType !== "Discussion" && (
                                                        <span style={{
                                                            fontSize: 11,
                                                            padding: "2px 8px",
                                                            borderRadius: 100,
                                                            background: d.postType === "Blog" ? "rgba(139,92,246,0.12)" : d.postType === "Tutorial" ? "rgba(16,185,129,0.12)" : "rgba(59,130,246,0.12)",
                                                            color: d.postType === "Blog" ? "#c4b5fd" : d.postType === "Tutorial" ? "#6ee7b7" : "#93c5fd",
                                                            border: `1px solid ${d.postType === "Blog" ? "rgba(139,92,246,0.2)" : d.postType === "Tutorial" ? "rgba(16,185,129,0.2)" : "rgba(59,130,246,0.2)"}`,
                                                            fontWeight: 500,
                                                        }}>{d.postType}</span>
                                                    )}
                                                    {d.isPinned && (
                                                        <span style={{ fontSize: 11, color: "#f59e0b", display: "flex", alignItems: "center", gap: 3 }}>
                                                            <Star size={10} fill="#f59e0b" /> Pinned
                                                        </span>
                                                    )}
                                                    {d.tags?.split(',').map((tag) => (
                                                        <span
                                                            key={tag}
                                                            style={{
                                                                fontSize: 11,
                                                                color: "rgba(240,244,255,0.35)",
                                                                padding: "2px 8px",
                                                                borderRadius: 100,
                                                                background: "rgba(255,255,255,0.04)",
                                                                border: "1px solid rgba(255,255,255,0.07)",
                                                            }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 8, lineHeight: 1.45 }}>{d.title}</h3>
                                                <p style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", lineHeight: 1.65, marginBottom: 14 }}>{d.preview}</p>

                                                <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                                                    {/* Author */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                                        <div
                                                            style={{
                                                                width: 24,
                                                                height: 24,
                                                                borderRadius: "50%",
                                                                background: "linear-gradient(135deg, #f97316, #ea580c)",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                                fontSize: 9,
                                                                fontWeight: 700,
                                                                color: "white",
                                                            }}
                                                        >
                                                            {d.author.name?.substring(0, 2).toUpperCase() || 'U'}
                                                        </div>
                                                        <span style={{ fontSize: 12, color: "rgba(240,244,255,0.55)" }}>{d.author.name}</span>
                                                        <span style={{ fontSize: 11, color: "rgba(240,244,255,0.25)" }}>·</span>
                                                        <span style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>{d.city.name}</span>
                                                    </div>

                                                    {/* Meta */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginLeft: "auto" }}>
                                                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(240,244,255,0.35)" }}>
                                                            <MessageSquare size={12} /> {d._count.comments}
                                                        </span>
                                                        <span style={{ fontSize: 11, color: "rgba(240,244,255,0.25)" }}>{timeAgo(d.createdAt)}</span>
                                                        <span style={{ fontSize: 11, color: "rgba(240,244,255,0.25)" }}>·</span>
                                                        <ReportButton targetType="Post" targetId={d.id} targetUrl={`/discussions`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

            <style>{`
        @media (max-width: 900px) { .discussions-layout { grid-template-columns: 1fr !important; } }
      `}</style>
        </>
    );
}
