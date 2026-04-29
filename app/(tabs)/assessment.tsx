import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Profile = "adhd" | "dyslexia" | "autism" | "balanced";

// ─── QUESTION TREE (Adaptive) ─────────────────────────
const questionTree: Record<string, any> = {
  start: {
    id: "start",
    emoji: "📚",
    text: "When you look at this word: 'dog' — what happens?",
    options: [
      { label: "I read it easily!", next: "focus", scores: {} },
      { label: "Letters look jumbled", next: "dyslexia_1", scores: { dyslexia: 3 } },
      { label: "I lose my place", next: "dyslexia_1", scores: { dyslexia: 2 } },
      { label: "I get bored quickly", next: "adhd_1", scores: { adhd: 2 } },
    ],
  },

  // ── DYSLEXIA BRANCH ──
  dyslexia_1: {
    id: "dyslexia_1",
    emoji: "🔤",
    text: "Do you mix up letters like 'b' and 'd' or 'p' and 'q'?",
    options: [
      { label: "Yes, very often!", next: "dyslexia_2", scores: { dyslexia: 3 } },
      { label: "Sometimes", next: "dyslexia_2", scores: { dyslexia: 1 } },
      { label: "Not really", next: "focus", scores: {} },
    ],
  },
  dyslexia_2: {
    id: "dyslexia_2",
    emoji: "✏️",
    text: "Is spelling words correctly very difficult for you?",
    options: [
      { label: "Yes, very hard!", next: "result", scores: { dyslexia: 3 } },
      { label: "A little difficult", next: "result", scores: { dyslexia: 1 } },
      { label: "I'm okay at spelling", next: "result", scores: {} },
    ],
  },

  // ── ADHD BRANCH ──
  adhd_1: {
    id: "adhd_1",
    emoji: "⚡",
    text: "During a lesson, how long can you focus before your mind wanders?",
    options: [
      { label: "Less than 2 minutes!", next: "adhd_2", scores: { adhd: 3 } },
      { label: "About 5 minutes", next: "adhd_2", scores: { adhd: 2 } },
      { label: "10+ minutes easily", next: "focus", scores: {} },
    ],
  },
  adhd_2: {
    id: "adhd_2",
    emoji: "🪑",
    text: "Do you feel the need to move around a lot while studying?",
    options: [
      { label: "Yes, I can't sit still!", next: "result", scores: { adhd: 3 } },
      { label: "Sometimes", next: "result", scores: { adhd: 1 } },
      { label: "No, I'm fine sitting", next: "result", scores: {} },
    ],
  },

  // ── FOCUS CHECK (decides autism or balanced) ──
  focus: {
    id: "focus",
    emoji: "🎯",
    text: "Do you get very upset when your daily schedule changes suddenly?",
    options: [
      { label: "Yes! I hate changes!", next: "autism_1", scores: { autism: 3 } },
      { label: "A little bothered", next: "autism_1", scores: { autism: 1 } },
      { label: "No, I adapt easily", next: "balanced_1", scores: {} },
    ],
  },

  // ── AUTISM BRANCH ──
  autism_1: {
    id: "autism_1",
    emoji: "🧩",
    text: "Do you have ONE topic you know everything about and love deeply?",
    options: [
      { label: "Yes! I'm obsessed with it!", next: "result", scores: { autism: 3 } },
      { label: "I have a few deep interests", next: "result", scores: { autism: 1 } },
      { label: "I like many things equally", next: "result", scores: {} },
    ],
  },

  // ── BALANCED BRANCH ──
  balanced_1: {
    id: "balanced_1",
    emoji: "🌟",
    text: "How do you learn best?",
    options: [
      { label: "👀 Seeing pictures & videos", next: "result", scores: { balanced: 2 } },
      { label: "👂 Listening to explanations", next: "result", scores: { balanced: 2 } },
      { label: "✋ Doing it hands-on", next: "result", scores: { balanced: 2 } },
      { label: "📖 Reading step by step", next: "result", scores: { balanced: 2 } },
    ],
  },

  result: { id: "result" },
};

const getProfile = (scores: Record<string, number>): Profile => {
  const { adhd = 0, dyslexia = 0, autism = 0 } = scores;
  const max = Math.max(adhd, dyslexia, autism);
  if (max === 0) return "balanced";
  if (adhd === max) return "adhd";
  if (dyslexia === max) return "dyslexia";
  return "autism";
};

const profileData: Record<Profile, any> = {
  dyslexia: {
    emoji: "🔤",
    color: "#f59e0b",
    title: "Dyslexia-Friendly Learner",
    desc: "You see the world differently — and that's a superpower!",
    adaptations: [
      "📝 Special easy-to-read fonts (OpenDyslexic)",
      "🎧 Audio versions of every lesson",
      "🌈 Color-coded words to reduce confusion",
      "⏰ No time pressure on any task",
      "🔊 Text-to-speech for all reading tasks",
    ],
  },
  adhd: {
    emoji: "⚡",
    color: "#ef4444",
    title: "High-Energy Learner (ADHD)",
    desc: "Your energy is your strength — we'll channel it!",
    adaptations: [
      "🎮 Gamified micro-lessons (3 mins each)",
      "🏆 Reward badges after every task",
      "⏱️ Movement breaks every 5 minutes",
      "🎯 One small goal at a time",
      "📳 Reminders and focus timers",
    ],
  },
  autism: {
    emoji: "🎯",
    color: "#8b5cf6",
    title: "Structured Learner (Autism)",
    desc: "You thrive with clarity and consistency!",
    adaptations: [
      "📋 Clear step-by-step instructions always",
      "🔄 Same lesson format every day",
      "🤫 Distraction-free quiet environment",
      "✅ Visual checklists for every task",
      "📊 Predictable schedule shown upfront",
    ],
  },
  balanced: {
    emoji: "🌟",
    color: "#10b981",
    title: "Balanced Learner",
    desc: "You're a versatile learner — great at adapting!",
    adaptations: [
      "📚 Mix of visual and text content",
      "🎮 Gamified and story-based lessons",
      "🎯 Self-paced learning path",
      "🌈 Variety in lesson formats",
      "🏆 Challenges to keep you engaged",
    ],
  },
};

export default function AdaptiveAssessment() {
  const [currentId, setCurrentId] = useState("start");
  const [scores, setScores] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  const handleAnswer = (option: any) => {
    const newScores = { ...scores };
    Object.entries(option.scores).forEach(([key, val]) => {
      newScores[key] = (newScores[key] || 0) + (val as number);
    });

    setHistory([...history, currentId]);

    if (option.next === "result" || questionTree[option.next]?.id === "result") {
      setScores(newScores);
      setProfile(getProfile(newScores));
    } else {
      setScores(newScores);
      setCurrentId(option.next);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentId(prev);
  };

  const reset = () => {
    setCurrentId("start");
    setScores({});
    setHistory([]);
    setProfile(null);
  };

  // ── RESULT SCREEN ──
  if (profile) {
    const p = profileData[profile];
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: p.color + "12" }]}>
        <ScrollView contentContainerStyle={styles.resultScroll}>
          <Text style={styles.resultEmoji}>{p.emoji}</Text>
          <Text style={styles.resultBadge}>Learning Profile Detected!</Text>
          <Text style={[styles.resultTitle, { color: p.color }]}>{p.title}</Text>
          <Text style={styles.resultDesc}>{p.desc}</Text>

          <View style={[styles.adaptCard, { borderColor: p.color }]}>
            <Text style={[styles.adaptTitle, { color: p.color }]}>
              How LearnBright adapts for you 🧠
            </Text>
            {p.adaptations.map((a: string, i: number) => (
              <View key={i} style={styles.adaptRow}>
                <Text style={styles.adaptText}>{a}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[styles.startBtn, { backgroundColor: p.color }]}>
            <Text style={styles.startBtnText}>Start My Lessons! 🚀</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={reset} style={styles.retakeBtn}>
            <Text style={[styles.retakeText, { color: p.color }]}>🔄 Retake Assessment</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── QUESTION SCREEN ──
  const q = questionTree[currentId];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <Text style={styles.headerTitle}>🧠 LearnBright Assessment</Text>
        <Text style={styles.headerSub}>Adapting to your answers in real time...</Text>

        {/* Step indicator */}
        <View style={styles.stepRow}>
          {history.map((_, i) => (
            <View key={i} style={[styles.stepDot, styles.stepDotDone]} />
          ))}
          <View style={[styles.stepDot, styles.stepDotActive]} />
          <View style={styles.stepDot} />
          <View style={styles.stepDot} />
        </View>

        {/* Adaptive tag */}
        <View style={styles.adaptiveTag}>
          <Text style={styles.adaptiveTagText}>
            ✨ Questions adapt based on your answers
          </Text>
        </View>

        {/* Question */}
        <Text style={styles.qEmoji}>{q.emoji}</Text>
        <Text style={styles.qText}>{q.text}</Text>

        {/* Options */}
        {q.options.map((opt: any, i: number) => (
          <TouchableOpacity
            key={i}
            style={styles.option}
            onPress={() => handleAnswer(opt)}
          >
            <Text style={styles.optionText}>{opt.label}</Text>
            <Text style={styles.optionArrow}>→</Text>
          </TouchableOpacity>
        ))}

        {/* Back button */}
        {history.length > 0 && (
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Text style={styles.backText}>← Go back</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4ff" },
  scroll: { padding: 24, paddingTop: 48 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#7c3aed", textAlign: "center", marginBottom: 4 },
  headerSub: { fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 20 },
  stepRow: { flexDirection: "row", gap: 8, justifyContent: "center", marginBottom: 16 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#e5e7eb" },
  stepDotDone: { backgroundColor: "#a78bfa" },
  stepDotActive: { backgroundColor: "#7c3aed", width: 24 },
  adaptiveTag: { backgroundColor: "#ede9fe", borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14, alignSelf: "center", marginBottom: 28 },
  adaptiveTagText: { fontSize: 12, color: "#7c3aed", fontWeight: "600" },
  qEmoji: { fontSize: 56, textAlign: "center", marginBottom: 12 },
  qText: { fontSize: 20, fontWeight: "bold", color: "#1f2937", textAlign: "center", marginBottom: 28, lineHeight: 30 },
  option: { backgroundColor: "#fff", borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 2, borderColor: "#e5e7eb", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  optionText: { fontSize: 15, color: "#374151", fontWeight: "500", flex: 1 },
  optionArrow: { fontSize: 18, color: "#7c3aed" },
  backBtn: { marginTop: 8, alignItems: "center", padding: 12 },
  backText: { fontSize: 14, color: "#9ca3af" },
  resultScroll: { padding: 24, paddingTop: 60, alignItems: "center" },
  resultEmoji: { fontSize: 80, marginBottom: 12 },
  resultBadge: { fontSize: 13, color: "#6b7280", marginBottom: 8, fontWeight: "600" },
  resultTitle: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  resultDesc: { fontSize: 15, color: "#6b7280", textAlign: "center", marginBottom: 24, lineHeight: 24 },
  adaptCard: { width: "100%", borderWidth: 2, borderRadius: 20, padding: 20, marginBottom: 28, backgroundColor: "#fff" },
  adaptTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 16 },
  adaptRow: { flexDirection: "row", marginBottom: 10 },
  adaptText: { fontSize: 14, color: "#374151", lineHeight: 22, flex: 1 },
  startBtn: { borderRadius: 16, padding: 18, paddingHorizontal: 40, alignItems: "center", marginBottom: 16, width: "100%" },
  startBtnText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  retakeBtn: { padding: 12 },
  retakeText: { fontSize: 14, fontWeight: "600" },
});