
import * as Speech from "expo-speech";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const MODES: any = {
  dyslexia: {
    label: "Dyslexia Mode", emoji: "📖",
    bg: "#1a1a2e", card: "#16213e", accent: "#e94560",
    text: "#f5f0e8", secondary: "#a8a0c0", color: "#ff6b9d",
    fontSize: 18, lineHeight: 32,
    description: "High contrast · Wide spacing · Audio",
  },
  adhd: {
    label: "ADHD Mode", emoji: "⚡",
    bg: "#0d0d0d", card: "#111", accent: "#00ff88",
    text: "#ffffff", secondary: "#888", color: "#00ff88",
    fontSize: 15, lineHeight: 26,
    description: "Micro-lessons · XP points · Timer",
  },
  autism: {
    label: "Autism Spectrum", emoji: "🧩",
    bg: "#f0f4ff", card: "#ffffff", accent: "#3b82f6",
    text: "#1e293b", secondary: "#64748b", color: "#3b82f6",
    fontSize: 14, lineHeight: 24,
    description: "Structured steps · Predictable",
  },
};

const TOPICS = ["Fractions", "Water Cycle", "Photosynthesis", "Gravity", "Parts of Speech"];

// ✅ GEMINI_KEY at the top, OUTSIDE everything
const GEMINI_KEY = "AIzaSyB06Gl-snSexdUYFXMh_oIqfcsFBUjJEak";

export default function LearnScreen() {
  const [mode, setMode] = useState("adhd");
  const [topic, setTopic] = useState("Fractions");
  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(false);
  const [xp, setXp] = useState(0);
  const [current, setCurrent] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);
  const [highlighted, setHighlighted] = useState(-1);
  const [timer, setTimer] = useState(180);
  const timerRef = useRef<any>(null);
  const m = MODES[mode];

  useEffect(() => {
    if (mode === "adhd") {
      setTimer(180);
      timerRef.current = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [mode, topic]);

  const fetchLesson = async () => {
    setLoading(true);
    setLesson("");
    setCurrent(0);
    setChecked([]);
    setHighlighted(-1);

    let prompt = "Explain " + topic + " to a 10 year old in 5 simple sentences.";
    if (mode === "dyslexia") {
      prompt = "You are a teacher for a child with dyslexia aged 9-12. Explain " + topic + " in 4 short clear sentences. Simple words only. No jargon. Text only.";
    } else if (mode === "adhd") {
      prompt = "You are a teacher for ADHD child aged 9-12. Explain " + topic + " in exactly 5 punchy energetic sentences. Add one fun fact. Text only.";
    } else if (mode === "autism") {
      prompt = "You are a teacher for autistic child aged 9-12. Explain " + topic + " in 5 literal step-by-step sentences. No metaphors. Text only.";
    }

    const url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + GEMINI_KEY;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("API Error Response:", err);
        throw new Error(err.error?.message || "API error " + res.status);
      }

      const data = await res.json();
      console.log("API Response:", data);
      
      if (!data.candidates || !data.candidates[0]) {
        throw new Error("No response candidates from API");
      }
      
      const text = data.candidates[0].content.parts[0].text;
      setLesson(text);

    } catch (e: any) {
      console.error("Lesson fetch failed:", e);
      const errorMessage = e.message || "Unknown error";
      setLesson("Could not load lesson. " + errorMessage);
    }

    setLoading(false);
  };

  useEffect(() => { fetchLesson(); }, [mode, topic]);

  const sentences = lesson
    ? lesson.match(/[^.!?]+[.!?]+/g)?.filter(Boolean) || []
    : [];

  const fmt = (s: number) =>
    Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");

  const speakText = (text: string) => Speech.speak(text, { rate: 0.85 });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: m.bg }}>

      {/* Header */}
      <View style={{
        backgroundColor: mode === "autism" ? "#fff" : "#000",
        padding: 16, paddingTop: 50,
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: mode === "autism" ? "#e2e8f0" : "#222"
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{
            width: 36, height: 36, backgroundColor: m.accent,
            borderRadius: 10, alignItems: "center", justifyContent: "center"
          }}>
            <Text style={{ fontSize: 18 }}>🧠</Text>
          </View>
          <View>
            <Text style={{ fontSize: 10, color: m.secondary, letterSpacing: 1 }}>
              TEAM BYTE MESH · PS-26
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: m.text }}>
              LearnCompanion AI
            </Text>
          </View>
        </View>
        <View style={{
          backgroundColor: mode === "autism" ? "#f1f5f9" : "#1a1a1a",
          borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5
        }}>
          <Text style={{ fontSize: 12, color: m.secondary }}>
            {m.emoji} {m.label}
          </Text>
        </View>
      </View>

      <View style={{ padding: 16 }}>

        {/* Mode Switcher */}
        <View style={{
          flexDirection: "row", gap: 6,
          backgroundColor: mode === "autism" ? "#f1f5f9" : "#111",
          borderRadius: 14, padding: 5, marginBottom: 18
        }}>
          {Object.entries(MODES).map(([key, val]: any) => (
            <TouchableOpacity
              key={key}
              onPress={() => setMode(key)}
              style={{
                flex: 1, alignItems: "center", paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: mode === key ? val.color : "transparent"
              }}>
              <Text style={{ fontSize: 18 }}>{val.emoji}</Text>
              <Text style={{
                fontSize: 11,
                color: mode === key ? "#fff" : m.secondary,
                fontWeight: mode === key ? "700" : "400"
              }}>
                {key === "dyslexia" ? "Dyslexia" : key === "adhd" ? "ADHD" : "Autism"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Topics */}
        <Text style={{
          color: m.secondary, fontSize: 11,
          letterSpacing: 1, marginBottom: 8, textTransform: "uppercase"
        }}>
          Choose Topic
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {TOPICS.map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setTopic(t)}
                style={{
                  backgroundColor: topic === t ? m.accent : mode === "autism" ? "#f1f5f9" : "#1a1a1a",
                  borderRadius: 99, paddingHorizontal: 14, paddingVertical: 7,
                  borderWidth: 1,
                  borderColor: topic === t ? m.accent : mode === "autism" ? "#e2e8f0" : "#333"
                }}>
                <Text style={{
                  color: topic === t ? (mode === "adhd" ? "#000" : "#fff") : m.text,
                  fontSize: 13,
                  fontWeight: topic === t ? "700" : "400"
                }}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Mode hint */}
        <View style={{
          borderLeftWidth: 3, borderLeftColor: m.accent,
          paddingLeft: 12, paddingVertical: 8, marginBottom: 18,
          backgroundColor: m.accent + "22", borderRadius: 8
        }}>
          <Text style={{ color: m.secondary, fontSize: 12 }}>
            <Text style={{ color: m.accent, fontWeight: "700" }}>
              {m.emoji} {m.label}:{" "}
            </Text>
            {m.description}
          </Text>
        </View>

        {/* Lesson Card */}
        <View style={{
          backgroundColor: mode === "autism" ? "#fff" : m.card,
          borderRadius: 18, padding: 18, minHeight: 250,
          borderWidth: mode === "autism" ? 2 : 1,
          borderColor: mode === "autism" ? "#e2e8f0" : "#222",
          marginBottom: 12
        }}>
          {loading ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <ActivityIndicator size="large" color={m.accent} />
              <Text style={{ color: m.secondary, marginTop: 12, fontSize: 13 }}>
                Adapting lesson for {m.label}...
              </Text>
            </View>

          ) : mode === "dyslexia" ? (
            <View>
              <View style={{
                flexDirection: "row", justifyContent: "space-between",
                alignItems: "center", marginBottom: 16
              }}>
                <View>
                  <Text style={{ color: m.accent, fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>
                    Today's Lesson
                  </Text>
                  <Text style={{ color: m.text, fontSize: 22, fontWeight: "700" }}>{topic}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => speakText(lesson)}
                  style={{
                    borderWidth: 2, borderColor: m.accent,
                    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8
                  }}>
                  <Text style={{ color: m.accent, fontSize: 13 }}>🔊 Read</Text>
                </TouchableOpacity>
              </View>
              <View style={{
                borderLeftWidth: 4, borderLeftColor: m.accent,
                paddingLeft: 16, backgroundColor: "rgba(233,69,96,0.08)",
                borderRadius: 8, padding: 16
              }}>
                {sentences.map((s, i) => (
                  <TouchableOpacity key={i} onPress={() => { setHighlighted(i); speakText(s); }}>
                    <Text style={{
                      fontSize: m.fontSize, lineHeight: m.lineHeight, color: m.text,
                      letterSpacing: 1,
                      backgroundColor: highlighted === i ? "rgba(233,69,96,0.25)" : "transparent",
                      borderRadius: 4, marginBottom: 6
                    }}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ color: m.secondary, fontSize: 12, textAlign: "center", marginTop: 10 }}>
                👆 Tap any sentence to hear it
              </Text>
            </View>

          ) : mode === "adhd" ? (
            <View>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                <View style={{ flex: 1, backgroundColor: "#1a1a1a", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#2a2a2a" }}>
                  <Text style={{ color: "#666", fontSize: 9 }}>⚡ XP</Text>
                  <Text style={{ color: m.accent, fontSize: 18, fontWeight: "800" }}>{xp}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: "#1a1a1a", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#2a2a2a" }}>
                  <Text style={{ color: "#666", fontSize: 9 }}>⏱ TIME</Text>
                  <Text style={{ color: timer < 30 ? "#ff4444" : "#fff", fontSize: 18, fontWeight: "800" }}>
                    {fmt(timer)}
                  </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: "#1a1a1a", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#2a2a2a" }}>
                  <Text style={{ color: "#666", fontSize: 9 }}>📚 CHUNK</Text>
                  <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>
                    {current + 1}/{sentences.length}
                  </Text>
                </View>
              </View>

              <View style={{ backgroundColor: "#222", borderRadius: 99, height: 6, marginBottom: 14 }}>
                <View style={{
                  width: sentences.length > 0 ? `${((current + 1) / sentences.length * 100)}%` : "0%",
                  height: 6, backgroundColor: m.accent, borderRadius: 99
                }} />
              </View>

              {sentences[current] ? (
                <View style={{
                  backgroundColor: "#1a1a1a", borderRadius: 14, padding: 16, marginBottom: 12,
                  borderWidth: 1, borderColor: checked.includes(current) ? m.accent : "#2a2a2a"
                }}>
                  <Text style={{ fontSize: m.fontSize, lineHeight: m.lineHeight, color: m.text }}>
                    {sentences[current]}
                  </Text>
                </View>
              ) : null}

              <Text style={{ color: "#666", fontSize: 12, marginBottom: 12 }}>
                {["🌟 Amazing!", "🔥 On a roll!", "💪 Keep going!", "✨ Level up!", "🚀 Star!"][current % 5]}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  if (!checked.includes(current)) {
                    setChecked([...checked, current]);
                    setXp(x => x + 25);
                  }
                  if (current < sentences.length - 1) setCurrent(c => c + 1);
                }}
                style={{
                  backgroundColor: m.accent, borderRadius: 12,
                  padding: 14, alignItems: "center"
                }}>
                <Text style={{ color: "#000", fontWeight: "800", fontSize: 14 }}>
                  {current < sentences.length - 1 ? "Got it! Next →" : "🏆 Lesson Complete!"}
                </Text>
              </TouchableOpacity>
            </View>

          ) : (
            <View>
              <View style={{
                backgroundColor: "#e8f0ff", borderRadius: 10,
                padding: 14, marginBottom: 14,
                borderWidth: 2, borderColor: "#c7d7ff"
              }}>
                <Text style={{ color: m.accent, fontSize: 10, fontWeight: "700", letterSpacing: 1 }}>
                  TODAY'S LESSON
                </Text>
                <Text style={{ color: m.text, fontSize: 18, fontWeight: "700" }}>📘 {topic}</Text>
                <Text style={{ color: m.secondary, fontSize: 12, marginTop: 4 }}>
                  {sentences.length} steps · Tap each when done
                </Text>
              </View>

              {sentences.map((step, i) => {
                const isDone = checked.includes(i);
                const isActive = i === current;
                const isLocked = i > current + 1;
                return (
                  <TouchableOpacity
                    key={i}
                    disabled={isLocked}
                    onPress={() => {
                      if (!checked.includes(i)) {
                        setChecked(c => [...c, i]);
                        if (i === current && current < sentences.length - 1) {
                          setCurrent(c => c + 1);
                        }
                      }
                    }}
                    style={{
                      backgroundColor: isDone ? "#f0fdf4" : isActive ? "#fff" : "#f8fafc",
                      borderWidth: 2,
                      borderColor: isDone ? "#22c55e" : isActive ? m.accent : "#e2e8f0",
                      borderRadius: 12, padding: 14, marginBottom: 10,
                      opacity: isLocked ? 0.4 : 1,
                      flexDirection: "row", gap: 12, alignItems: "flex-start"
                    }}>
                    <View style={{
                      width: 30, height: 30,
                      backgroundColor: isDone ? "#22c55e" : isActive ? m.accent : "#e2e8f0",
                      borderRadius: 8, alignItems: "center", justifyContent: "center"
                    }}>
                      <Text style={{
                        color: isDone || isActive ? "#fff" : "#94a3b8",
                        fontWeight: "700", fontSize: 13
                      }}>
                        {isDone ? "✓" : String(i + 1)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        color: "#94a3b8", fontSize: 10, fontWeight: "700",
                        letterSpacing: 1, textTransform: "uppercase", marginBottom: 4
                      }}>
                        Step {i + 1}
                      </Text>
                      <Text style={{
                        fontSize: m.fontSize, lineHeight: m.lineHeight,
                        color: isDone ? "#94a3b8" : m.text,
                        textDecorationLine: isDone ? "line-through" : "none"
                      }}>
                        {step}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}

              {checked.length === sentences.length && sentences.length > 0 && (
                <View style={{
                  backgroundColor: "#f0fdf4", borderWidth: 2,
                  borderColor: "#22c55e", borderRadius: 14,
                  padding: 18, alignItems: "center", marginTop: 8
                }}>
                  <Text style={{ fontSize: 32 }}>🎉</Text>
                  <Text style={{ color: "#166534", fontWeight: "700", fontSize: 15 }}>
                    Lesson Complete!
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Regenerate */}
        <TouchableOpacity
          onPress={fetchLesson}
          style={{
            borderWidth: 1,
            borderColor: mode === "autism" ? "#e2e8f0" : "#333",
            borderRadius: 10, padding: 12, alignItems: "center"
          }}>
          <Text style={{ color: m.secondary, fontSize: 13 }}>🔄 Regenerate Lesson</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}