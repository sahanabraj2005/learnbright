import * as Speech from "expo-speech";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from "react-native";
import { useRole } from "@/context/RoleContext";

const MODES: any = {
  dyslexia: {
    label: "Dyslexia Mode", emoji: "📖",
    bg: "#ffffff", card: "#fdf4ff", accent: "#9333ea",
    text: "#1e1b4b", secondary: "#6b7280", color: "#9333ea",
    fontSize: 18, lineHeight: 32,
    description: "Wide spacing · High contrast · Audio",
  },
  adhd: {
    label: "ADHD Mode", emoji: "⚡",
    bg: "#ffffff", card: "#f0fdf4", accent: "#16a34a",
    text: "#0f172a", secondary: "#64748b", color: "#16a34a",
    fontSize: 15, lineHeight: 26,
    description: "Micro-lessons · XP points · Timer",
  },
  autism: {
    label: "Autism Spectrum", emoji: "🧩",
    bg: "#ffffff", card: "#ffffff", accent: "#3b82f6",
    text: "#1e293b", secondary: "#64748b", color: "#3b82f6",
    fontSize: 14, lineHeight: 24,
    description: "Structured steps · Predictable",
  },
};

import { MOCK_LESSONS } from "@/constants/lessons";

const TOPICS = ["Fractions", "Water Cycle", "Photosynthesis", "Gravity", "Parts of Speech", "Solar System", "Ancient Egypt", "Human Heart"];

export default function LearnScreen() {
  const { role } = useRole();
  const [mode, setMode] = useState("adhd");
  const [topic, setTopic] = useState("Fractions");
  const [lesson, setLesson] = useState("");
  const [loading, setLoading] = useState(false);
  const [xp, setXp] = useState(0);
  const [current, setCurrent] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);
  const [highlighted, setHighlighted] = useState(-1);
  const [timer, setTimer] = useState(180);
  const [speakerOn, setSpeakerOn] = useState(true);
  const timerRef = useRef<any>(null);
  const m = MODES[mode];

  useEffect(() => {
    if (mode === "adhd") {
      setTimer(180);
      timerRef.current = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [mode, topic]);

  const fetchLesson = useCallback(async () => {
    setLoading(true);
    setLesson("");
    setCurrent(0);
    setChecked([]);
    setHighlighted(-1);

    // Simulate API delay
    setTimeout(() => {
      const mockLesson = MOCK_LESSONS[topic]?.[mode] || "Lesson content coming soon!";
      setLesson(mockLesson);
      setLoading(false);
    }, 800);
  }, [mode, topic]);

  useEffect(() => { fetchLesson(); }, [fetchLesson]);

  const sentences = lesson
    ? lesson.match(/[^.!?]+[.!?]+/g)?.filter(Boolean) || []
    : [];

  const fmt = (s: number) =>
    Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");

  const speakText = (text: string) => {
    if (!speakerOn) return;
    Speech.speak(text, { rate: 0.85 });
  };

  const toggleSpeaker = () => {
    if (speakerOn) Speech.stop();
    setSpeakerOn(prev => !prev);
  };

  if (role !== 'Student') {
    return (
      <View style={styles.deniedContainer}>
        <Text style={styles.deniedEmoji}>🔒</Text>
        <Text style={styles.deniedTitle}>Access Denied</Text>
        <Text style={styles.deniedText}>The Learn module is exclusively for Students.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: m.bg }}>

      {/* Header */}
      <View style={{
        backgroundColor: "#ffffff",
        padding: 16, paddingTop: 60,
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9"
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{
            width: 40, height: 40, backgroundColor: m.accent + "22",
            borderRadius: 12, alignItems: "center", justifyContent: "center"
          }}>
            <Text style={{ fontSize: 20 }}>🧠</Text>
          </View>
          <View>
            <Text style={{ fontSize: 10, color: "#94a3b8", letterSpacing: 1 }}>
              LEARNBRIGHT · AI COMPANION
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "800", color: "#0f172a" }}>
              Learn & Explore
            </Text>
          </View>
        </View>
        <View style={{
          backgroundColor: m.accent + "18",
          borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6
        }}>
          <Text style={{ fontSize: 12, color: m.accent, fontWeight: "600" }}>
            {m.emoji} {m.label}
          </Text>
        </View>
      </View>

      <View style={{ padding: 16 }}>

        {/* Mode Switcher */}
        <View style={{
          flexDirection: "row", gap: 6,
          backgroundColor: "#f8fafc",
          borderRadius: 16, padding: 5, marginBottom: 18,
          borderWidth: 1, borderColor: "#e2e8f0"
        }}>
          {Object.entries(MODES).map(([key, val]: any) => (
            <TouchableOpacity
              key={key}
              onPress={() => setMode(key)}
              style={{
                flex: 1, alignItems: "center", paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: mode === key ? val.accent : "transparent"
              }}>
              <Text style={{ fontSize: 18 }}>{val.emoji}</Text>
              <Text style={{
                fontSize: 11,
                color: mode === key ? "#fff" : "#64748b",
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
                  backgroundColor: topic === t ? m.accent : "#f1f5f9",
                  borderRadius: 99, paddingHorizontal: 14, paddingVertical: 7,
                  borderWidth: 1,
                  borderColor: topic === t ? m.accent : "#e2e8f0"
                }}>
                <Text style={{
                  color: topic === t ? "#fff" : "#475569",
                  fontSize: 13,
                  fontWeight: topic === t ? "700" : "500"
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
          backgroundColor: m.card,
          borderRadius: 18, padding: 18, minHeight: 250,
          borderWidth: 1,
          borderColor: "#e2e8f0",
          marginBottom: 12,
          shadowColor: "#94a3b8",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 2,
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
                    Today&apos;s Lesson
                  </Text>
                  <Text style={{ color: m.text, fontSize: 22, fontWeight: "700" }}>{topic}</Text>
                </View>
                {/* Speaker Toggle */}
                <TouchableOpacity
                  onPress={toggleSpeaker}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row", alignItems: "center", gap: 6,
                    backgroundColor: speakerOn ? m.accent : "#f1f5f9",
                    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9,
                    borderWidth: 1.5,
                    borderColor: speakerOn ? m.accent : "#e2e8f0",
                  }}>
                  <Text style={{ fontSize: 16 }}>{speakerOn ? "🔊" : "🔇"}</Text>
                  <Text style={{
                    color: speakerOn ? "#fff" : "#64748b",
                    fontSize: 13, fontWeight: "700"
                  }}>
                    {speakerOn ? "ON" : "OFF"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{
                borderLeftWidth: 4, borderLeftColor: m.accent,
                paddingLeft: 16, backgroundColor: "rgba(233,69,96,0.08)",
                borderRadius: 8, padding: 16
              }}>
                {sentences.map((s, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => { setHighlighted(i); speakText(s); }}
                    activeOpacity={speakerOn ? 0.7 : 1}
                  >
                    <Text style={{
                      fontSize: m.fontSize, lineHeight: m.lineHeight, color: m.text,
                      letterSpacing: 1,
                      backgroundColor: highlighted === i ? m.accent + "28" : "transparent",
                      borderRadius: 6, marginBottom: 8, padding: 4,
                    }}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ color: speakerOn ? m.secondary : "#cbd5e1", fontSize: 12, textAlign: "center", marginTop: 10 }}>
                {speakerOn ? "👆 Tap any sentence to hear it" : "🔇 Speaker is off — turn it on to listen"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const currentIndex = TOPICS.indexOf(topic);
                  const nextIndex = (currentIndex + 1) % TOPICS.length;
                  setTopic(TOPICS[nextIndex]);
                }}
                style={{
                  marginTop: 16,
                  backgroundColor: m.accent, borderRadius: 10,
                  padding: 12, alignItems: "center"
                }}>
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                  🏁 Finish & Learn Next Topic →
                </Text>
              </TouchableOpacity>
            </View>

          ) : mode === "adhd" ? (
            <View>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 14 }}>
                <View style={{ flex: 1, backgroundColor: "#f0fdf4", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#bbf7d0" }}>
                  <Text style={{ color: "#16a34a", fontSize: 9, fontWeight: "700" }}>⚡ XP</Text>
                  <Text style={{ color: m.accent, fontSize: 18, fontWeight: "800" }}>{xp}</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: "#f0fdf4", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#bbf7d0" }}>
                  <Text style={{ color: "#16a34a", fontSize: 9, fontWeight: "700" }}>⏱ TIME</Text>
                  <Text style={{ color: timer < 30 ? "#ef4444" : "#0f172a", fontSize: 18, fontWeight: "800" }}>
                    {fmt(timer)}
                  </Text>
                </View>
                <View style={{ flex: 1, backgroundColor: "#f0fdf4", borderRadius: 10, padding: 10, borderWidth: 1, borderColor: "#bbf7d0" }}>
                  <Text style={{ color: "#16a34a", fontSize: 9, fontWeight: "700" }}>📚 CHUNK</Text>
                  <Text style={{ color: "#0f172a", fontSize: 18, fontWeight: "800" }}>
                    {current + 1}/{sentences.length}
                  </Text>
                </View>
              </View>

              <View style={{ backgroundColor: "#e2e8f0", borderRadius: 99, height: 6, marginBottom: 14 }}>
                <View style={{
                  width: sentences.length > 0 ? `${((current + 1) / sentences.length * 100)}%` : "0%",
                  height: 6, backgroundColor: m.accent, borderRadius: 99
                }} />
              </View>

              {sentences[current] ? (
                <View style={{
                  backgroundColor: "#ffffff", borderRadius: 14, padding: 16, marginBottom: 12,
                  borderWidth: 2, borderColor: checked.includes(current) ? m.accent : "#e2e8f0",
                  shadowColor: "#94a3b8", shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
                }}>
                  <Text style={{ fontSize: m.fontSize, lineHeight: m.lineHeight, color: m.text }}>
                    {sentences[current]}
                  </Text>
                </View>
              ) : null}

              <Text style={{ color: m.secondary, fontSize: 12, marginBottom: 12, fontWeight: "600" }}>
                {["🌟 Amazing!", "🔥 On a roll!", "💪 Keep going!", "✨ Level up!", "🚀 Star!"][current % 5]}
              </Text>

                <TouchableOpacity
                  onPress={() => {
                    if (current < sentences.length - 1) {
                      if (!checked.includes(current)) {
                        setChecked([...checked, current]);
                        setXp(x => x + 25);
                      }
                      setCurrent(c => c + 1);
                    } else {
                      const currentIndex = TOPICS.indexOf(topic);
                      const nextIndex = (currentIndex + 1) % TOPICS.length;
                      setTopic(TOPICS[nextIndex]);
                    }
                  }}
                  style={{
                    backgroundColor: m.accent, borderRadius: 12,
                    padding: 14, alignItems: "center"
                  }}>
                  <Text style={{ color: "#000", fontWeight: "800", fontSize: 14 }}>
                    {current < sentences.length - 1 ? "Got it! Next →" : "🏆 Lesson Complete! Learn Next →"}
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
                  TODAY&apos;S LESSON
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
                <TouchableOpacity
                  onPress={() => {
                    const currentIndex = TOPICS.indexOf(topic);
                    const nextIndex = (currentIndex + 1) % TOPICS.length;
                    setTopic(TOPICS[nextIndex]);
                  }}
                  style={{
                    backgroundColor: "#f0fdf4", borderWidth: 2,
                    borderColor: "#22c55e", borderRadius: 14,
                    padding: 18, alignItems: "center", marginTop: 8
                  }}>
                  <Text style={{ fontSize: 32 }}>🎉</Text>
                  <Text style={{ color: "#166534", fontWeight: "700", fontSize: 15 }}>
                    Lesson Complete! Tap to learn next topic →
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Regenerate */}
        <TouchableOpacity
          onPress={fetchLesson}
          style={{
            borderWidth: 1.5,
            borderColor: "#e2e8f0",
            borderRadius: 14, padding: 14, alignItems: "center",
            backgroundColor: "#f8fafc",
          }}>
          <Text style={{ color: "#64748b", fontSize: 13, fontWeight: "600" }}>🔄 Regenerate Lesson</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  deniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  deniedEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  deniedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  deniedText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
});
