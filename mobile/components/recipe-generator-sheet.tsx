import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

const CUISINES = [
  { id: 'any', label: 'Any', emoji: '🌍' },
  { id: 'italian', label: 'Italian', emoji: '🍝' },
  { id: 'indian', label: 'Indian', emoji: '🍛' },
  { id: 'mexican', label: 'Mexican', emoji: '🌮' },
  { id: 'chinese', label: 'Chinese', emoji: '🥡' },
  { id: 'japanese', label: 'Japanese', emoji: '🍱' },
  { id: 'mediterranean', label: 'Mediterranean', emoji: '🫒' },
  { id: 'american', label: 'American', emoji: '🍔' },
  { id: 'thai', label: 'Thai', emoji: '🍜' },
  { id: 'middle-eastern', label: 'Middle Eastern', emoji: '🥙' },
];

const TIME_OPTIONS = [
  { id: 'under-15', label: 'Under 15 min', emoji: '⚡' },
  { id: '15-30', label: '15–30 min', emoji: '🕐' },
  { id: '30-60', label: '30–60 min', emoji: '🕑' },
  { id: '1hr+', label: '1 hr+', emoji: '🕒' },
];

interface RecipeGeneratorSheetProps {
  visible: boolean;
  onClose: () => void;
}

export function RecipeGeneratorSheet({ visible, onClose }: RecipeGeneratorSheetProps) {
  const [selectedCuisine, setSelectedCuisine] = useState('any');
  const [selectedTime, setSelectedTime] = useState('');

  function handleFindRecipes() {
    onClose();
    router.push({
      pathname: '/recipe-generator/confirm-ingredients',
      params: { cuisine: selectedCuisine, time: selectedTime },
    });
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} title="Generate a Recipe" heightPercent={80}>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>What are you in the mood for?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cuisineScroll}
        >
          {CUISINES.map((cuisine) => (
            <TouchableOpacity
              key={cuisine.id}
              onPress={() => setSelectedCuisine(cuisine.id)}
              activeOpacity={0.8}
              style={[
                styles.cuisineChip,
                selectedCuisine === cuisine.id && styles.cuisineChipSelected,
              ]}
            >
              <Text style={styles.cuisineEmoji}>{cuisine.emoji}</Text>
              <Text
                style={[
                  styles.cuisineLabel,
                  selectedCuisine === cuisine.id && styles.cuisineLabelSelected,
                ]}
              >
                {cuisine.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>How much time do you have?</Text>
        <View style={styles.timeGrid}>
          {TIME_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSelectedTime(option.id)}
              activeOpacity={0.8}
              style={[
                styles.timeChip,
                selectedTime === option.id && styles.timeChipSelected,
              ]}
            >
              <Text style={styles.timeEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.timeLabel,
                  selectedTime === option.id && styles.timeLabelSelected,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Button
        label="Find Recipes"
        onPress={handleFindRecipes}
        disabled={!selectedTime}
        style={styles.ctaButton}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: Colors.foundation,
    marginBottom: Spacing.md,
  },
  cuisineScroll: {
    gap: Spacing.sm,
    paddingRight: Spacing.md,
  },
  cuisineChip: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    minWidth: 72,
  },
  cuisineChipSelected: {
    backgroundColor: `${Colors.primary}15`,
    borderColor: Colors.primary,
  },
  cuisineEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  cuisineLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.muted,
    textAlign: 'center',
  },
  cuisineLabelSelected: {
    color: Colors.primary,
    fontFamily: Fonts.bodySemiBold,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  timeChipSelected: {
    backgroundColor: `${Colors.primary}15`,
    borderColor: Colors.primary,
  },
  timeEmoji: {
    fontSize: 16,
  },
  timeLabel: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.foundation,
  },
  timeLabelSelected: {
    color: Colors.primary,
    fontFamily: Fonts.bodySemiBold,
  },
  ctaButton: {
    marginTop: Spacing.sm,
  },
});
