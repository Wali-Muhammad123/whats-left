import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useAppStore } from '@/store/app-store';
import { Colors, Fonts, Spacing } from '@/constants/theme';

interface FormErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const { setUser, setHasCompletedKitchenSetup } = useAppStore();

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!identifier.trim()) newErrors.identifier = 'Email or phone is required';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const user = { id: '1', name: 'User', email: identifier };
      await AsyncStorage.setItem('authToken', 'mock-token');
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);

      const kitchenDone = await AsyncStorage.getItem('hasCompletedKitchenSetup');
      if (kitchenDone === 'true') {
        setHasCompletedKitchenSetup(true);
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding/kitchen/step-ingredients');
      }
    } catch {
      setErrors({ general: 'Invalid credentials. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Welcome Back" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>Sign in to your account</Text>

          {errors.general && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          )}

          <Input
            label="Email or Phone"
            placeholder="jane@example.com or +1234567890"
            value={identifier}
            onChangeText={setIdentifier}
            error={errors.identifier}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <View style={styles.passwordLabelRow}>
            <Text style={styles.passwordLabel}>Password</Text>
            <TouchableOpacity onPress={() => router.push('/auth/forgot-password')} activeOpacity={0.7}>
              <Text style={styles.forgotLink}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <Input
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            isPassword
          />

          <Button
            label="Log In"
            onPress={handleLogin}
            loading={loading}
            style={styles.ctaButton}
          />

          <View style={styles.signupRow}>
            <Text style={styles.signupPrompt}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.replace('/auth')} activeOpacity={0.7}>
              <Text style={styles.signupLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingBottom: Spacing.xxl,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.muted,
    marginBottom: Spacing.xl,
  },
  errorBanner: {
    backgroundColor: `${Colors.error}15`,
    borderRadius: 10,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  errorBannerText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.error,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  passwordLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.foundation,
  },
  forgotLink: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.primary,
  },
  ctaButton: {
    marginTop: Spacing.md,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  signupPrompt: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
  },
  signupLink: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.primary,
  },
});
