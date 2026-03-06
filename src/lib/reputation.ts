
import prisma from "@/lib/prisma";

// ─────────────────────────────────────────────────────────────
// Badge definitions — canonical list of all platform badges
// ─────────────────────────────────────────────────────────────
export const BADGE_CATALOG = [
    // Content badges
    { slug: "first-post", name: "First Post", description: "Published your first discussion post.", icon: "✍️", category: "Content" },
    { slug: "knowledge-sharer", name: "Knowledge Contributor", description: "Published 5 or more posts.", icon: "📚", category: "Content" },
    { slug: "top-contributor", name: "Top Contributor", description: "Reached 50+ reputation points.", icon: "⭐", category: "Content" },
    { slug: "popular-post", name: "Popular Post", description: "Got 10+ upvotes on a single post.", icon: "🔥", category: "Content" },
    // Community badges
    { slug: "community-builder", name: "Community Builder", description: "RSVP'd to 5+ events.", icon: "🏗️", category: "Community" },
    { slug: "event-organizer", name: "Event Organizer", description: "Organised 3+ community events.", icon: "🎙️", category: "Event" },
    { slug: "early-adopter", name: "Early Adopter", description: "Joined the platform in its early days.", icon: "🚀", category: "Community" },
    // Mentorship badges
    { slug: "mentor", name: "Mentor", description: "Accepted a mentorship request.", icon: "🧑‍🏫", category: "Mentorship" },
    { slug: "open-to-mentor", name: "Open to Mentoring", description: "Listed yourself as available for mentorship.", icon: "🤝", category: "Mentorship" },
    // Governance badges
    { slug: "moderator", name: "Moderator", description: "Trusted community moderator.", icon: "🛡️", category: "Community" },
    // Projects
    { slug: "collaborator", name: "Collaborator", description: "Posted an open-source or team project.", icon: "💻", category: "Community" },
];

// ─────────────────────────────────────────────────────────────
// Seed all badge definitions into DB (idempotent)
// ─────────────────────────────────────────────────────────────
export async function seedBadges() {
    for (const badge of BADGE_CATALOG) {
        await prisma.badge.upsert({
            where: { slug: badge.slug },
            create: badge,
            update: { name: badge.name, description: badge.description, icon: badge.icon, category: badge.category },
        });
    }
}

// ─────────────────────────────────────────────────────────────
// Award a badge to a user (idempotent — won't duplicate)
// ─────────────────────────────────────────────────────────────
export async function awardBadge(userId: string, slug: string) {
    const badge = await prisma.badge.findUnique({ where: { slug } });
    if (!badge) return;

    await prisma.userBadge.upsert({
        where: { userId_badgeId: { userId, badgeId: badge.id } },
        create: { userId, badgeId: badge.id },
        update: {},
    });
}

// ─────────────────────────────────────────────────────────────
// Check and award badges after any reputation-changing event
// Called after upvotes, posts, events, etc.
// ─────────────────────────────────────────────────────────────
export async function checkAndAwardBadges(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            posts: { select: { id: true, _count: { select: { upvotes: true } } } },
            events: { select: { id: true } },
            rsvps: { select: { id: true } },
        },
    });
    if (!user) return;

    const postCount = user.posts.length;
    const maxUpvotes = user.posts.reduce((max, p) => Math.max(max, p._count.upvotes), 0);
    const eventCount = user.events.length;
    const rsvpCount = user.rsvps.length;

    // Content badges
    if (postCount >= 1) await awardBadge(userId, "first-post");
    if (postCount >= 5) await awardBadge(userId, "knowledge-sharer");
    if (user.reputation >= 50) await awardBadge(userId, "top-contributor");
    if (maxUpvotes >= 10) await awardBadge(userId, "popular-post");

    // Community badges
    if (rsvpCount >= 5) await awardBadge(userId, "community-builder");
    if (eventCount >= 3) await awardBadge(userId, "event-organizer");
    if (user.openToMentoring) await awardBadge(userId, "open-to-mentor");
    if (user.role === "MODERATOR" || user.role === "ADMIN") await awardBadge(userId, "moderator");
}

// ─────────────────────────────────────────────────────────────
// Add reputation points to a user and check for auto-promotion
// ─────────────────────────────────────────────────────────────
const MODERATOR_THRESHOLD = 200;

export async function addReputation(userId: string, points: number) {
    const updated = await prisma.user.update({
        where: { id: userId },
        data: { reputation: { increment: points } },
    });

    // Auto-promote to moderator
    if (updated.role === "MEMBER" && updated.reputation >= MODERATOR_THRESHOLD) {
        await prisma.user.update({ where: { id: userId }, data: { role: "MODERATOR" } });
        await awardBadge(userId, "moderator");
    }

    await checkAndAwardBadges(userId);
}
