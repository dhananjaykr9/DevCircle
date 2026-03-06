"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon } from "lucide-react";
import { sendMessage } from "@/lib/actions/messages";

type Message = {
    id: string;
    text: string;
    createdAt: string | Date;
    senderId: string;
    sender: { id: string; name: string | null; image: string | null };
};

export default function ChatThread({
    initialMessages,
    conversationId,
    currentUserId,
    otherUserName,
    otherUserAvatar
}: {
    initialMessages: Message[],
    conversationId: string,
    currentUserId: string,
    otherUserName: string,
    otherUserAvatar: string | null
}) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const lastMessageDate = useRef<string | null>(
        initialMessages.length > 0
            ? new Date(initialMessages[initialMessages.length - 1].createdAt).toISOString()
            : null
    );

    // Scroll to bottom on load and when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        if (messages.length > 0) {
            lastMessageDate.current = new Date(messages[messages.length - 1].createdAt).toISOString();
        }
    }, [messages]);

    // Polling for new messages every 3 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                let url = `/api/messages/${currentUserId}?conversationId=${conversationId}`;
                if (lastMessageDate.current) {
                    url += `&after=${lastMessageDate.current}`;
                }

                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    if (data.messages && data.messages.length > 0) {
                        setMessages(prev => {
                            // Deduplicate just in case
                            const existingIds = new Set(prev.map(m => m.id));
                            const newMsgs = data.messages.filter((m: Message) => !existingIds.has(m.id));
                            return [...prev, ...newMsgs];
                        });
                    }
                }
            } catch (error) {
                console.error("Poll error:", error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [conversationId, currentUserId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;

        const text = input.trim();
        setInput("");
        setIsSending(true);

        // Optimistic UI update
        const fakeId = `temp-${Date.now()}`;
        const optimisticMsg: Message = {
            id: fakeId,
            text,
            createdAt: new Date(),
            senderId: currentUserId,
            sender: { id: currentUserId, name: "Me", image: null }
        };

        setMessages(prev => [...prev, optimisticMsg]);

        const res = await sendMessage(conversationId, currentUserId, text);

        if (res.success && res.message) {
            // Replace optimistic message with real one
            setMessages(prev => prev.map(m => m.id === fakeId ? res.message as unknown as Message : m));
        } else {
            // Rollback on fail
            setMessages(prev => prev.filter(m => m.id !== fakeId));
            alert("Failed to send message: " + (res.error || "Unknown error"));
            setInput(text); // Put text back
        }

        setIsSending(false);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "600px", background: "rgba(255,255,255,0.02)", borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.01)" }}>
                {otherUserAvatar ? (
                    <img src={otherUserAvatar} alt={otherUserName} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold" }}>
                        {otherUserName.charAt(0).toUpperCase()}
                    </div>
                )}
                <div>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: "#f0f4ff", margin: 0 }}>{otherUserName}</h2>
                    <span style={{ fontSize: 12, color: "rgba(240,244,255,0.5)" }}>Direct Message</span>
                </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                {messages.length === 0 ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(240,244,255,0.4)", fontSize: 14 }}>
                        No messages yet. Say hello! 👋
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div key={msg.id} style={{ display: "flex", gap: 10, alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                                {!isMe && (
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0, marginTop: "auto" }}>
                                        {msg.sender.image ? (
                                            <img src={msg.sender.image} alt={msg.sender.name || "User"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        ) : (
                                            <div style={{ width: "100%", height: "100%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <UserIcon size={14} color="#a78bfa" />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: isMe ? "flex-end" : "flex-start" }}>
                                    <div style={{
                                        padding: "10px 14px",
                                        borderRadius: 16,
                                        borderBottomRightRadius: isMe ? 4 : 16,
                                        borderBottomLeftRadius: !isMe ? 4 : 16,
                                        background: isMe ? "linear-gradient(135deg, #f97316, #ea580c)" : "rgba(255,255,255,0.06)",
                                        color: isMe ? "#fff" : "#f0f4ff",
                                        fontSize: 14,
                                        lineHeight: 1.5,
                                        border: isMe ? "none" : "1px solid rgba(255,255,255,0.05)"
                                    }}>
                                        {msg.text}
                                    </div>
                                    <span style={{ fontSize: 10, color: "rgba(240,244,255,0.3)" }} suppressHydrationWarning>
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)", display: "flex", gap: 10 }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    disabled={isSending}
                    suppressHydrationWarning
                    style={{
                        flex: 1,
                        background: "rgba(0,0,0,0.2)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 100,
                        padding: "12px 20px",
                        color: "#f0f4ff",
                        outline: "none",
                        fontSize: 14
                    }}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isSending}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: input.trim() && !isSending ? "#f97316" : "rgba(255,255,255,0.1)",
                        color: input.trim() && !isSending ? "white" : "rgba(255,255,255,0.3)",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: input.trim() && !isSending ? "pointer" : "not-allowed",
                        transition: "all 0.2s"
                    }}
                >
                    <Send size={18} style={{ marginLeft: 2 }} />
                </button>
            </form>
        </div>
    );
}
