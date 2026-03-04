import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { KitchenProgress } from '@/components/ui/kitchen-progress';
import { useAppStore } from '@/store/app-store';
import { Colors, Fonts, Radius, Shadow, Spacing } from '@/constants/theme';

const UTENSILS: { id: string; emoji: string; label: string }[] = [
  { id: 'pan', emoji: '🍳', label: 'Pan' },
  { id: 'pot', emoji: '🫕', label: 'Pot' },
  { id: 'oven', emoji: '🔥', label: 'Oven' },
  { id: 'microwave', emoji: '📡', label: 'Microwave' },
  { id: 'air-fryer', emoji: '💨', label: 'Air Fryer' },
  { id: 'blender', emoji: '🥤', label: 'Blender' },
  { id: 'knife', emoji: '🔪', label: 'Knife' },
  { id: 'cutting-board', emoji: '🪵', label: 'Cutting Board' },
  { id: 'wok', emoji: '🥘', label: 'Wok' },
  { id: 'steamer', emoji: '♨️', label: 'Steamer' },
  { id: 'grill', emoji: '🥩', label: 'Grill' },
  { id: 'mixer', emoji: '🎂', label: 'Mixer' },
  { id: 'pressure-cooker', emoji: '⚡', label: 'Pressure Cooker' },
  { id: 'toaster', emoji: '🍞', label: 'Toaster' },
  { id: 'colander', emoji: '🫙', label: 'Colander' },
  { id: 'baking-sheet', emoji: '🍪', label: 'Baking Sheet' },
];

export default function StepUtensils() {
  const [selected, setSelected] = useState<string[]>([]);
  const { setUtensils } = useAppStore();

  function toggleUtensil(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function handleNext() {
    setUtensils(selected);
    router.push('/onboarding/kitchen/step-dietary');
  }

  return (
    <SafeAreaView style={styles.container}>
      <KitchenProgress total={4} current={2} />

      <View style={styles.header}>
        <Text style={styles.stepLabel}>Step 2 of 4</Text>
        <Text style={styles.title}>What do you cook with?</Text>
        <Text style={styles.subtitle}>Select the equipment you have available</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {UTENSILS.map((utensil) => {
          const isSelected = selected.includes(utensil.id);
          return (
            <TouchableOpacity
              key={utensil.id}
              onPress={() => toggleUtensil(utensil.id)}
              activeOpacity={0.8}
              style={[styles.card, isSelected && styles.cardSelected, Shadow.sm]}
            >
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
              <Text style={styles.cardEmoji}>{utensil.emoji}</Text>
              <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                {utensil.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.bottomPad} />
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Next: Dietary Preferences" onPress={handleNext} />
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  card: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}08`,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: Colors.white,
    fontSize: 11,
    fontFamily: Fonts.bodySemiBold,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  cardLabel: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
    textAlign: 'center',
  },
  cardLabelSelected: {
    color: Colors.primary,
    fontFamily: Fonts.bodySemiBold,
  },
  bottomPad: {
    width: '100%',
    height: Spacing.xxl,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
});
