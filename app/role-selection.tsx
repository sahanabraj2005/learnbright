import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useRole, UserRole } from '@/context/RoleContext';

export default function RoleSelectionScreen() {
  const { setRole } = useRole();
  const router = useRouter();

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Your Role</Text>
        <Text style={styles.subtitle}>Choose how you want to use LearnBright</Text>

        <TouchableOpacity 
          style={[styles.roleCard, { borderColor: '#7c3aed' }]} 
          onPress={() => handleRoleSelect('Student')}
        >
          <Text style={styles.roleIcon}>🎓</Text>
          <View>
            <Text style={styles.roleName}>Student</Text>
            <Text style={styles.roleDescription}>Access lessons and assessments</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleCard, { borderColor: '#10b981' }]} 
          onPress={() => handleRoleSelect('Teacher')}
        >
          <Text style={styles.roleIcon}>👨‍🏫</Text>
          <View>
            <Text style={styles.roleName}>Teacher</Text>
            <Text style={styles.roleDescription}>Manage classes and view reports</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.roleCard, { borderColor: '#3b82f6' }]} 
          onPress={() => handleRoleSelect('Parent')}
        >
          <Text style={styles.roleIcon}>👨‍👩‍👧</Text>
          <View>
            <Text style={styles.roleName}>Parent</Text>
            <Text style={styles.roleDescription}>Track your child's progress</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 40,
    textAlign: 'center',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 20,
    backgroundColor: '#f9fafb',
  },
  roleIcon: {
    fontSize: 40,
    marginRight: 20,
  },
  roleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  roleDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});
