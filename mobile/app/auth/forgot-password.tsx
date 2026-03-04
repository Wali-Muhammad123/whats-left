import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Colors, Fonts, Spacing } from '@/constants/theme';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSendReset() {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email');
      return;
    }
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Check Your Inbox" />
        <View style={styles.successContent}>
          <Text style={styles.successEmoji}>📬</Text>
          <Text style={styles.successTitle}>Email Sent!</Text>
          <Text style={styles.successBody}>
            We've sent a password reset link to{'\n'}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>
          <Text style={styles.successHint}>
            Check your spam folder if you don't see it within a few minutes.
          </Text>
          <Button
            label="Back to Login"
            onPress={() => router.replace('/auth/login')}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Reset Password" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            Enter your email and we'll send you a link to reset your password.
          </Text>
          <Input
            label="Email"
            placeholder="jane@example.com"
            value={email}
            onChangeText={setEmail}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Button
            label="Send Reset Link"
            onPress={handleSendReset}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.muted,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  successEmoji: {
    fontSize: 72,
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    color: Colors.foundation,
    marginBottom: Spacing.md,
  },
  successBody: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  emailHighlight: {
    fontFamily: Fonts.bodySemiBold,
    color: Colors.foundation,
  },
  successHint: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xxl,
  },
  backButton: {
    width: '100%',
  },
});
