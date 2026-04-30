import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function StudentHome() {
  const router = useRouter();

  const stats = [
    { emoji: '📚', value: '12', label: 'Lessons', bg: '#faf5ff' },
    { emoji: '⭐', value: '8', label: 'Badges', bg: '#fefce8' },
    { emoji: '🔥', value: '5', label: 'Streak', bg: '#fff7ed' },
  ];

  const cards = [
    {
      icon: '📝',
      iconBg: '#f5f3ff',
      title: 'Take Assessment',
      desc: 'Discover your unique learning profile',
      route: '/(tabs)/assessment' as const,
    },
    {
      icon: '🧠',
      iconBg: '#f0fdf4',
      title: 'Learn & Explore',
      desc: 'Start your AI-adapted lessons',
      route: '/(tabs)/learn' as const,
    },
  ];

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Good morning! 👋</Text>
            <Text style={styles.title}>Student Portal</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>🎓</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: s.bg }]}>
              <Text style={styles.statEmoji}>{s.emoji}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Section Title */}
        <Text style={styles.sectionLabel}>QUICK ACCESS</Text>

        {/* Action Cards */}
        {cards.map((card) => (
          <TouchableOpacity
            key={card.title}
            style={styles.card}
            onPress={() => router.push(card.route)}
            activeOpacity={0.85}
          >
            <View style={styles.cardLeft}>
              <View style={[styles.iconBox, { backgroundColor: card.iconBg }]}>
                <Text style={styles.iconText}>{card.icon}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardDesc}>{card.desc}</Text>
              </View>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Motivational Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            🌟  Keep going! Every lesson brings you closer to your goals.
          </Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const statusBarHeight =
  Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 0;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    paddingTop: 80 + statusBarHeight,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerText: { flex: 1 },
  greeting: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    backgroundColor: '#f5f3ff',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  avatarEmoji: { fontSize: 26 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 18,
  },
  statEmoji: { fontSize: 20, marginBottom: 6 },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '600',
  },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 14,
  },

  // Cards
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconText: { fontSize: 24 },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  cardDesc: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  chevron: {
    fontSize: 28,
    color: '#cbd5e1',
    lineHeight: 32,
  },

  // Banner
  banner: {
    backgroundColor: '#faf5ff',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#a78bfa',
  },
  bannerText: {
    fontSize: 13,
    color: '#6d28d9',
    lineHeight: 20,
    fontWeight: '500',
  },
});
