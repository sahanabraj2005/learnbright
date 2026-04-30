import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRole } from "@/context/RoleContext";
import StudentHome from "../(student)/index";
import TeacherHome from "../(teacher)/index";
import ParentHome from "../(parent)/index";

export default function HomeScreen() {
  const { role, setRole, setUserName, setUserEmail } = useRole();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  // If role is set, show the role-specific dashboard
  if (role === 'Student') return <StudentHome />;
  if (role === 'Teacher') return <TeacherHome />;
  if (role === 'Parent') return <ParentHome />;

  // Default Auth Screen if no role/not logged in (though role-selection should handle this)
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🌟</Text>
          <Text style={styles.title}>LearnBright</Text>
          <Text style={styles.subtitle}>
            {isLogin ? "Welcome back! Let's learn today 🎉" : "Join us and start learning! 🚀"}
          </Text>
        </View>
{/* Toggle Tabs */}
<View style={styles.toggleContainer}>
  <TouchableOpacity
    style={[styles.toggleBtn, isLogin && styles.toggleActive]}
    onPress={() => setIsLogin(true)}
  >
    <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
      Login
    </Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={[styles.toggleBtn, !isLogin && styles.toggleActive]}
    onPress={() => setIsLogin(false)}
  >
    <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
      Sign Up
    </Text>
  </TouchableOpacity>
</View>

        {/* Card */}
        <View style={styles.card}>
          {/* Name field - only on Sign Up */}
          {!isLogin && (
            <>
              <Text style={styles.label}>👤 Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your full name"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#aaa"
              />
            </>
          )}

          <Text style={styles.label}>📧 Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />

          <Text style={styles.label}>🔒 Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#aaa"
          />

          {/* Confirm Password - only on Sign Up */}
          {!isLogin && (
            <>
              <Text style={styles.label}>🔒 Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#aaa"
              />
            </>
          )}

          {/* Remember Me - only on Login */}
          {isLogin && (
            <View style={styles.rememberRow}>
              <Text style={styles.rememberText}>Remember me</Text>
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: "#ddd", true: "#a78bfa" }}
                thumbColor={rememberMe ? "#7c3aed" : "#f4f3f4"}
              />
            </View>
          )}

          {/* Button */}
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              if (!email || !password) {
                alert("Please fill in email and password");
                return;
              }
              if (!isLogin && !name.trim()) {
                alert("Please enter your full name");
                return;
              }
              // Save user details globally
              const displayName = isLogin
                ? email.split('@')[0]   // derive name from email on login
                : name.trim();
              setUserName(displayName);
              setUserEmail(email.trim());
              // Determine role from email
              const mockEmail = email.toLowerCase();
              if (mockEmail.includes('teacher')) {
                setRole('Teacher');
              } else if (mockEmail.includes('parent')) {
                setRole('Parent');
              } else {
                setRole('Student');
              }
            }}
          >
            <Text style={styles.buttonText}>
              {isLogin ? "Login 🚀" : "Create Account ✨"}
            </Text>
          </TouchableOpacity>

          {/* Switch link */}
          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4ff",
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#7c3aed",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#e9d5ff",
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "#7c3aed",
  },
  toggleText: {
    color: "#7c3aed",
    fontWeight: "600",
    fontSize: 15,
  },
  toggleTextActive: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#7c3aed",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: "#111",
  },
  rememberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  rememberText: {
    fontSize: 14,
    color: "#6b7280",
  },
  button: {
    backgroundColor: "#7c3aed",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  switchText: {
    textAlign: "center",
    color: "#7c3aed",
    marginTop: 16,
    fontSize: 13,
    fontWeight: "500",
  },
});
          