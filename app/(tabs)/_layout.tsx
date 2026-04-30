import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useRole } from '@/context/RoleContext';

export default function TabLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { role, setRole, userName, userEmail } = useRole();

  return (
    <>
      {/* Global Hamburger Menu — only shown after login */}
      {role && (
        <View style={styles.hamburgerContainer} pointerEvents="box-none">
          <TouchableOpacity style={styles.hamburgerBtn} onPress={() => setIsMenuOpen(true)}>
            <Text style={styles.hamburgerIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Side Menu Modal */}
      <Modal visible={isMenuOpen} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsMenuOpen(false)}
        />
        <View style={styles.drawer}>
          {/* User info */}
          <View style={styles.drawerHeader}>
            <View style={styles.drawerAvatar}>
              <Text style={styles.drawerAvatarText}>
                {role === 'Student' ? '🎓' : role === 'Teacher' ? '👨‍🏫' : '👨‍👩‍👧'}
              </Text>
            </View>
            <Text style={styles.drawerName}>{userName || 'User'}</Text>
            <Text style={styles.drawerEmail}>{userEmail || ''}</Text>
            <View style={styles.drawerRoleBadge}>
              <Text style={styles.drawerRoleBadgeText}>{role}</Text>
            </View>
          </View>

          <View style={styles.drawerDivider} />

          {/* Role switcher */}
          <Text style={styles.drawerSectionLabel}>SWITCH ROLE</Text>
          <View style={styles.roleGrid}>
            {(['Student', 'Teacher', 'Parent'] as const).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleChip, role === r && styles.roleChipActive]}
                onPress={() => { setRole(r); setIsMenuOpen(false); }}
                activeOpacity={0.8}
              >
                <Text style={styles.roleChipEmoji}>
                  {r === 'Student' ? '🎓' : r === 'Teacher' ? '👨‍🏫' : '👨‍👩‍👧'}
                </Text>
                <Text style={[styles.roleChipText, role === r && styles.roleChipTextActive]}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.drawerDivider} />

          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={() => {
              setIsMenuOpen(false);
              setRole(null);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.signOutIcon}>🚪</Text>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBtn} onPress={() => setIsMenuOpen(false)}>
            <Text style={styles.closeBtnText}>Close Menu</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#7c3aed',
          tabBarInactiveTintColor: '#9ca3af',
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopColor: '#f1f5f9',
            borderTopWidth: 1,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="learn"
          options={{
            title: 'Learn',
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="book.fill" color={color} />,
            href: null,
          }}
        />
        <Tabs.Screen
          name="assessment"
          options={{
            title: 'Assessment',
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="pencil.and.outline" color={color} />,
            href: null,
          }}
        />
        <Tabs.Screen
          name="teacher"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  hamburgerContainer: {
    position: 'absolute',
    top: 52,
    left: 16,
    zIndex: 999,
    elevation: 999,
  },
  hamburgerBtn: {
    backgroundColor: '#ffffff',
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  hamburgerIcon: {
    fontSize: 20,
    color: '#7c3aed',
  },

  // Modal backdrop
  modalBackdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  // Drawer
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '78%',
    backgroundColor: '#ffffff',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 20,
  },
  drawerHeader: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  drawerAvatar: {
    width: 72, height: 72,
    backgroundColor: '#f5f3ff',
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  drawerAvatarText: { fontSize: 36 },
  drawerName: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  drawerEmail: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  drawerRoleBadge: {
    backgroundColor: '#ede9fe',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  drawerRoleBadgeText: { color: '#7c3aed', fontWeight: '700', fontSize: 13 },

  drawerDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 20,
  },
  drawerSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginBottom: 14,
  },

  // Role grid
  roleGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  roleChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  roleChipActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#f5f3ff',
  },
  roleChipEmoji: { fontSize: 20, marginBottom: 4 },
  roleChipText: { fontSize: 11, fontWeight: '600', color: '#64748b' },
  roleChipTextActive: { color: '#7c3aed' },

  closeBtn: {
    backgroundColor: '#7c3aed',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  closeBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    backgroundColor: '#fff5f5',
    marginBottom: 10,
  },
  signOutIcon: { fontSize: 18 },
  signOutText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
});
