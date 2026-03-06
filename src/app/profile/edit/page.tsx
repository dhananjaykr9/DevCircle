import prisma from "@/lib/prisma";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { updateProfile } from "@/lib/actions/profile";
import Footer from "@/components/Footer";
import AvatarUpload from "@/components/AvatarUpload";

export const metadata = {
    title: "Edit Profile | DevCircle",
};

export default async function EditProfilePage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) redirect("/");

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <main style={{ flex: 1, padding: "60px 0" }} className="section">
                <div className="container" style={{ maxWidth: 640 }}>
                    <div className="glass-card" style={{ padding: 40 }}>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f0f4ff", marginBottom: 32 }}>
                            Edit Your Profile
                        </h1>

                        <form action={updateProfile} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

                            {/* Profile Picture */}
                            <AvatarUpload currentImage={user.image} userName={user.name} />

                            {/* Basic Info */}
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Basic Information</h3>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                    <div>
                                        <label className="label">Name</label>
                                        <input type="text" name="name" className="input" defaultValue={user.name || ""} required />
                                    </div>
                                    <div>
                                        <label className="label">Experience Level</label>
                                        <select name="experienceLevel" className="input" defaultValue={user.experienceLevel || ""} required>
                                            <option value="" disabled>Select Level...</option>
                                            <option value="Fresher">Fresher (0 yrs)</option>
                                            <option value="Junior Developer">Junior Developer (1-3 yrs)</option>
                                            <option value="Mid-Level Engineer">Mid-Level Engineer (3-5 yrs)</option>
                                            <option value="Senior Engineer">Senior Engineer (5-8 yrs)</option>
                                            <option value="Architect / Tech Lead">Architect / Tech Lead (8+ yrs)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                                <div>
                                    <label className="label">Job Title / Role</label>
                                    <input type="text" name="jobTitle" className="input" defaultValue={user.jobTitle || ""} placeholder="e.g. Frontend Engineer" />
                                </div>
                                <div>
                                    <label className="label">Company / Organization</label>
                                    <input type="text" name="company" className="input" defaultValue={user.company || ""} placeholder="e.g. Infosys" />
                                </div>
                            </div>

                            <div>
                                <label className="label">Bio</label>
                                <textarea name="bio" className="input" rows={4} defaultValue={user.bio || ""} placeholder="Tell the community about yourself..."></textarea>
                            </div>

                            <div>
                                <label className="label">Technical Skills</label>
                                <input type="text" name="skills" className="input" defaultValue={user.skills || ""} placeholder="e.g. React, Python, AWS (comma separated)" />
                            </div>

                            {/* Links */}
                            <div style={{ marginTop: 12 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Web & Social Links</h3>

                                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                    <div>
                                        <label className="label">GitHub URL</label>
                                        <input type="url" name="github" className="input" defaultValue={user.github || ""} placeholder="https://github.com/username" />
                                    </div>
                                    <div>
                                        <label className="label">Portfolio / Personal Website</label>
                                        <input type="url" name="portfolioUrl" className="input" defaultValue={user.portfolioUrl || ""} placeholder="https://yourwebsite.com" />
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div style={{ marginTop: 12 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>Community Preferences</h3>

                                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <input type="checkbox" name="openToMentoring" defaultChecked={user.openToMentoring} style={{ width: 18, height: 18, accentColor: "#8b5cf6" }} />
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 500, color: "#f0f4ff", marginBottom: 2 }}>Open to Mentoring</div>
                                            <div style={{ fontSize: 13, color: "rgba(240,244,255,0.5)" }}>I am willing to mentor freshers and junior developers.</div>
                                        </div>
                                    </label>

                                    <label style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
                                        <input type="checkbox" name="openToCollaborate" defaultChecked={user.openToCollaborate} style={{ width: 18, height: 18, accentColor: "#f97316" }} />
                                        <div>
                                            <div style={{ fontSize: 14, fontWeight: 500, color: "#f0f4ff", marginBottom: 2 }}>Open to Collaborate</div>
                                            <div style={{ fontSize: 13, color: "rgba(240,244,255,0.5)" }}>I am open to teaming up for open-source projects or startups.</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: 16, marginTop: 24, justifyContent: "flex-end" }}>
                                <a href="/profile" className="btn-secondary" style={{ padding: "12px 24px", textDecoration: "none" }}>Cancel</a>
                                <button type="submit" className="btn-primary" style={{ padding: "12px 32px" }}>Save Profile</button>
                            </div>
                        </form>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
