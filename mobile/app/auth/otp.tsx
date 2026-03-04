import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useAppStore } from '@/store/app-store';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

const OTP_LENGTH = 6;

export default function OTPScreen() {
  const { phone, name } = useLocalSearchParams<{ phone: string; name: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const { setUser } = useAppStore();

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  function handleOtpChange(value: string, index: number) {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const user = { id: Date.now().toString(), name: name ?? 'User', phone };
      await AsyncStorage.setItem('authToken', 'mock-token');
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      router.replace('/onboarding/kitchen/step-ingredients');
    } finally {
      setLoading(false);
    }
  }

  function handleResend() {
    if (countdown > 0) return;
    setCountdown(60);
    setOtp(Array(OTP_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
  }

  const isComplete = otp.every((d) => d !== '');

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Verify Phone" />
      <View style={styles.content}>
        <Text style={styles.instruction}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.phone}>{phone}</Text>
        </Text>

        <View style={styles.otpRow}>
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <TextInput
              key={i}
              ref={(ref) => { inputRefs.current[i] = ref; }}
              style={[styles.otpCell, otp[i] ? styles.otpCellFilled : null]}
              value={otp[i]}
              onChangeText={(val) => handleOtpChange(val, i)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleResend}
          disabled={countdown > 0}
          activeOpacity={0.7}
          style={styles.resendButton}
        >
          <Text style={[styles.resendText, countdown > 0 && styles.resendDisabled]}>
            {countdown > 0 ? `Resend code in ${countdown}s` : 'Resend code'}
          </Text>
        </TouchableOpacity>

        <Button
          label="Verify"
          onPress={handleVerify}
          loading={loading}
          disabled={!isComplete}
          style={styles.ctaButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  instruction: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  phone: {
    fontFamily: Fonts.bodySemiBold,
    color: Colors.foundation,
  },
  otpRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  otpCell: {
    width: 48,
    height: 56,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.foundation,
    textAlign: 'center',
  },
  otpCellFilled: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  resendButton: {
    marginBottom: Spacing.xl,
  },
  resendText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.primary,
  },
  resendDisabled: {
    color: Colors.muted,
  },
  ctaButton: {
    width: '100%',
  },
});
