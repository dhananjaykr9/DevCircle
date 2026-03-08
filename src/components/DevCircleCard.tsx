"use client";

import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface DevCircleCardProps {
    user: {
        id: string;
        name: string | null;
        image: string | null;
        jobTitle: string | null;
        city?: { name: string } | null;
        experienceLevel: string | null;
        skills: string | null;
        reputation: number;
        createdAt: Date;
    }
}

export default function DevCircleCard({ user }: DevCircleCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            await document.fonts.ready;
            await new Promise(res => setTimeout(res, 300));
            const el = cardRef.current;
            const canvas = await html2canvas(el, {
                scale: 3,
                useCORS: true,
                backgroundColor: null,
                logging: false,
                scrollX: 0,
                scrollY: 0,
                onclone: (_doc: Document, clonedEl: HTMLElement) => {
                    clonedEl.style.transform = 'none';
                    clonedEl.style.transition = 'none';
                }
            });
            const image = canvas.toDataURL("image/png", 1.0);
            const link = document.createElement("a");
            link.href = image;
            link.download = `${user.name?.replace(/\s+/g, '_') || 'dev'}_id_card.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error downloading card:", error);
            alert("Failed to download the card.");
        } finally {
            setIsDownloading(false);
        }
    };

    // User data
    const avatar = user.image || `https://ui-avatars.com/api/?name=${user.name || "U"}&background=f97316&color=fff&size=200`;
    const skillsList = user.skills ? user.skills.split(',').slice(0, 4) : [];
    const joinedYear = user.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();

    return (
        <div style={{ marginBottom: 30 }}>
            {/* Header / Download Button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f4ff", margin: 0 }}>
                    Company ID Card
                </h3>
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    style={{
                        background: "linear-gradient(135deg, #f97316, #ea580c)",
                        color: "#fff",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: isDownloading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        boxShadow: "0 4px 12px rgba(249, 115, 34, 0.3)",
                        transition: "all 0.2s"
                    }}
                >
                    <Download size={14} /> {isDownloading ? "Generating..." : "Download ID"}
                </button>
            </div>

            {/* The Badge Container (Portrait ID layout) */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                    ref={cardRef}
                    className="dev-card-portrait"
                    style={{
                        position: "relative",
                        width: 300,
                        height: 500, // Strict portrait ratio
                        boxSizing: "border-box", // Ensure padding doesn't inflate size
                        borderRadius: 20,
                        background: "#080b13", // Deep dark
                        color: "white",
                        overflow: "hidden",
                        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.8)",
                        fontFamily: "'Inter', sans-serif",
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}
                >
                    {/* Background Orbs (html2canvas compatible radial gradients) */}
                    <div style={{ position: "absolute", top: -150, right: -150, width: 400, height: 400, background: "radial-gradient(circle, rgba(249,115,22,0.6) 0%, rgba(249,115,22,0) 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />
                    <div style={{ position: "absolute", bottom: -150, left: -150, width: 350, height: 350, background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(139,92,246,0) 70%)", borderRadius: "50%", pointerEvents: "none", zIndex: 0 }} />

                    {/* Background Grid */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "20px 20px", backgroundPosition: "center", pointerEvents: "none" }} />

                    {/* TOP: Company Branding */}
                    <div style={{ padding: "20px 20px 14px", textAlign: "center", position: "relative", zIndex: 10, borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", marginBottom: 4 }}>
                            <div style={{ width: 28, height: 28, borderRadius: 8, overflow: "hidden", background: "#fff", marginRight: 8, flexShrink: 0, boxShadow: "0 4px 10px rgba(249,115,22,0.4)" }}>
                                <img src="/images/favicon-rounded.png" alt="DevCircle Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} crossOrigin="anonymous" />
                            </div>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 20, fontWeight: 800, lineHeight: "26px" }}>
                                <span style={{ color: "rgba(255,255,255,0.9)" }}>Dev</span><span style={{ color: "rgba(255,255,255,0.6)" }}>Circle</span>
                            </div>
                        </div>
                        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, lineHeight: "14px", marginTop: 4 }}>
                            Official Network ID
                        </div>
                    </div>

                    {/* PHOTO & NAME */}
                    <div style={{ textAlign: "center", padding: "14px 20px 8px", position: "relative", zIndex: 10 }}>
                        <div style={{
                            width: 80,
                            height: 80,
                            borderRadius: 18,
                            padding: 3,
                            background: "linear-gradient(135deg, #f97316, #8b5cf6)",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                            marginBottom: 12,
                            position: "relative",
                            display: "inline-block",
                        }}>
                            <div style={{ width: "100%", height: "100%", borderRadius: 14, overflow: "hidden", background: "#050505" }}>
                                <img src={avatar} alt={user.name || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                            </div>
                            {user.reputation >= 100 && (
                                <div style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", background: "#10b981", color: "#000", padding: "2px 8px", borderRadius: 100, fontSize: 9, fontWeight: 800, border: "2px solid #080b13", boxShadow: "0 2px 8px rgba(16,185,129,0.4)" }}>
                                    PRO
                                </div>
                            )}
                        </div>

                        <h2 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 6px 0", fontFamily: "'Space Grotesk', sans-serif", lineHeight: "30px" }}>
                            {user.name}
                        </h2>

                        <div style={{ fontSize: 12, lineHeight: "18px", marginBottom: 8 }}>
                            <span style={{ color: "#f97316", fontWeight: 600 }}>{user.jobTitle || 'Developer'}</span>
                            {user.city && (
                                <>
                                    <span style={{ color: "rgba(255,255,255,0.25)", margin: "0 6px" }}>{"\u2022"}</span>
                                    <span style={{ color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>{user.city.name}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* DETAILS & TAGS (Side-by-side columns) */}
                    <div style={{ padding: "0 24px 16px", display: "flex", position: "relative", zIndex: 10 }}>

                        {/* Column 1: Level */}
                        <div style={{ flex: 1, marginRight: 8, background: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8, lineHeight: "14px" }}>
                                Level
                            </div>
                            {user.experienceLevel ? (
                                <span style={{ fontSize: 10, padding: "5px 10px", background: "rgba(139,92,246,0.15)", color: "#c4b5fd", borderRadius: 6, border: "1px solid rgba(139,92,246,0.3)", fontWeight: 600, display: "inline-block" }}>
                                    {user.experienceLevel}
                                </span>
                            ) : (
                                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>None specified</span>
                            )}
                        </div>

                        {/* Column 2: Top Skills */}
                        <div style={{ flex: 1, marginLeft: 8, background: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, marginBottom: 8, lineHeight: "14px" }}>
                                Core Stack
                            </div>
                            <div style={{ textAlign: "center" }}>
                                {skillsList.length > 0 ? skillsList.slice(0, 3).map((skill: string) => (
                                    <span key={skill} style={{ fontSize: 9, padding: "3px 8px", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)", borderRadius: 6, border: "1px solid rgba(255,255,255,0.15)", fontWeight: 500, display: "inline-block", margin: 2 }}>
                                        {skill.trim()}
                                    </span>
                                )) : (
                                    <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>No skills listed</span>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* BOTTOM: Id, Rep & Scan */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#0e1320", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 10 }}>
                        <div>
                            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, marginBottom: 4, lineHeight: "12px" }}>
                                Member ID
                            </div>
                            <div style={{ fontFamily: "'Courier New', Courier, monospace", fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 700, marginBottom: 10, lineHeight: "18px" }}>
                                DC-{user.id.slice(0, 8).toUpperCase()}
                            </div>

                            <div style={{ display: "flex" }}>
                                <div style={{ marginRight: 14 }}>
                                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2, lineHeight: "12px" }}>
                                        Reputation
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 800, color: "#fbbf24", fontFamily: "'Space Grotesk', sans-serif", lineHeight: "20px" }}>
                                        ⭐ {user.reputation}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, marginBottom: 2, lineHeight: "12px" }}>
                                        Joined
                                    </div>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.8)", fontFamily: "'Space Grotesk', sans-serif", marginTop: 2, lineHeight: "18px" }}>
                                        {joinedYear}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ background: "white", padding: 5, borderRadius: 6, flexShrink: 0 }}>
                            <QRCodeCanvas
                                value={baseUrl ? `${baseUrl}/network/${user.id}` : `https://devcircle.com/network/${user.id}`}
                                size={40}
                                level="M"
                                includeMargin={false}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .dev-card-portrait {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .dev-card-portrait:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 30px 50px -15px rgba(0, 0, 0, 0.9);
                }
            `}</style>
        </div>
    );
}
