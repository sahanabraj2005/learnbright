import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const ACTIVITIES = [
  {
    color: '#3b82f6',
    title: 'Completed "Fractions Intro"',
    time: 'Today, 10:30 AM',
  },
  {
    color: '#22c55e',
    title: 'Earned "Speed Reader" Badge',
    time: 'Yesterday, 2:15 PM',
  },
  {
    color: '#ef4444',
    title: 'Struggled with "Word Problems"',
    time: 'Yesterday, 1:00 PM',
  },
];

export default function ParentHome() {
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces
      >
        {/* ── Header ── */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hello! 👋</Text>
            <Text style={styles.title}>Parent</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>👨‍👩‍👧</Text>
          </View>
        </View>

        {/* ── Child Profile ── */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatarBox}>
            <Text style={styles.profileEmoji}>👦</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Alex Johnson</Text>
            <Text style={styles.profileMeta}>Grade 4 · Age 10</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>ADHD Profile</Text>
            </View>
          </View>
        </View>

        {/* ── Daily Activity ── */}
        <Text style={styles.sectionLabel}>DAILY ACTIVITY</Text>
        <View style={styles.card}>
          {ACTIVITIES.map((a, i) => (
            <View key={i} style={styles.activityRow}>
              {/* Timeline */}
              <View style={styles.timeline}>
                <View style={[styles.dot, { backgroundColor: a.color }]} />
                {i < ACTIVITIES.length - 1 && <View style={styles.line} />}
              </View>
              {/* Content */}
              <View style={[
                styles.activityContent,
                i < ACTIVITIES.length - 1 && styles.activityContentSpaced,
              ]}>
                <Text style={styles.activityTitle}>{a.title}</Text>
                <Text style={styles.activityTime}>{a.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── AI Insights ── */}
        <Text style={styles.sectionLabel}>AI LEARNING INSIGHTS</Text>
        <View style={[styles.card, styles.insightCard]}>
          <View style={styles.insightTitleRow}>
            <Text style={styles.insightEmoji}>🤖</Text>
            <Text style={styles.insightTitle}>Struggle Area Detected</Text>
          </View>
          <Text style={styles.insightBody}>
            Alex is showing signs of frustration with "Word Problems". Our AI
            has automatically adapted lessons to smaller visual steps matching
            his ADHD profile.
          </Text>
          <TouchableOpacity style={styles.insightBtn} activeOpacity={0.8}>
            <Text style={styles.insightBtnText}>View AI Adaptation Logs</Text>
          </TouchableOpacity>
        </View>

        {/* ── Teacher Feedback ── */}
        <Text style={styles.sectionLabel}>TEACHER FEEDBACK</Text>
        <View style={[styles.card, styles.feedbackCard]}>
          <View style={styles.teacherRow}>
            <View style={styles.teacherAvatarBox}>
              <Text style={styles.teacherEmoji}>👩‍🏫</Text>
            </View>
            <View>
              <Text style={styles.teacherName}>Mrs. Davis</Text>
              <Text style={styles.teacherSubject}>Math Teacher</Text>
            </View>
          </View>
          <Text style={styles.feedbackBody}>
            "Alex has been incredibly focused this week. The micro-lesson format
            is working perfectly. Keep encouraging him to take short breaks
            between modules!"
          </Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 110,          // clears hamburger (top:52 + height:42 + 16 gap)
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },
  title: { fontSize: 26, fontWeight: '800', color: '#0f172a', marginTop: 2 },
  avatarCircle: {
    width: 52, height: 52,
    backgroundColor: '#f0fdf4',
    borderRadius: 26,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarEmoji: { fontSize: 24 },

  /* Profile Card */
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 20,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  profileAvatarBox: {
    width: 60, height: 60,
    backgroundColor: '#eff6ff',
    borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 16,
  },
  profileEmoji: { fontSize: 30 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  profileMeta: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  profileBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 8, alignSelf: 'flex-start', marginTop: 6,
  },
  profileBadgeText: { fontSize: 11, fontWeight: '700', color: '#ef4444' },

  /* Section Label */
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#94a3b8',
    letterSpacing: 1, marginBottom: 12,
  },

  /* Base Card */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#94a3b8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  /* Activity Timeline */
  activityRow: {
    flexDirection: 'row',
  },
  timeline: {
    width: 20,
    alignItems: 'center',
    marginRight: 14,
  },
  dot: {
    width: 12, height: 12,
    borderRadius: 6,
    marginTop: 3,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: 20,
    backgroundColor: '#e2e8f0',
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
    paddingBottom: 4,
  },
  activityContentSpaced: {
    paddingBottom: 18,
  },
  activityTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  activityTime: { fontSize: 12, color: '#94a3b8', marginTop: 2 },

  /* AI Insight Card */
  insightCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  insightTitleRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
  },
  insightEmoji: { fontSize: 20, marginRight: 8 },
  insightTitle: { fontSize: 15, fontWeight: '700', color: '#7c3aed' },
  insightBody: {
    fontSize: 13, color: '#4c1d95', lineHeight: 21, marginBottom: 14,
  },
  insightBtn: {
    backgroundColor: '#ede9fe',
    paddingVertical: 11, borderRadius: 12, alignItems: 'center',
  },
  insightBtnText: { color: '#7c3aed', fontWeight: '700', fontSize: 13 },

  /* Teacher Feedback Card */
  feedbackCard: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  teacherRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
  },
  teacherAvatarBox: {
    width: 44, height: 44,
    backgroundColor: '#fef3c7',
    borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  teacherEmoji: { fontSize: 22 },
  teacherName: { fontSize: 15, fontWeight: '700', color: '#92400e' },
  teacherSubject: { fontSize: 12, color: '#b45309', marginTop: 1 },
  feedbackBody: {
    fontSize: 13, color: '#78350f', fontStyle: 'italic', lineHeight: 21,
  },
});
