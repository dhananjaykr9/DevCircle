"use client";

import { useState } from "react";
import { completeOnboarding } from "@/lib/actions/onboarding";
import { MapPin, Briefcase, Code, Sparkles, ArrowRight, ArrowLeft, Check, Search } from "lucide-react";
import { useSession } from "next-auth/react";

const SKILL_OPTIONS = [
    "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#",
    "React", "Next.js", "Vue", "Angular", "Svelte", "Node.js", "Express",
    "Django", "Flask", "Spring Boot", "FastAPI", ".NET",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Terraform",
    "PostgreSQL", "MongoDB", "Redis", "MySQL", "Firebase",
    "TensorFlow", "PyTorch", "LangChain", "OpenAI", "Hugging Face",
    "Git", "Linux", "GraphQL", "REST API", "gRPC",
    "Figma", "Tailwind CSS", "Flutter", "React Native", "Swift",
];

const INTEREST_OPTIONS = [
    "AI / Machine Learning", "Generative AI / LLMs", "Web Development", "Mobile Development",
    "Cloud & DevOps", "Cybersecurity", "Blockchain / Web3", "Data Science",
    "System Design", "Open Source", "Startups", "Freelancing",
    "Competitive Programming", "IoT & Embedded", "Game Development",
    "AR / VR", "Quantum Computing", "Low-Code / No-Code",
    "Tech Leadership", "Developer Advocacy",
];

const EXPERIENCE_LEVELS = [
    { value: "Fresher", label: "Fresher", desc: "0-1 year", emoji: "🌱" },
    { value: "Junior Developer", label: "Junior", desc: "1-3 years", emoji: "💻" },
    { value: "Mid-Level Engineer", label: "Mid-Level", desc: "3-5 years", emoji: "⚡" },
    { value: "Senior Engineer", label: "Senior", desc: "5-8 years", emoji: "🚀" },
    { value: "Architect / Tech Lead", label: "Tech Lead", desc: "8+ years", emoji: "🏗️" },
];

const STEPS = [
    { title: "Your Local Hub", subtitle: "Connect with developers in your city", icon: <MapPin size={20} /> },
    { title: "Experience Level", subtitle: "Help us match you with the right people", icon: <Briefcase size={20} /> },
    { title: "Tech Stack", subtitle: "Select your top technologies", icon: <Code size={20} /> },
    { title: "Interests", subtitle: "What excites you?", icon: <Sparkles size={20} /> },
];

export default function OnboardingForm({ cities }: { cities: any[] }) {
    const [step, setStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cityId, setCityId] = useState("");
    const [citySearch, setCitySearch] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [skillSearch, setSkillSearch] = useState("");
    const { update } = useSession();

    const filteredCities = cities.filter(c =>
        c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
        c.state.toLowerCase().includes(citySearch.toLowerCase())
    ).sort((a: any, b: any) => (b.isActive ? 1 : 0) - (a.isActive ? 1 : 0));

    const filteredSkills = SKILL_OPTIONS.filter(s =>
        s.toLowerCase().includes(skillSearch.toLowerCase())
    );

    function toggleSkill(skill: string) {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    }

    function toggleInterest(interest: string) {
        setSelectedInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    }

    function canProceed() {
        switch (step) {
            case 0: return !!cityId;
            case 1: return !!experienceLevel;
            case 2: return selectedSkills.length >= 1;
            case 3: return selectedInterests.length >= 1;
            default: return false;
        }
    }

    async function handleComplete() {
        setIsLoading(true);
        setError(null);

        const formData = new FormData();
        formData.set("cityId", cityId);
        formData.set("experienceLevel", experienceLevel);
        formData.set("skills", selectedSkills.join(", "));
        formData.set("interests", selectedInterests.join(", "));

        const res = await completeOnboarding(formData);
        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
            return;
        }

        // Trigger session update to refresh the JWT token with onboarded=true
        await update();

        // Redirect to feed
        window.location.href = "/feed";
    }

    return (
        <div>
            {/* Progress bar */}
            <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
                {STEPS.map((_, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1,
                            height: 4,
                            borderRadius: 4,
                            background: i <= step ? "linear-gradient(135deg, #3b82f6, #8b5cf6)" : "rgba(255,255,255,0.08)",
                            transition: "all 0.4s ease",
                        }}
                    />
                ))}
            </div>

            {/* Step header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "rgba(59,130,246,0.15)", color: "#3b82f6",
                    display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    {STEPS[step].icon}
                </div>
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f0f4ff", margin: 0, fontFamily: "'Space Grotesk', sans-serif" }}>
                        {STEPS[step].title}
                    </h2>
                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.45)", margin: 0 }}>
                        {STEPS[step].subtitle}
                    </p>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 13, color: "rgba(240,244,255,0.3)" }}>
                    {step + 1}/{STEPS.length}
                </div>
            </div>

            {error && (
                <div style={{ padding: "12px 16px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 8, color: "#f87171", fontSize: 13, textAlign: "center", marginBottom: 20 }}>
                    {error}
                </div>
            )}

            {/* Step 0: City */}
            {step === 0 && (
                <div>
                    <div style={{ position: "relative", marginBottom: 16 }}>
                        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,244,255,0.3)" }} />
                        <input
                            className="input"
                            placeholder="Search cities..."
                            value={citySearch}
                            onChange={e => setCitySearch(e.target.value)}
                            style={{ paddingLeft: 38, width: "100%" }}
                        />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, maxHeight: 280, overflowY: "auto", paddingRight: 4 }}>
                        {filteredCities.map(city => {
                            const isActive = city.isActive;
                            return (
                            <button
                                key={city.id}
                                type="button"
                                onClick={() => setCityId(city.id)}
                                style={{
                                    padding: "14px 16px",
                                    borderRadius: 12,
                                    border: "1px solid",
                                    borderColor: cityId === city.id ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.08)",
                                    background: cityId === city.id ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.02)",
                                    color: cityId === city.id ? "#60a5fa" : "rgba(240,244,255,0.7)",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    transition: "all 0.2s",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    position: "relative",
                                }}
                            >
                                <MapPin size={14} style={{ opacity: 0.5 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                                        {city.name}
                                        {isActive ? (
                                            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "rgba(16,185,129,0.12)", color: "#10b981", border: "1px solid rgba(16,185,129,0.2)" }}>Live</span>
                                        ) : (
                                            <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 4, background: "rgba(139,92,246,0.12)", color: "#a78bfa", border: "1px solid rgba(139,92,246,0.2)" }}>Waitlist</span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 11, color: "rgba(240,244,255,0.35)", marginTop: 2 }}>{city.state}</div>
                                </div>
                                {cityId === city.id && (
                                    <Check size={16} style={{ marginLeft: "auto", color: "#3b82f6" }} />
                                )}
                            </button>
                            );
                        })}
                    </div>
                    {filteredCities.length === 0 && (
                        <p style={{ textAlign: "center", color: "rgba(240,244,255,0.35)", fontSize: 13, padding: 20 }}>
                            No cities found. Try a different search.
                        </p>
                    )}
                </div>
            )}

            {/* Step 1: Experience Level */}
            {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {EXPERIENCE_LEVELS.map(level => (
                        <button
                            key={level.value}
                            type="button"
                            onClick={() => setExperienceLevel(level.value)}
                            style={{
                                padding: "16px 20px",
                                borderRadius: 12,
                                border: "1px solid",
                                borderColor: experienceLevel === level.value ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.08)",
                                background: experienceLevel === level.value ? "rgba(59,130,246,0.12)" : "rgba(255,255,255,0.02)",
                                color: experienceLevel === level.value ? "#60a5fa" : "rgba(240,244,255,0.7)",
                                cursor: "pointer",
                                textAlign: "left",
                                transition: "all 0.2s",
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                            }}
                        >
                            <span style={{ fontSize: 24 }}>{level.emoji}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 600, fontSize: 15 }}>{level.label}</div>
                                <div style={{ fontSize: 12, color: "rgba(240,244,255,0.35)", marginTop: 2 }}>{level.desc}</div>
                            </div>
                            {experienceLevel === level.value && (
                                <Check size={18} style={{ color: "#3b82f6" }} />
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
                <div>
                    <div style={{ position: "relative", marginBottom: 12 }}>
                        <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(240,244,255,0.3)" }} />
                        <input
                            className="input"
                            placeholder="Search technologies..."
                            value={skillSearch}
                            onChange={e => setSkillSearch(e.target.value)}
                            style={{ paddingLeft: 38, width: "100%" }}
                        />
                    </div>

                    {selectedSkills.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12, padding: "10px 12px", background: "rgba(59,130,246,0.06)", borderRadius: 10, border: "1px solid rgba(59,130,246,0.15)" }}>
                            {selectedSkills.map(skill => (
                                <span
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    style={{
                                        padding: "4px 10px",
                                        borderRadius: 6,
                                        background: "rgba(59,130,246,0.2)",
                                        color: "#60a5fa",
                                        fontSize: 12,
                                        fontWeight: 500,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                    }}
                                >
                                    {skill} ×
                                </span>
                            ))}
                        </div>
                    )}

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                        {filteredSkills.map(skill => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => toggleSkill(skill)}
                                style={{
                                    padding: "8px 14px",
                                    borderRadius: 8,
                                    border: "1px solid",
                                    borderColor: selectedSkills.includes(skill) ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)",
                                    background: selectedSkills.includes(skill) ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.02)",
                                    color: selectedSkills.includes(skill) ? "#60a5fa" : "rgba(240,244,255,0.6)",
                                    cursor: "pointer",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    transition: "all 0.15s",
                                }}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>

                    <p style={{ fontSize: 12, color: "rgba(240,244,255,0.3)", marginTop: 12 }}>
                        {selectedSkills.length} selected — pick at least 1
                    </p>
                </div>
            )}

            {/* Step 3: Interests */}
            {step === 3 && (
                <div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                        {INTEREST_OPTIONS.map(interest => (
                            <button
                                key={interest}
                                type="button"
                                onClick={() => toggleInterest(interest)}
                                style={{
                                    padding: "10px 18px",
                                    borderRadius: 10,
                                    border: "1px solid",
                                    borderColor: selectedInterests.includes(interest) ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)",
                                    background: selectedInterests.includes(interest) ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.02)",
                                    color: selectedInterests.includes(interest) ? "#a78bfa" : "rgba(240,244,255,0.6)",
                                    cursor: "pointer",
                                    fontSize: 13,
                                    fontWeight: 500,
                                    transition: "all 0.15s",
                                }}
                            >
                                {selectedInterests.includes(interest) ? "✓ " : ""}{interest}
                            </button>
                        ))}
                    </div>

                    <p style={{ fontSize: 12, color: "rgba(240,244,255,0.3)", marginTop: 16 }}>
                        {selectedInterests.length} selected — pick at least 1
                    </p>
                </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                {step > 0 && (
                    <button
                        type="button"
                        onClick={() => setStep(s => s - 1)}
                        className="btn-secondary"
                        style={{ flex: 1, justifyContent: "center", padding: 12 }}
                    >
                        <ArrowLeft size={16} /> Back
                    </button>
                )}
                {step < STEPS.length - 1 ? (
                    <button
                        type="button"
                        onClick={() => { setError(null); setStep(s => s + 1); }}
                        disabled={!canProceed()}
                        className="btn-primary"
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            padding: 12,
                            background: canProceed() ? "linear-gradient(135deg, #3b82f6, #2563eb)" : "rgba(255,255,255,0.05)",
                            border: "none",
                            opacity: canProceed() ? 1 : 0.5,
                            cursor: canProceed() ? "pointer" : "not-allowed",
                        }}
                    >
                        Continue <ArrowRight size={16} />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleComplete}
                        disabled={!canProceed() || isLoading}
                        className="btn-primary"
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            padding: 12,
                            background: canProceed() ? "linear-gradient(135deg, #10b981, #059669)" : "rgba(255,255,255,0.05)",
                            border: "none",
                            opacity: canProceed() ? 1 : 0.5,
                            cursor: canProceed() ? "pointer" : "not-allowed",
                        }}
                    >
                        {isLoading ? "Setting up..." : "Complete Setup"} <Check size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}
