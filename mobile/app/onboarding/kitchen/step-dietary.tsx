import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { KitchenProgress } from '@/components/ui/kitchen-progress';
import { useGetKitchenOptionsQuery, useGetKitchenQuery, useUpdateKitchenMutation } from '@/store/apiSlice';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

const DIETARY_META: Record<string, { label: string; emoji: string; description: string }> = {
  vegetarian: { label: 'Vegetarian', emoji: '🥦', description: 'No meat or fish' },
  vegan: { label: 'Vegan', emoji: '🌱', description: 'No animal products' },
  'gluten-free': { label: 'Gluten-Free', emoji: '🌾', description: 'No wheat, barley, rye' },
  'dairy-free': { label: 'Dairy-Free', emoji: '🥛', description: 'No milk products' },
  halal: { label: 'Halal', emoji: '☪️', description: 'Halal certified' },
  kosher: { label: 'Kosher', emoji: '✡️', description: 'Kosher certified' },
  'nut-free': { label: 'Nut-Free', emoji: '🥜', description: 'No tree nuts or peanuts' },
  'low-carb': { label: 'Low Carb', emoji: '📉', description: 'Reduced carbohydrates' },
};

export default function StepDietary() {
  const [selected, setSelected] = useState<string[]>([]);
  const { data: options, isLoading: optionsLoading } = useGetKitchenOptionsQuery();
  const { data: kitchen } = useGetKitchenQuery();
  const [updateKitchen, { isLoading: updating }] = useUpdateKitchenMutation();

  useEffect(() => {
    if (kitchen?.dietary_preferences) setSelected(kitchen.dietary_preferences);
  }, [kitchen?.dietary_preferences]);

  function toggleOption(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function goToHousehold() {
    try {
      await updateKitchen({ dietary_preferences: selected }).unwrap();
      router.push('/onboarding/kitchen/step-household');
    } catch {
      // Could show toast
    }
  }

  function handleNext() {
    goToHousehold();
  }

  async function handleSkip() {
    try {
      await updateKitchen({ dietary_preferences: [] }).unwrap();
      router.push('/onboarding/kitchen/step-household');
    } catch {
      router.push('/onboarding/kitchen/step-household');
    }
  }

  const dietaryIds = options?.dietary_ids ?? [];

  if (optionsLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KitchenProgress total={4} current={3} />

      <View style={styles.header}>
        <Text style={styles.stepLabel}>Step 3 of 4</Text>
        <Text style={styles.title}>Any dietary preferences?</Text>
        <Text style={styles.subtitle}>We'll filter recipes accordingly</Text>
      </View>

      <View style={styles.optionsGrid}>
        {dietaryIds.map((id) => {
          const meta = DIETARY_META[id] ?? { label: id, emoji: '🥗', description: '' };
          const isSelected = selected.includes(id);
          return (
            <TouchableOpacity
              key={id}
              onPress={() => toggleOption(id)}
              activeOpacity={0.8}
              style={[styles.optionCard, isSelected && styles.optionCardSelected]}
            >
              <Text style={styles.optionEmoji}>{meta.emoji}</Text>
              <View style={styles.optionText}>
                <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                  {meta.label}
                </Text>
                <Text style={styles.optionDescription}>{meta.description}</Text>
              </View>
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footer}>
        <Button
          label="Next: Household Size"
          onPress={handleNext}
          loading={updating}
        />
        <Button
          label="Skip for now"
          onPress={handleSkip}
          variant="ghost"
          style={styles.skipButton}
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
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
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
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
  },
  optionsGrid: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}08`,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.foundation,
  },
  optionLabelSelected: {
    color: Colors.primary,
  },
  optionDescription: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkboxTick: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: Fonts.bodySemiBold,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
    backgroundColor: Colors.background,
  },
  skipButton: {
    paddingVertical: Spacing.xs,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
