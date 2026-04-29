import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView, StyleSheet,
    Text, TextInput, TouchableOpacity,
    View
} from "react-native";

const PROFILES: Record<string, any> = {
  dyslexia: {
    emoji: "📖", color: "#F97316", label: "Dyslexia",
    systemPrompt: `You help a child with dyslexia. Use very short sentences. Max 10 words each. Use simple words. Use bullet points. Be warm and encouraging. End with: You are doing amazing! 🌟`
  },
  adhd: {
    emoji: "⚡", color: "#8B5CF6", label: "ADHD",
    systemPrompt: `You help a child with ADHD. Keep responses SHORT. Use emojis. Break into 3 fun steps with points. Use game language like Level up! Be enthusiastic!`
  },
  autism: {
    emoji: "🧩", color: "#0EA5E9", label: "Autism",
    systemPrompt: `You help a child on the autism spectrum. Always use this format:
TOPIC: [name]
WHAT IT IS: [definition]
STEPS: 1. 2. 3.
EXAMPLE: [concrete example]
CHECK: [yes/no question]
Be literal and precise. No idioms.`
  },
};

export default function LearnScreen() {
  const { profile } = useLocalSearchParams<{ profile: string }>();
  const p = PROFILES[profile as string] || PROFILES.adhd;

  const [messages, setMessages] = useState<{role:string, content:string}[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "sk-ant-api03-xxxxxx",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: p.systemPrompt,
          messages: newMessages
        })
      });
      const data = await res.json();
      const reply = data.content?.map((c: any) => c.text || "").join("") || "Try again!";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Oops! Something went wrong 🔄" }]);
    }
    setLoading(false);
    scrollRef.current?.scrollToEnd({ animated: true });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: p.color }]}>
        <Text style={styles.headerEmoji}>{p.emoji}</Text>
        <View>
          <Text style={styles.headerTitle}>LearnBright</Text>
          <Text style={styles.headerSub}>{p.label} Mode</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView ref={scrollRef} style={styles.messages} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {messages.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48 }}>{p.emoji}</Text>
            <Text style={[styles.emptyTitle, { color: p.color }]}>Ready to learn!</Text>
            <Text style={styles.emptySub}>Ask me anything — try "What is photosynthesis?" or "Teach me fractions"</Text>
          </View>
        )}
        {messages.map((m, i) => (
          <View key={i} style={[styles.bubble, m.role === "user" ? { ...styles.userBubble, backgroundColor: p.color } : styles.aiBubble]}>
            <Text style={[styles.bubbleText, { color: m.role === "user" ? "white" : "#1e293b" }]}>
              {m.content}
            </Text>
          </View>
        ))}
        {loading && (
          <View style={styles.aiBubble}>
            <ActivityIndicator color={p.color} />
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputRow, { borderTopColor: p.color + "44" }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything! 😊"
          style={styles.input}
          multiline
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={[styles.sendBtn, { backgroundColor: p.color }]}>
          <Text style={{ color: "white", fontSize: 20 }}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16, backgroundColor: "white", borderBottomWidth: 3 },
  headerEmoji: { fontSize: 28 },
  headerTitle: { fontWeight: "800", fontSize: 16, color: "#1e293b" },
  headerSub: { fontSize: 12, color: "#64748b" },
  messages: { flex: 1 },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 20, fontWeight: "800" },
  emptySub: { color: "#94a3b8", textAlign: "center", fontSize: 14, paddingHorizontal: 20 },
  bubble: { maxWidth: "80%", padding: 12, borderRadius: 16 },
  userBubble: { alignSelf: "flex-end", borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "white", borderBottomLeftRadius: 4, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  inputRow: { flexDirection: "row", padding: 12, gap: 8, backgroundColor: "white", borderTopWidth: 2, alignItems: "flex-end" },
  input: { flex: 1, backgroundColor: "#f1f5f9", borderRadius: 12, padding: 12, fontSize: 15, maxHeight: 100 },
  sendBtn: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
}); 
