import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScreenHeader } from '@/components/ui/screen-header';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

interface FormErrors {
  phone?: string;
  name?: string;
  password?: string;
}

const COUNTRY_CODES = ['+1', '+44', '+91', '+92', '+971', '+966', '+61', '+49', '+33'];

export default function SignupPhone() {
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showCodePicker, setShowCodePicker] = useState(false);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!phone.trim() || phone.length < 7) newErrors.phone = 'Enter a valid phone number';
    if (!name.trim()) newErrors.name = 'Full name is required';
    if (!password || password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSendOTP() {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    router.push({ pathname: '/auth/otp', params: { phone: `${countryCode}${phone}`, name } });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Sign Up with Phone" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.subtitle}>We'll send a verification code</Text>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.phoneRow}>
            <TouchableOpacity
              style={styles.countryCodeButton}
              onPress={() => setShowCodePicker(!showCodePicker)}
              activeOpacity={0.8}
            >
              <Text style={styles.countryCodeText}>{countryCode}</Text>
              <Text style={styles.chevron}>▾</Text>
            </TouchableOpacity>
            <View style={styles.phoneInputWrapper}>
              <Input
                placeholder="Phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                containerStyle={styles.phoneInput}
                error={errors.phone}
              />
            </View>
          </View>

          {showCodePicker && (
            <View style={styles.codePicker}>
              {COUNTRY_CODES.map((code) => (
                <TouchableOpacity
                  key={code}
                  style={styles.codeOption}
                  onPress={() => { setCountryCode(code); setShowCodePicker(false); }}
                >
                  <Text style={styles.codeOptionText}>{code}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Input
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChangeText={setName}
            error={errors.name}
            autoCapitalize="words"
          />
          <Input
            label="Password"
            placeholder="Min. 8 characters"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            isPassword
          />

          <Button
            label="Send OTP"
            onPress={handleSendOTP}
            loading={loading}
            style={styles.ctaButton}
          />
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
  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.foundation,
    marginBottom: Spacing.xs,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    gap: Spacing.xs,
  },
  countryCodeText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    color: Colors.foundation,
  },
  chevron: {
    fontSize: 12,
    color: Colors.muted,
  },
  phoneInputWrapper: {
    flex: 1,
  },
  phoneInput: {
    marginBottom: 0,
  },
  codePicker: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  codeOption: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  codeOptionText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.foundation,
  },
  ctaButton: {
    marginTop: Spacing.md,
  },
});
