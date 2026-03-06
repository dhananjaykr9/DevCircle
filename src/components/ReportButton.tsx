"use client";

import { useState } from "react";
import { Flag, X } from "lucide-react";
import { reportContent } from "@/lib/actions/moderation";

export default function ReportButton({ targetType, targetId, targetUrl }: { targetType: string, targetId: string, targetUrl: string }) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await reportContent(targetType, targetId, reason, targetUrl);
            setSubmitted(true);
            setTimeout(() => setOpen(false), 2000);
        } catch (error) {
            console.error("Failed to report", error);
        }
    };

    if (submitted) {
        return <span style={{ fontSize: 11, color: "#10b981", display: "flex", alignItems: "center", gap: 4 }}><Flag size={12} /> Reported</span>;
    }

    return (
        <div style={{ position: "relative" }}>
            <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
                style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 4, color: "rgba(240,244,255,0.35)", cursor: "pointer", fontSize: 12, padding: 0 }}
            >
                <Flag size={12} /> Report
            </button>

            {open && (
                <div
                    style={{ position: "absolute", bottom: "100%", right: 0, marginBottom: 8, background: "#1a1f36", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 16, width: 250, zIndex: 100, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                    onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 600, color: "#f0f4ff", margin: 0 }}>Report {targetType}</h4>
                        <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(240,244,255,0.5)", cursor: "pointer", padding: 0 }}><X size={14} /></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Why are you reporting this content?"
                            rows={3}
                            required
                            className="input"
                            style={{ width: "100%", padding: 8, fontSize: 12, marginBottom: 10, resize: "none" }}
                        />
                        <button type="submit" className="btn-primary" style={{ width: "100%", padding: "8px", fontSize: 12 }}>Submit Report</button>
                    </form>
                </div>
            )}
        </div>
    );
}
