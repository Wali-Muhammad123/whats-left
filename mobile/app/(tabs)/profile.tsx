import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '@/store/app-store';
import { Colors, Fonts, Radius, Shadow, Spacing } from '@/constants/theme';

interface SettingsRow {
  id: string;
  emoji: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}

export default function ProfileScreen() {
  const { user, logout, dietaryPreferences, householdSize, ingredients } = useAppStore();

  const firstName = user?.name?.split(' ')[0] ?? 'Chef';
  const initials = user?.name
    ?.split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?';

  async function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await Promise.all([
            AsyncStorage.removeItem('authToken'),
            AsyncStorage.removeItem('user'),
            AsyncStorage.removeItem('hasCompletedKitchenSetup'),
          ]);
          logout();
          router.replace('/auth');
        },
      },
    ]);
  }

  const settingsSections: { title: string; rows: SettingsRow[] }[] = [
    {
      title: 'Kitchen',
      rows: [
        {
          id: 'dietary',
          emoji: '🥗',
          label: 'Dietary Preferences',
          value: dietaryPreferences.length > 0 ? dietaryPreferences.join(', ') : 'None set',
          onPress: () => router.push('/onboarding/kitchen/step-dietary'),
        },
        {
          id: 'household',
          emoji: '👥',
          label: 'Household Size',
          value: `${householdSize} ${householdSize === 1 ? 'person' : 'people'}`,
          onPress: () => router.push('/onboarding/kitchen/step-household'),
        },
        {
          id: 'pantry',
          emoji: '🧺',
          label: 'Pantry',
          value: `${ingredients.length} ingredients`,
          onPress: () => router.push('/(tabs)/pantry'),
        },
      ],
    },
    {
      title: 'App',
      rows: [
        {
          id: 'notifications',
          emoji: '🔔',
          label: 'Notifications',
          value: 'On',
          onPress: () => {},
        },
        {
          id: 'about',
          emoji: 'ℹ️',
          label: 'About PantryPal',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Account',
      rows: [
        {
          id: 'logout',
          emoji: '🚪',
          label: 'Log Out',
          onPress: handleLogout,
          danger: true,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{user?.name ?? 'User'}</Text>
          <Text style={styles.email}>{user?.email ?? user?.phone ?? ''}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{ingredients.length}</Text>
              <Text style={styles.statLabel}>Ingredients</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{householdSize}</Text>
              <Text style={styles.statLabel}>People</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{dietaryPreferences.length}</Text>
              <Text style={styles.statLabel}>Preferences</Text>
            </View>
          </View>
        </View>

        {/* Settings sections */}
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={[styles.sectionCard, Shadow.sm]}>
              {section.rows.map((row, index) => (
                <TouchableOpacity
                  key={row.id}
                  onPress={row.onPress}
                  activeOpacity={0.8}
                  style={[
                    styles.settingsRow,
                    index < section.rows.length - 1 && styles.settingsRowBorder,
                  ]}
                >
                  <Text style={styles.rowEmoji}>{row.emoji}</Text>
                  <View style={styles.rowContent}>
                    <Text style={[styles.rowLabel, row.danger && styles.rowLabelDanger]}>
                      {row.label}
                    </Text>
                    {row.value && (
                      <Text style={styles.rowValue} numberOfLines={1}>
                        {row.value}
                      </Text>
                    )}
                  </View>
                  {!row.danger && <Text style={styles.rowArrow}>›</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.versionText}>PantryPal v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.foundation,
    marginBottom: Spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: `${Colors.white}30`,
  },
  avatarText: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    color: Colors.white,
  },
  name: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.white,
    marginBottom: 4,
  },
  email: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: `${Colors.white}80`,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.white}10`,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xl,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: `${Colors.white}70`,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: `${Colors.white}20`,
  },
  section: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  settingsRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.foundation,
  },
  rowLabelDanger: {
    color: Colors.error,
  },
  rowValue: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  rowArrow: {
    fontSize: 20,
    color: Colors.muted,
  },
  versionText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
