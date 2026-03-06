"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, X } from "lucide-react";

interface AvatarUploadProps {
    currentImage: string | null;
    userName: string | null;
}

export default function AvatarUpload({ currentImage, userName }: AvatarUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage);
    const [uploadedUrl, setUploadedUrl] = useState<string>(currentImage || "");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);

        // Client-side validation
        const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowed.includes(file.type)) {
            setError("Only JPEG, PNG, WebP, and GIF images are allowed.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setError("File size must be under 2 MB.");
            return;
        }

        // Show instant preview
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        // Upload
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("avatar", file);
            const res = await fetch("/api/upload/avatar", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Upload failed.");
                setPreview(currentImage);
            } else {
                setUploadedUrl(data.url);
            }
        } catch {
            setError("Upload failed. Please try again.");
            setPreview(currentImage);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        setUploadedUrl("");
        setError(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const initial = userName?.[0]?.toUpperCase() || "U";

    return (
        <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                Profile Picture
            </h3>

            {/* Hidden input to pass the URL into the form */}
            <input type="hidden" name="image" value={uploadedUrl} />

            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* Avatar preview */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                    <div
                        style={{
                            width: 88,
                            height: 88,
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "3px solid rgba(249,115,22,0.3)",
                            cursor: "pointer",
                            position: "relative",
                        }}
                        onClick={() => !uploading && fileRef.current?.click()}
                    >
                        {preview ? (
                            <img src={preview} alt={userName || "Avatar"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <div style={{
                                width: "100%", height: "100%",
                                background: "linear-gradient(135deg, #f97316, #ea580c)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 28, fontWeight: 700, color: "white",
                            }}>
                                {initial}
                            </div>
                        )}

                        {/* Hover overlay */}
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "rgba(0,0,0,0.5)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: uploading ? 1 : 0,
                            transition: "opacity 0.2s",
                            borderRadius: "50%",
                        }}>
                            {uploading ? <Loader2 size={24} color="white" className="spin" /> : <Camera size={24} color="white" />}
                        </div>
                    </div>

                    {/* Remove button */}
                    {preview && !uploading && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            style={{
                                position: "absolute", top: -4, right: -4,
                                width: 24, height: 24, borderRadius: "50%",
                                background: "#ef4444", border: "2px solid #0d0f17",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", padding: 0,
                            }}
                        >
                            <X size={12} color="white" />
                        </button>
                    )}
                </div>

                {/* Upload instructions */}
                <div style={{ flex: 1 }}>
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        style={{
                            padding: "8px 20px",
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#f0f4ff",
                            background: "rgba(249,115,22,0.15)",
                            border: "1px solid rgba(249,115,22,0.3)",
                            borderRadius: 8,
                            cursor: uploading ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            opacity: uploading ? 0.6 : 1,
                        }}
                    >
                        {uploading ? (
                            <><Loader2 size={14} /> Uploading...</>
                        ) : (
                            <><Camera size={14} /> Upload Photo</>
                        )}
                    </button>
                    <p style={{ fontSize: 11, color: "rgba(240,244,255,0.35)", marginTop: 8, lineHeight: 1.5 }}>
                        JPEG, PNG, WebP or GIF &middot; Max 2 MB<br />
                        Click the avatar or button to upload
                    </p>
                    {error && (
                        <p style={{ fontSize: 12, color: "#ef4444", marginTop: 6 }}>{error}</p>
                    )}
                </div>

                <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </div>

            {/* Spinner animation */}
            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                .spin { animation: spin 1s linear infinite; }
            `}</style>
        </div>
    );
}
