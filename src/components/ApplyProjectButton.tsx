"use client";

import { useTransition } from "react";
import { ExternalLink, Loader } from "lucide-react";
import { applyToProject } from "@/lib/actions/projects";

export default function ApplyProjectButton({ projectId, authorId, projectTitle }: { projectId: string; authorId: string; projectTitle: string }) {
    const [isPending, startTransition] = useTransition();

    const handleApply = () => {
        startTransition(async () => {
            try {
                await applyToProject(projectId, authorId, projectTitle);
            } catch (error) {
                console.error("Failed to apply", error);
                alert("Failed to apply to project. Please try again.");
            }
        });
    };

    return (
        <button
            onClick={handleApply}
            disabled={isPending}
            className="btn-primary"
            style={{ padding: "8px 16px", fontSize: 12, borderRadius: 9, display: "inline-flex", alignItems: "center", gap: 6 }}
        >
            {isPending ? "Applying..." : "Apply"}
            {!isPending && <ExternalLink size={12} />}
        </button>
    );
}
