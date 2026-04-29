import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API Key - Using the one found in the project's other screens
const genAI = new GoogleGenerativeAI('AIzaSyBLS15IzfiNW5m_Ua4JadV_8C9mLaOxuHI');

const mockStudents = [
  { 
    id: '1',
    name: 'Alex',  
    profile: 'ADHD',     
    topic: 'Fractions',      
    status: 'needs', 
    timeSpent: '45 mins', 
    progress: 42,
    strengths: ['Creativity', 'Speed'],
    struggling: ['Long-form reading'] 
  },
  { 
    id: '2',
    name: 'Sarah', 
    profile: 'Dyslexia', 
    topic: 'Phonics',  
    status: 'good',  
    timeSpent: '30 mins', 
    progress: 78,
    strengths: ['Visual Thinking', 'Problem Solving'],
    struggling: ['Letter reversals']
  },
  { 
    id: '3',
    name: 'David', 
    profile: 'Autism',   
    topic: 'Patterns',       
    status: 'good',  
    timeSpent: '60 mins', 
    progress: 92,
    strengths: ['Attention to detail', 'Logic'],
    struggling: ['Social cues in stories']
  },
];

export default function TeacherDashboard() {
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);
  const [insight, setInsight] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchInsight = useCallback(async (student: typeof mockStudents[0]) => {
    setIsGenerating(true);
    setInsight('');
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Student Name: ${student.name}. Profile: ${student.profile}. Topic: ${student.topic}. Progress: ${student.progress}%. 
      Provide a 2-sentence pedagogical insight and a specific recommendation for the teacher.`;
      
      const result = await model.generateContent(prompt);
      setInsight(result.response.text().trim());
    } catch {
      setInsight('Analyze student engagement patterns to identify peak focus windows.');
    }
    setIsGenerating(false);
  }, []);

  useEffect(() => {
    fetchInsight(selectedStudent);
  }, [selectedStudent, fetchInsight]);

  const profileColors: Record<string, string> = {
    ADHD: '#ef4444',
    Dyslexia: '#f59e0b',
    Autism: '#8b5cf6',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Teacher Dashboard</Text>
          <Text style={styles.subtitle}>AI-Powered Classroom Insights</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#eff6ff' }]}>
            <Text style={styles.statValue}>{mockStudents.length}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#f0fdf4' }]}>
            <Text style={styles.statValue}>71%</Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fef2f2' }]}>
            <Text style={styles.statValue}>1</Text>
            <Text style={styles.statLabel}>Alert</Text>
          </View>
        </View>

        {/* Student List */}
        <Text style={styles.sectionTitle}>Students Overview</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {mockStudents.map(student => (
            <TouchableOpacity 
              key={student.id} 
              style={[
                styles.studentTab, 
                selectedStudent.id === student.id && styles.activeStudentTab
              ]}
              onPress={() => setSelectedStudent(student)}
            >
              <View style={[styles.indicator, { backgroundColor: profileColors[student.profile] }]} />
              <Text style={[
                styles.studentTabText,
                selectedStudent.id === student.id && styles.activeStudentTabText
              ]}>{student.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Detail Card */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={styles.detailName}>{selectedStudent.name}</Text>
              <Text style={[styles.profileTag, { color: profileColors[selectedStudent.profile] }]}>
                {selectedStudent.profile} Profile
              </Text>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>{selectedStudent.progress}%</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* AI Insight Section */}
          <View style={styles.insightSection}>
            <View style={styles.insightHeaderRow}>
              <Text style={styles.insightTitle}>✨ AI Diagnostic</Text>
              {isGenerating && <ActivityIndicator size="small" color="#6366f1" />}
            </View>
            <View style={styles.insightBox}>
              {isGenerating ? (
                <Text style={styles.loadingText}>Gemini is analyzing performance...</Text>
              ) : (
                <Text style={styles.insightText}>&quot;{insight}&quot;</Text>
              )}
            </View>
          </View>

          {/* Metrics */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Current Topic</Text>
              <Text style={styles.metricValue}>{selectedStudent.topic}</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricLabel}>Time Spent</Text>
              <Text style={styles.metricValue}>{selectedStudent.timeSpent}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.actionBtn}
            onPress={() => alert('Sending notification to Parent app...')}
          >
            <Text style={styles.actionBtnText}>Send Update to Parent</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 16, color: '#64748b', marginTop: 4 },
  
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: { flex: 1, padding: 16, borderRadius: 20, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: 12, color: '#64748b', marginTop: 2 },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#334155', marginBottom: 16 },
  horizontalScroll: { marginBottom: 20, marginHorizontal: -20, paddingHorizontal: 20 },
  studentTab: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 99, 
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeStudentTab: { backgroundColor: '#1e293b', borderColor: '#1e293b' },
  indicator: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  studentTabText: { fontWeight: '600', color: '#64748b' },
  activeStudentTabText: { color: '#fff' },

  detailCard: { 
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
  },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detailName: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  profileTag: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  progressCircle: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    borderWidth: 4, 
    borderColor: '#e2e8f0', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderTopColor: '#3b82f6',
  },
  progressText: { fontWeight: '800', color: '#1e293b' },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 20 },

  insightSection: { marginBottom: 24 },
  insightHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  insightTitle: { fontSize: 16, fontWeight: '700', color: '#6366f1' },
  insightBox: { backgroundColor: '#f5f3ff', borderRadius: 16, padding: 16, borderLeftWidth: 4, borderLeftColor: '#6366f1' },
  insightText: { fontSize: 15, color: '#4c1d95', fontStyle: 'italic', lineHeight: 22 },
  loadingText: { fontSize: 14, color: '#6366f1', fontStyle: 'italic' },

  metricsGrid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  metricItem: { flex: 1, backgroundColor: '#f8fafc', padding: 16, borderRadius: 16 },
  metricLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  metricValue: { fontSize: 15, fontWeight: '700', color: '#1e293b' },

  actionBtn: { 
    backgroundColor: '#1e293b', 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center' 
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
