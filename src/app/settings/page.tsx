import prisma from "@/lib/prisma";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import { User, Bell, Shield, Github, LogOut, ChevronRight, Chrome } from "lucide-react";

export const metadata = {
    title: "Settings — DevCircle",
};

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const session = await auth();
    if (!session?.user?.id) {
        redirect("/auth/login");
    }

    const params = await searchParams;
    const currentTab = params.tab || "profile";

    const accounts = await prisma.account.findMany({
        where: { userId: session.user.id }
    });

    const hasGithub = accounts.some(a => a.provider === "github");
    const hasGoogle = accounts.some(a => a.provider === "google");

    const tabs = [
        { key: "profile", label: "Profile", icon: <User size={16} color={currentTab === "profile" ? "#8b5cf6" : undefined} /> },
        { key: "notifications", label: "Notifications", icon: <Bell size={16} color={currentTab === "notifications" ? "#f59e0b" : undefined} /> },
        { key: "privacy", label: "Privacy & Security", icon: <Shield size={16} color={currentTab === "privacy" ? "#10b981" : undefined} /> },
    ];

    return (
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

            <section style={{ padding: "40px 0 24px", borderBottom: "1px solid rgba(255,255,255,0.05)" }} className="grid-bg">
                <div className="container">
                    <h1 style={{ fontSize: 32, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-1px", margin: "0 0 8px 0" }}>
                        Account Settings
                    </h1>
                    <p style={{ color: "rgba(240,244,255,0.5)", fontSize: 14, margin: 0 }}>
                        Manage your profile, preferences, and connected accounts.
                    </p>
                </div>
            </section>

            <section className="section" style={{ flex: 1 }}>
                <div className="container" style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 40 }}>

                    {/* Settings Navigation Sidebar */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {tabs.map(tab => (
                            <Link key={tab.key} href={`/settings?tab=${tab.key}`} style={{
                                padding: "10px 16px", borderRadius: 8,
                                background: currentTab === tab.key ? "rgba(255,255,255,0.05)" : "transparent",
                                color: currentTab === tab.key ? "#f0f4ff" : "rgba(240,244,255,0.5)",
                                fontSize: 13, fontWeight: currentTab === tab.key ? 600 : 500,
                                display: "flex", alignItems: "center", gap: 10,
                                textDecoration: "none", transition: "all 0.15s"
                            }}>
                                {tab.icon} {tab.label}
                            </Link>
                        ))}
                        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 0" }} />
                        <Link href="/api/auth/signout" style={{ padding: "10px 16px", borderRadius: 8, color: "#ef4444", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                            <LogOut size={16} /> Sign Out
                        </Link>
                    </div>

                    {/* Settings Content */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

                        {/* Profile Tab */}
                        {currentTab === "profile" && (
                            <>
                                <div className="glass-card" style={{ padding: 32 }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f0f4ff", margin: "0 0 8px 0" }}>Public Profile</h3>
                                    <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", margin: "0 0 24px 0" }}>Update your photo, role, and professional details.</p>

                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white" }}>
                                                {session.user.image ? <img src={session.user.image} style={{ width: '100%', height: '100%', borderRadius: "50%" }} /> : (session.user.name?.[0] || "U")}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 15, fontWeight: 600, color: "#f0f4ff" }}>{session.user.name}</div>
                                                <div style={{ fontSize: 13, color: "rgba(240,244,255,0.4)" }}>{session.user.email}</div>
                                            </div>
                                        </div>
                                        <Link href="/profile/edit" className="btn-secondary" style={{ fontSize: 13 }}>Edit Profile</Link>
                                    </div>
                                </div>

                                <div className="glass-card" style={{ padding: 32 }}>
                                    <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f0f4ff", margin: "0 0 8px 0" }}>Connected Accounts</h3>
                                    <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", margin: "0 0 24px 0" }}>Connect OAuth providers to sign in quickly or sync your avatar.</p>

                                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                        {/* GitHub */}
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                <Github size={24} color="#f0f4ff" />
                                                <div>
                                                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>GitHub</div>
                                                    <div style={{ fontSize: 12, color: hasGithub ? "#10b981" : "rgba(240,244,255,0.4)" }}>{hasGithub ? "Connected" : "Not connected"}</div>
                                                </div>
                                            </div>
                                            {!hasGithub && <Link href="/api/auth/signin/github" className="btn-secondary" style={{ fontSize: 12, padding: "6px 14px", textDecoration: "none" }}>Connect</Link>}
                                        </div>

                                        {/* Google */}
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                <Chrome size={24} color="#ea4335" />
                                                <div>
                                                    <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>Google</div>
                                                    <div style={{ fontSize: 12, color: hasGoogle ? "#10b981" : "rgba(240,244,255,0.4)" }}>{hasGoogle ? "Connected" : "Not connected"}</div>
                                                </div>
                                            </div>
                                            {!hasGoogle && <Link href="/api/auth/signin/google" className="btn-secondary" style={{ fontSize: 12, padding: "6px 14px", textDecoration: "none" }}>Connect</Link>}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Notifications Tab */}
                        {currentTab === "notifications" && (
                            <div className="glass-card" style={{ padding: 32 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f0f4ff", margin: "0 0 8px 0" }}>Notification Preferences</h3>
                                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", margin: "0 0 24px 0" }}>Choose how and when you want to be notified.</p>

                                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                    {[
                                        { label: "Discussion Replies", desc: "Get notified when someone replies to your discussion posts", defaultOn: true },
                                        { label: "Event Reminders", desc: "Receive reminders before events you\u2019ve RSVP\u2019d to", defaultOn: true },
                                        { label: "Mentorship Requests", desc: "Get notified when someone requests mentorship from you", defaultOn: true },
                                        { label: "Collaboration Invites", desc: "Receive notifications for project collaboration invites", defaultOn: true },
                                        { label: "Community Announcements", desc: "Stay updated with community-wide announcements", defaultOn: false },
                                        { label: "Job Recommendations", desc: "Get notified about jobs matching your skills", defaultOn: false },
                                    ].map(pref => (
                                        <div key={pref.label} style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12,
                                            border: "1px solid rgba(255,255,255,0.05)"
                                        }}>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>{pref.label}</div>
                                                <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>{pref.desc}</div>
                                            </div>
                                            <div style={{
                                                width: 44, height: 24, borderRadius: 12,
                                                background: pref.defaultOn ? "#8b5cf6" : "rgba(255,255,255,0.1)",
                                                position: "relative", cursor: "default", transition: "background 0.2s"
                                            }}>
                                                <div style={{
                                                    width: 18, height: 18, borderRadius: "50%",
                                                    background: "#fff", position: "absolute", top: 3,
                                                    left: pref.defaultOn ? 23 : 3, transition: "left 0.2s"
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <p style={{ fontSize: 12, color: "rgba(240,244,255,0.3)", marginTop: 20 }}>
                                    Notification preferences are saved automatically. Email notifications coming soon.
                                </p>
                            </div>
                        )}

                        {/* Privacy & Security Tab */}
                        {currentTab === "privacy" && (
                            <div className="glass-card" style={{ padding: 32 }}>
                                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#f0f4ff", margin: "0 0 8px 0" }}>Privacy & Security</h3>
                                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", margin: "0 0 24px 0" }}>Control who can see your information and activity.</p>

                                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                    {[
                                        { label: "Public Profile", desc: "Allow anyone to view your profile and activity", defaultOn: true },
                                        { label: "Show Email", desc: "Display your email address on your public profile", defaultOn: false },
                                        { label: "Show Activity", desc: "Display your discussions, projects, and event participation publicly", defaultOn: true },
                                        { label: "Allow Messages", desc: "Let other members send you direct messages", defaultOn: true },
                                        { label: "Show in Member Directory", desc: "Appear in the network/members directory for your community", defaultOn: true },
                                    ].map(pref => (
                                        <div key={pref.label} style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: 12,
                                            border: "1px solid rgba(255,255,255,0.05)"
                                        }}>
                                            <div>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: "#f0f4ff" }}>{pref.label}</div>
                                                <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>{pref.desc}</div>
                                            </div>
                                            <div style={{
                                                width: 44, height: 24, borderRadius: 12,
                                                background: pref.defaultOn ? "#10b981" : "rgba(255,255,255,0.1)",
                                                position: "relative", cursor: "default", transition: "background 0.2s"
                                            }}>
                                                <div style={{
                                                    width: 18, height: 18, borderRadius: "50%",
                                                    background: "#fff", position: "absolute", top: 3,
                                                    left: pref.defaultOn ? 23 : 3, transition: "left 0.2s"
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: 32, padding: "20px", background: "rgba(239, 68, 68, 0.05)", borderRadius: 12, border: "1px solid rgba(239, 68, 68, 0.15)" }}>
                                    <h4 style={{ fontSize: 15, fontWeight: 600, color: "#ef4444", margin: "0 0 8px 0" }}>Danger Zone</h4>
                                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", margin: "0 0 16px 0" }}>
                                        Permanently delete your account and all associated data. This action cannot be undone.
                                    </p>
                                    <button className="btn-secondary" style={{ fontSize: 12, color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.3)", cursor: "not-allowed", opacity: 0.6 }} disabled>
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
