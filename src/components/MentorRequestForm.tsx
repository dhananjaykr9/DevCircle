"use client";

import { useState } from "react";
import { requestMentorship } from "@/lib/actions/mentorship";

interface Props {
    mentorId: string;
    mentorName: string;
}

const AREAS = [
    { value: "backend", label: "🔧 Backend Development" },
    { value: "frontend", label: "🎨 Frontend Development" },
    { value: "cloud", label: "☁️ Cloud Engineering" },
    { value: "ai-ml", label: "🤖 AI / Machine Learning" },
    { value: "devops", label: "⚙️ DevOps" },
    { value: "mobile", label: "📱 Mobile Development" },
    { value: "career", label: "🚀 Career Guidance" },
    { value: "open-source", label: "💻 Open Source" },
];

export default function MentorRequestForm({ mentorId, mentorName }: Props) {
    const [expanded, setExpanded] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [error, setError] = useState("");

    async function handleSubmit(formData: FormData) {
        setStatus("loading");
        setError("");
        try {
            await requestMentorship(formData);
            setStatus("success");
        } catch (e: any) {
            setStatus("error");
            setError(e?.message || "Something went wrong. Please try again.");
        }
    }

    if (status === "success") {
        return (
            <div style={{ fontSize: 13, color: "#34d399", fontWeight: 500, padding: "10px 14px", borderRadius: 8, background: "rgba(16,185,129,0.1)", textAlign: "center", lineHeight: 1.5 }}>
                ✓ Request sent to {mentorName.split(" ")[0]}!<br />
                <span style={{ color: "rgba(240,244,255,0.4)", fontWeight: 400, fontSize: 12 }}>They'll review your request soon.</span>
            </div>
        );
    }

    if (!expanded) {
        return (
            <button
                onClick={() => setExpanded(true)}
                className="btn-primary"
                style={{ width: "100%", padding: "10px 0", fontSize: 13 }}
            >
                Request Mentorship
            </button>
        );
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input type="hidden" name="mentorId" value={mentorId} />

            <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, color: "rgba(240,244,255,0.6)" }}>Focus Area</label>
                <select name="area" className="input" required style={{ width: "100%", fontSize: 13 }}>
                    {AREAS.map((a) => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ display: "block", marginBottom: 6, fontSize: 12, color: "rgba(240,244,255,0.6)" }}>Message</label>
                <textarea
                    name="message"
                    className="input"
                    placeholder={`Introduce yourself and tell ${mentorName.split(" ")[0]} what you're looking for...`}
                    rows={3}
                    required
                    style={{ width: "100%", fontSize: 13, resize: "vertical" }}
                />
            </div>

            {status === "error" && (
                <p style={{ fontSize: 12, color: "#f87171", margin: 0 }}>{error}</p>
            )}

            <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={status === "loading"} className="btn-primary" style={{ flex: 1, padding: "9px 0", fontSize: 13 }}>
                    {status === "loading" ? "Sending..." : "Send Request"}
                </button>
                <button type="button" onClick={() => setExpanded(false)} className="btn-secondary" style={{ padding: "9px 14px", fontSize: 13 }}>
                    Cancel
                </button>
            </div>
        </form>
    );
}
