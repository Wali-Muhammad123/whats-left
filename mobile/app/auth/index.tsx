import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export default function AuthLanding() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoSection}>
        <View style={styles.logoMark}>
          <Text style={styles.logoEmoji}>🥘</Text>
        </View>
        <Text style={styles.appName}>PantryPal</Text>
        <Text style={styles.tagline}>Cook smarter with what you have</Text>
      </View>

      <View style={styles.actions}>
        <Button
          label="Sign up with Email"
          onPress={() => router.push('/auth/signup-email')}
          variant="primary"
        />
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.divider} />
        </View>
        <Button
          label="Sign up with Phone"
          onPress={() => router.push('/auth/signup-phone')}
          variant="secondary"
        />
      </View>

      <View style={styles.loginRow}>
        <Text style={styles.loginPrompt}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')} activeOpacity={0.7}>
          <Text style={styles.loginLink}>Log in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: Spacing.xl,
  },
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMark: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: Colors.foundation,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoEmoji: {
    fontSize: 48,
  },
  appName: {
    fontFamily: Fonts.heading,
    fontSize: 36,
    color: Colors.foundation,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
  },
  actions: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPrompt: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
  },
  loginLink: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.primary,
  },
});
