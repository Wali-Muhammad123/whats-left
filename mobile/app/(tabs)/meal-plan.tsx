import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Shadow, Spacing } from '@/constants/theme';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEAL_SLOTS = ['Breakfast', 'Lunch', 'Dinner'];

const SLOT_EMOJIS: Record<string, string> = {
  Breakfast: '☀️',
  Lunch: '🌤',
  Dinner: '🌙',
};

export default function MealPlanScreen() {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const [selectedDay, setSelectedDay] = useState(dayOfWeek === 0 ? 6 : dayOfWeek - 1);

  const weekDates = DAYS.map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    return d.getDate();
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal Plan</Text>
        <Text style={styles.subtitle}>Plan your week ahead</Text>
      </View>

      {/* Week strip */}
      <View style={styles.weekStrip}>
        {DAYS.map((day, i) => {
          const isSelected = i === selectedDay;
          const isToday = weekDates[i] === today.getDate();
          return (
            <TouchableOpacity
              key={day}
              onPress={() => setSelectedDay(i)}
              activeOpacity={0.8}
              style={[styles.dayCell, isSelected && styles.dayCellSelected]}
            >
              <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>{day}</Text>
              <View style={[styles.dayNumber, isToday && styles.dayNumberToday, isSelected && styles.dayNumberSelected]}>
                <Text style={[styles.dayNumberText, isSelected && styles.dayNumberTextSelected]}>
                  {weekDates[i]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Meal slots */}
      <ScrollView
        contentContainerStyle={styles.slotsContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dayHeading}>
          {DAYS[selectedDay]}, {today.toLocaleString('default', { month: 'long' })} {weekDates[selectedDay]}
        </Text>

        {MEAL_SLOTS.map((slot) => (
          <View key={slot} style={[styles.slotCard, Shadow.sm]}>
            <View style={styles.slotHeader}>
              <Text style={styles.slotEmoji}>{SLOT_EMOJIS[slot]}</Text>
              <Text style={styles.slotLabel}>{slot}</Text>
            </View>
            <TouchableOpacity style={styles.addMealButton} activeOpacity={0.8}>
              <Text style={styles.addMealIcon}>+</Text>
              <Text style={styles.addMealText}>Plan a Meal</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonEmoji}>📅</Text>
          <Text style={styles.comingSoonTitle}>Full Meal Planning Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            Auto-generate weekly meal plans based on your pantry and nutritional goals.
          </Text>
        </View>
      </ScrollView>
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
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 28,
    color: Colors.foundation,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
    marginTop: 2,
  },
  weekStrip: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.xs,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  dayCellSelected: {
    backgroundColor: `${Colors.primary}15`,
  },
  dayLabel: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.muted,
    marginBottom: Spacing.xs,
  },
  dayLabelSelected: {
    color: Colors.primary,
    fontFamily: Fonts.bodySemiBold,
  },
  dayNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumberToday: {
    backgroundColor: `${Colors.accent}30`,
  },
  dayNumberSelected: {
    backgroundColor: Colors.primary,
  },
  dayNumberText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.foundation,
  },
  dayNumberTextSelected: {
    color: Colors.white,
  },
  slotsContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  dayHeading: {
    fontFamily: Fonts.heading,
    fontSize: 18,
    color: Colors.foundation,
    marginBottom: Spacing.lg,
  },
  slotCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  slotEmoji: {
    fontSize: 20,
  },
  slotLabel: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: Colors.foundation,
  },
  addMealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    borderRadius: Radius.md,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  addMealIcon: {
    fontSize: 18,
    color: Colors.primary,
    fontFamily: Fonts.heading,
  },
  addMealText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.primary,
  },
  comingSoonCard: {
    backgroundColor: `${Colors.accent}15`,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.accent}30`,
  },
  comingSoonEmoji: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  comingSoonTitle: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: Colors.foundation,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  comingSoonText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
