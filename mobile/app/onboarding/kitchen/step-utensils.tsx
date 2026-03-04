import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { KitchenProgress } from '@/components/ui/kitchen-progress';
import { useGetKitchenOptionsQuery, useGetKitchenQuery, useUpdateKitchenMutation } from '@/store/apiSlice';
import { Colors, Fonts, Radius, Shadow, Spacing } from '@/constants/theme';

const UTENSIL_LABELS: Record<string, string> = {
  pan: 'Pan', pot: 'Pot', oven: 'Oven', microwave: 'Microwave', 'air-fryer': 'Air Fryer',
  blender: 'Blender', knife: 'Knife', 'cutting-board': 'Cutting Board', wok: 'Wok', steamer: 'Steamer',
  grill: 'Grill', mixer: 'Mixer', 'pressure-cooker': 'Pressure Cooker', toaster: 'Toaster',
  colander: 'Colander', 'baking-sheet': 'Baking Sheet',
};
const UTENSIL_EMOJIS: Record<string, string> = {
  pan: '🍳', pot: '🫕', oven: '🔥', microwave: '📡', 'air-fryer': '💨', blender: '🥤', knife: '🔪',
  'cutting-board': '🪵', wok: '🥘', steamer: '♨️', grill: '🥩', mixer: '🎂', 'pressure-cooker': '⚡',
  toaster: '🍞', colander: '🫙', 'baking-sheet': '🍪',
};

export default function StepUtensils() {
  const [selected, setSelected] = useState<string[]>([]);
  const { data: options, isLoading: optionsLoading } = useGetKitchenOptionsQuery();
  const { data: kitchen } = useGetKitchenQuery();
  const [updateKitchen, { isLoading: updating }] = useUpdateKitchenMutation();

  useEffect(() => {
    if (kitchen?.utensils) setSelected(kitchen.utensils);
  }, [kitchen?.utensils]);

  function toggleUtensil(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  async function handleNext() {
    try {
      await updateKitchen({ utensils: selected }).unwrap();
      router.push('/onboarding/kitchen/step-dietary');
    } catch {
      // Could show toast
    }
  }

  const utensilIds = options?.utensil_ids ?? [];

  if (optionsLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
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
        {utensilIds.map((id) => {
          const isSelected = selected.includes(id);
          return (
            <TouchableOpacity
              key={id}
              onPress={() => toggleUtensil(id)}
              activeOpacity={0.8}
              style={[styles.card, isSelected && styles.cardSelected, Shadow.sm]}
            >
              {isSelected && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
              <Text style={styles.cardEmoji}>{UTENSIL_EMOJIS[id] ?? '🍴'}</Text>
              <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                {UTENSIL_LABELS[id] ?? id}
              </Text>
            </TouchableOpacity>
          );
        })}
        <View style={styles.bottomPad} />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label="Next: Dietary Preferences"
          onPress={handleNext}
          loading={updating}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
