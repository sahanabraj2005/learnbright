import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function TeacherHome() {
  const router = require('expo-router').useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.greetRow}>
            <View>
              <Text style={styles.greeting}>Good morning! 👋</Text>
              <Text style={styles.title}>Teacher 👨‍🏫</Text>
            </View>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarEmoji}>👨‍🏫</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
            <Text style={styles.statEmoji}>👥</Text>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
            <Text style={styles.statEmoji}>📈</Text>
            <Text style={styles.statValue}>71%</Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fef2f2' }]}>
            <Text style={styles.statEmoji}>🔔</Text>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Alert</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>CLASSROOM</Text>

        <TouchableOpacity style={styles.card} onPress={() => router.push('/(tabs)/teacher')} activeOpacity={0.88}>
          <View style={styles.cardLeft}>
            <View style={[styles.cardIconBox, { backgroundColor: '#eff6ff' }]}>
              <Text style={styles.cardIcon}>📊</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Student Performance</Text>
              <Text style={styles.cardDesc}>View AI-powered insights & metrics</Text>
            </View>
          </View>
          <Text style={styles.cardArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            💡  Our AI continuously adapts lessons based on each student's unique learning profile.
          </Text>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { paddingHorizontal: 20, paddingTop: 90, paddingBottom: 20 },
  header: { marginBottom: 28 },
  greetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 14, color: '#94a3b8', fontWeight: '500' },
  title: { fontSize: 26, fontWeight: '800', color: '#0f172a', marginTop: 2 },
  avatarBadge: { width: 52, height: 52, backgroundColor: '#fef2f2', borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  avatarEmoji: { fontSize: 26 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 18 },
  statEmoji: { fontSize: 20, marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  statLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2, fontWeight: '600' },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', letterSpacing: 1, marginBottom: 14 },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  cardIconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  cardIcon: { fontSize: 24 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardDesc: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  cardArrow: { fontSize: 26, color: '#cbd5e1' },
  banner: { backgroundColor: '#f0f9ff', borderRadius: 16, padding: 16, marginTop: 8, borderLeftWidth: 4, borderLeftColor: '#38bdf8' },
  bannerText: { fontSize: 13, color: '#0369a1', lineHeight: 20, fontWeight: '500' },
});
