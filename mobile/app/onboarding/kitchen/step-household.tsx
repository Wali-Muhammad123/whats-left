import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/ui/button';
import { KitchenProgress } from '@/components/ui/kitchen-progress';
import { useAppStore } from '@/store/app-store';
import { Colors, Fonts, Radius, Shadow, Spacing } from '@/constants/theme';

export default function StepHousehold() {
  const [count, setCount] = useState(2);
  const { setHouseholdSize, setHasCompletedKitchenSetup } = useAppStore();

  function increment() {
    setCount((c) => Math.min(c + 1, 10));
  }

  function decrement() {
    setCount((c) => Math.max(c - 1, 1));
  }

  async function handleFinish() {
    setHouseholdSize(count);
    setHasCompletedKitchenSetup(true);
    await AsyncStorage.setItem('hasCompletedKitchenSetup', 'true');
    router.replace('/(tabs)');
  }

  const personLabel = count === 1 ? 'person' : 'people';

  return (
    <SafeAreaView style={styles.container}>
      <KitchenProgress total={4} current={4} />

      <View style={styles.content}>
        <Text style={styles.stepLabel}>Step 4 of 4</Text>
        <Text style={styles.title}>How many people are you cooking for?</Text>
        <Text style={styles.subtitle}>We'll adjust recipe serving sizes accordingly</Text>

        <View style={styles.stepperContainer}>
          <TouchableOpacity
            onPress={decrement}
            disabled={count <= 1}
            activeOpacity={0.7}
            style={[styles.stepperButton, count <= 1 && styles.stepperButtonDisabled]}
          >
            <Text style={[styles.stepperIcon, count <= 1 && styles.stepperIconDisabled]}>−</Text>
          </TouchableOpacity>

          <View style={styles.countDisplay}>
            <Text style={styles.countNumber}>{count}</Text>
            <Text style={styles.countLabel}>{personLabel}</Text>
          </View>

          <TouchableOpacity
            onPress={increment}
            disabled={count >= 10}
            activeOpacity={0.7}
            style={[styles.stepperButton, count >= 10 && styles.stepperButtonDisabled]}
          >
            <Text style={[styles.stepperIcon, count >= 10 && styles.stepperIconDisabled]}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.presets}>
          {[1, 2, 4, 6].map((n) => (
            <TouchableOpacity
              key={n}
              onPress={() => setCount(n)}
              activeOpacity={0.8}
              style={[styles.presetChip, count === n && styles.presetChipSelected]}
            >
              <Text style={[styles.presetText, count === n && styles.presetTextSelected]}>
                {n === 1 ? 'Just me' : `${n} people`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryEmoji}>🎉</Text>
          <Text style={styles.summaryTitle}>Almost done!</Text>
          <Text style={styles.summaryBody}>
            Your kitchen is all set. We'll generate recipes tailored to your pantry and preferences.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Finish Setup" onPress={handleFinish} />
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
    paddingTop: Spacing.md,
  },
  stepLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 26,
    color: Colors.foundation,
    marginBottom: Spacing.xs,
    lineHeight: 34,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
    marginBottom: Spacing.xxl,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  stepperButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  stepperButtonDisabled: {
    opacity: 0.35,
  },
  stepperIcon: {
    fontSize: 28,
    color: Colors.foundation,
    fontFamily: Fonts.heading,
    lineHeight: 32,
  },
  stepperIconDisabled: {
    color: Colors.muted,
  },
  countDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  countNumber: {
    fontFamily: Fonts.heading,
    fontSize: 64,
    color: Colors.primary,
    lineHeight: 72,
  },
  countLabel: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.muted,
  },
  presets: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
    flexWrap: 'wrap',
  },
  presetChip: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  presetChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.foundation,
  },
  presetTextSelected: {
    color: Colors.white,
    fontFamily: Fonts.bodySemiBold,
  },
  summaryCard: {
    backgroundColor: `${Colors.accent}20`,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: `${Colors.accent}40`,
  },
  summaryEmoji: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  summaryTitle: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    color: Colors.foundation,
    marginBottom: Spacing.xs,
  },
  summaryBody: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
});
