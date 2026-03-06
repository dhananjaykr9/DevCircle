"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { initiateConversation } from "@/lib/actions/messages";
import { useRouter } from "next/navigation";

export default function MessageButton({ currentUserId, otherUserId }: { currentUserId: string, otherUserId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleMessage = async () => {
        setIsLoading(true);
        const res = await initiateConversation(currentUserId, otherUserId);
        if (res.success && res.conversationId) {
            router.push(`/messages/${res.conversationId}`);
        } else {
            alert(res.error || "Failed to start conversation");
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleMessage}
            disabled={isLoading}
            className="btn-primary"
            style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, display: "flex", alignItems: "center", gap: 6, width: "100%", justifyContent: "center" }}
        >
            <MessageSquare size={14} />
            {isLoading ? "Starting chat..." : "Message"}
        </button>
    );
}
