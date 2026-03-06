import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import OnboardingForm from "./OnboardingForm";

export const metadata = {
    title: "Welcome to DevCircle — Let's Setup Your Profile",
};

export default async function OnboardingPage() {
    const session = await auth();

    // Safety check - if no user or already onboarded, redirect to feed
    if (!session?.user) {
        redirect("/auth/login");
    }
    if ((session.user as any).onboarded) {
        redirect("/feed");
    }

    const cities = await prisma.city.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" }
    });

    return (
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(13,17,32,1)" }} className="grid-bg">
            <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "#3b82f6", filter: "blur(120px)", opacity: 0.12, top: "20%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 0, pointerEvents: "none" }} />

            <div className="glass-card" style={{ width: "100%", maxWidth: 600, padding: "40px", position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "white", fontWeight: 800, fontSize: 20 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, color: "#f0f4ff", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "-0.5px", marginBottom: 8 }}>
                        Welcome to DevCircle, {session.user.name?.split(' ')[0] || "Developer"}!
                    </h1>
                    <p style={{ color: "rgba(240,244,255,0.5)", fontSize: 14 }}>
                        Let's set up your profile to personalize your feed and discover local opportunities.
                    </p>
                </div>

                <OnboardingForm cities={cities} />
            </div>
        </main>
    );
}
