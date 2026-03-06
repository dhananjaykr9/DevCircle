import Link from "next/link";
import { ArrowRight, Users, MessageSquare, Zap, MapPin, Code2, Rocket, Shield, Star } from "lucide-react";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";

const features = [
  {
    icon: <Shield size={22} />,
    title: "Professionals & Freshers",
    desc: "Open to experienced engineers and fresh graduates alike for a balanced collaborative environment.",
    color: "#f97316",
    glow: "rgba(249,115,22,0.18)",
  },
  {
    icon: <MapPin size={22} />,
    title: "Hyper-Local Communities",
    desc: "Connect with engineers in your own city. DevCircle automatically puts you in your local tech hub.",
    color: "#8b5cf6",
    glow: "rgba(139,92,246,0.18)",
  },
  {
    icon: <MessageSquare size={22} />,
    title: "Technical Discussion Forums",
    desc: "Organized by domain — AI/ML, Cloud, DevOps, System Design. Learn, share, and mentor locally.",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.18)",
  },
  {
    icon: <Code2 size={22} />,
    title: "Project Collaboration",
    desc: "Find co-founders, collaborators, and contributors for startups, open-source, and research.",
    color: "#10b981",
    glow: "rgba(16,185,129,0.18)",
  },
  {
    icon: <Zap size={22} />,
    title: "Local Events & Meetups",
    desc: "Hack nights, workshops, tech talks, and networking events organized within your city.",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.18)",
  },
  {
    icon: <Rocket size={22} />,
    title: "Mentorship Network",
    desc: "Senior engineers mentoring freshers and juniors in the same city. Real mentorship, not online-only.",
    color: "#ec4899",
    glow: "rgba(236,72,153,0.18)",
  },
];



const Orb = ({ color, size, top, left, right, bottom, delay = "0s" }: {
  color: string; size: number; top?: string; left?: string; right?: string; bottom?: string; delay?: string;
}) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      filter: "blur(90px)",
      WebkitFilter: "blur(90px)",
      opacity: 0.18,
      top,
      left,
      right,
      bottom,
      zIndex: 0,
      pointerEvents: "none",
      animationDelay: delay,
    }}
  />
);

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real data from Prisma
  let activeCities: any[] = [];
  let topDiscussions: any[] = [];
  let upcomingEvents: any[] = [];
  let totalCities = 0, totalMembers = 0, totalDiscussions = 0, totalEvents = 0;

  try {
    activeCities = await prisma.city.findMany({
      where: { isActive: true },
      take: 6,
      include: {
        _count: {
          select: { members: true, posts: true, events: true }
        }
      }
    });

    topDiscussions = await prisma.post.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        _count: {
          select: { comments: true, upvotes: true }
        }
      }
    });

    upcomingEvents = await prisma.event.findMany({
      take: 3,
      orderBy: { date: 'asc' },
      include: {
        city: true,
        _count: {
          select: { rsvps: true }
        }
      }
    });

    totalCities = await prisma.city.count({ where: { isActive: true } });
    totalMembers = await prisma.user.count();
    totalDiscussions = await prisma.post.count();
    totalEvents = await prisma.event.count();
  } catch {
    // Database not available during build — use defaults
  }

  const realStats = [
    { label: "Cities Active", value: totalCities.toString(), color: "#f97316" },
    { label: "Registered Members", value: totalMembers.toString(), color: "#8b5cf6" },
    { label: "Discussions", value: totalDiscussions.toString(), color: "#3b82f6" },
    { label: "Events Hosted", value: totalEvents.toString(), color: "#10b981" },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section
        style={{ minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "80px 0" }}
        className="grid-bg"
      >
        <Orb color="#f97316" size={550} top="-180px" right="-100px" />
        <Orb color="#8b5cf6" size={480} bottom="-120px" left="-80px" delay="1.5s" />
        <Orb color="#3b82f6" size={200} top="35%" left="22%" delay="0.8s" />

        {/* Floating tech badges */}
        {["Python", "React", "Kubernetes", "PyTorch", "Go", "AWS", "LLMs", "TypeScript"].map((tech, i) => (
          <div
            key={tech}
            className={i % 2 === 0 ? "animate-float" : "animate-float-delay"}
            style={{
              position: "absolute",
              zIndex: 1,
              padding: "6px 14px",
              borderRadius: 100,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              fontSize: 12,
              fontWeight: 500,
              color: "rgba(240,244,255,0.5)",
              top: `${15 + i * 10}%`,
              right: i < 4 ? `${8 + i * 7}%` : undefined,
              left: i >= 4 ? `${5 + (i - 4) * 6}%` : undefined,
              backdropFilter: "blur(8px)",
              animationDuration: `${5 + i}s`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            {tech}
          </div>
        ))}

        <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          {/* Eyebrow badge */}
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: 100,
              background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", marginBottom: 28,
              fontSize: 13, fontWeight: 500, color: "#fb923c",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#f97316", display: "inline-block", boxShadow: "0 0 8px #f97316" }} />
            Now live in {totalCities || "your"} Indian cities
          </div>

          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(40px, 7vw, 76px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-2px",
              marginBottom: 24,
              color: "#f0f4ff",
            }}
          >
            Connect, Learn, and Build
            <br />
            with the Local Tech
            <br />
            <span className="gradient-text">Community.</span>
          </h1>

          <p
            style={{ fontSize: "clamp(16px, 2.5vw, 19px)", color: "rgba(240,244,255,0.55)", maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.75 }}
          >
            DevCircle connects{" "}
            <span style={{ color: "#fb923c", fontWeight: 600 }}>professionals and freshers</span> across
            India&apos;s tech cities for local collaboration, projects, and mentorship.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth/signup" className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
              Join DevCircle <ArrowRight size={16} />
            </Link>
            <Link href="/communities" className="btn-secondary" style={{ fontSize: 16, padding: "14px 32px" }}>
              Explore Communities
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 36, justifyContent: "center", marginTop: 60, flexWrap: "wrap" }}>
            {realStats.map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif", color: s.color, lineHeight: 1, marginBottom: 6 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section" style={{ background: "rgba(13,17,32,0.6)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <span className="tag" style={{ marginBottom: 16, display: "inline-flex" }}>Platform Features</span>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, letterSpacing: "-1px", color: "#f0f4ff", marginBottom: 16 }}>
              Everything your local tech
              <br /><span className="gradient-text">community needs</span>
            </h2>
            <p style={{ color: "rgba(240,244,255,0.45)", fontSize: 17, maxWidth: 480, margin: "0 auto" }}>
              Built for professionals and early-career talent to connect, learn, and grow locally.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }} className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="glass-card" style={{ padding: 28 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: f.glow, border: `1px solid ${f.color}30`, display: "flex", alignItems: "center", justifyContent: "center", color: f.color, marginBottom: 18 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, color: "#f0f4ff", marginBottom: 10 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.45)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .features-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 580px) { .features-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ── CITIES ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="tag tag-purple" style={{ marginBottom: 12, display: "inline-flex" }}>Live Communities</span>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#f0f4ff" }}>
                Find your <span className="gradient-text-purple">city&apos;s hub</span>
              </h2>
            </div>
            <Link href="/communities" className="btn-secondary" style={{ padding: "10px 20px", fontSize: 14 }}>
              All Cities <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="cities-grid">
            {activeCities.map((city) => (
              <Link key={city.id} href={`/communities/${city.id}`} style={{ textDecoration: "none" }}>
                <div className="glass-card" style={{ padding: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 700, color: "#f0f4ff", marginBottom: 4 }}>{city.name}</h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(240,244,255,0.4)" }}>
                        <MapPin size={11} /> {city.state}
                      </div>
                    </div>
                    <span className={city.tier === "Tier-1" ? "tag tag-purple" : "tag"} style={{ fontSize: 11 }}>{city.tier}</span>
                  </div>
                  <div style={{ display: "flex", gap: 20, marginBottom: 16 }}>
                    {[{ val: city._count.members.toLocaleString(), lbl: "Members" }, { val: String(city._count.posts), lbl: "Discussions" }, { val: String(city._count.events), lbl: "Events" }].map((s) => (
                      <div key={s.lbl}>
                        <div style={{ fontWeight: 700, fontSize: 16, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif" }}>{s.val}</div>
                        <div style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>{s.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {city.tags.split(',').map((tag: string) => <span key={tag} className="tag tag-blue" style={{ fontSize: 11 }}>{tag}</span>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .cities-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 580px) { .cities-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ── RECENT DISCUSSIONS ── */}
      <section className="section" style={{ background: "rgba(13,17,32,0.6)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="tag tag-blue" style={{ marginBottom: 12, display: "inline-flex" }}>Trending Now</span>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#f0f4ff" }}>
                Top <span className="gradient-text-blue">discussions</span>
              </h2>
            </div>
            <Link href="/discussions" className="btn-secondary" style={{ padding: "10px 20px", fontSize: 14 }}>All Discussions <ArrowRight size={14} /></Link>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {topDiscussions.map((d) => (
              <Link key={d.id} href="/discussions" style={{ textDecoration: "none" }}>
                <div className="glass-card" style={{ padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 20 }}>
                  <div style={{ textAlign: "center", minWidth: 44 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#f97316", fontFamily: "'Space Grotesk', sans-serif" }}>{d._count.upvotes}</div>
                    <div style={{ fontSize: 10, color: "rgba(240,244,255,0.35)", letterSpacing: "0.05em" }}>votes</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                      <span className="tag" style={{ fontSize: 11 }}>{d.category}</span>
                      {d.isPinned && <span style={{ fontSize: 11, color: "#f59e0b", display: "flex", alignItems: "center", gap: 3 }}><Star size={10} fill="#f59e0b" /> Pinned</span>}
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 6, lineHeight: 1.4 }}>{d.title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", lineHeight: 1.6, marginBottom: 12 }}>{d.preview}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "white" }}>
                          {d.author.name?.charAt(0) || 'U'}
                        </div>
                        <span style={{ fontSize: 12, color: "rgba(240,244,255,0.5)" }}>{d.author.name}</span>
                        <span style={{ fontSize: 11, color: "rgba(240,244,255,0.25)" }}>·</span>
                        <span style={{ fontSize: 11, color: "rgba(240,244,255,0.35)" }}>Recently</span>
                      </div>
                      <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>{d._count.comments} replies</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}>
            <div>
              <span className="tag tag-green" style={{ marginBottom: 12, display: "inline-flex" }}>Upcoming</span>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 700, color: "#f0f4ff" }}>
                Local <span style={{ color: "#10b981" }}>events</span>
              </h2>
            </div>
            <Link href="/events" className="btn-secondary" style={{ padding: "10px 20px", fontSize: 14 }}>All Events <ArrowRight size={14} /></Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }} className="events-grid">
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="glass-card" style={{ padding: 22 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <span className="tag tag-green" style={{ fontSize: 11 }}>{ev.type}</span>
                  <span style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.06)" }}>{ev.fee}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff", marginBottom: 8, lineHeight: 1.4 }}>{ev.title}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
                  <span style={{ fontSize: 12, color: "#10b981", fontWeight: 500 }}>{ev.date.toLocaleDateString()} · {ev.time}</span>
                  <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} /> {ev.venue}, {ev.city.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>
                    <span style={{ color: "#f0f4ff", fontWeight: 600 }}>{ev._count.rsvps}</span> / {ev.capacity} attending
                  </div>
                  <Link href="/events" className="btn-primary" style={{ padding: "6px 14px", fontSize: 12, borderRadius: 8 }}>RSVP</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) { .events-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 580px) { .events-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>



      {/* ── CTA ── */}
      <section className="section" style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "#f97316", filter: "blur(120px)", WebkitFilter: "blur(120px)", opacity: 0.1, top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0, pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <span className="tag" style={{ marginBottom: 20, display: "inline-flex" }}>Get Started Free</span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-1.5px", color: "#f0f4ff", marginBottom: 20, lineHeight: 1.1 }}>
            Join <span className="gradient-text">DevCircle</span><br />in your city today
          </h2>
          <p style={{ fontSize: 18, color: "rgba(240,244,255,0.5)", maxWidth: 480, margin: "0 auto 36px", lineHeight: 1.7 }}>
            Connect with the brightest engineers in Nagpur, Pune, Hyderabad, and beyond. Your local tech career starts here.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/auth/signup" className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }}>Join DevCircle <ArrowRight size={16} /></Link>
            <Link href="/events" className="btn-secondary" style={{ fontSize: 16, padding: "14px 36px" }}>Browse Local Events</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
