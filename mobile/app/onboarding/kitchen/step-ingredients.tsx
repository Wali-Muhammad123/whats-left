import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { KitchenProgress } from '@/components/ui/kitchen-progress';
import { useAppStore } from '@/store/app-store';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

const INGREDIENT_GROUPS: { label: string; items: string[] }[] = [
  {
    label: 'Proteins',
    items: ['Chicken', 'Beef', 'Eggs', 'Tofu', 'Salmon', 'Shrimp', 'Lentils', 'Chickpeas'],
  },
  {
    label: 'Vegetables',
    items: ['Onion', 'Garlic', 'Tomato', 'Spinach', 'Carrot', 'Bell Pepper', 'Broccoli', 'Potato'],
  },
  {
    label: 'Grains',
    items: ['Rice', 'Pasta', 'Bread', 'Oats', 'Quinoa', 'Flour', 'Noodles'],
  },
  {
    label: 'Dairy',
    items: ['Milk', 'Butter', 'Cheese', 'Yogurt', 'Cream', 'Sour Cream'],
  },
  {
    label: 'Spices',
    items: ['Salt', 'Pepper', 'Cumin', 'Paprika', 'Turmeric', 'Oregano', 'Chili Flakes', 'Cinnamon'],
  },
];

export default function StepIngredients() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const { setIngredients } = useAppStore();

  function toggleIngredient(item: string) {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  function handleNext() {
    setIngredients(selected);
    router.push('/onboarding/kitchen/step-utensils');
  }

  const filteredGroups = INGREDIENT_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((g) => g.items.length > 0);

  return (
    <SafeAreaView style={styles.container}>
      <KitchenProgress total={4} current={1} />

      <View style={styles.header}>
        <Text style={styles.stepLabel}>Step 1 of 4</Text>
        <Text style={styles.title}>What's in your pantry?</Text>
        <Text style={styles.subtitle}>Select all the ingredients you currently have</Text>
      </View>

      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search ingredients..."
          placeholderTextColor={Colors.muted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      >
        {filteredGroups.map((group) => (
          <View key={group.label} style={styles.group}>
            <Text style={styles.groupLabel}>{group.label}</Text>
            <View style={styles.chipsRow}>
              {group.items.map((item) => {
                const isSelected = selected.includes(item);
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => toggleIngredient(item)}
                    activeOpacity={0.75}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {isSelected ? `✓ ${item}` : item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
        <View style={styles.bottomPad} />
      </ScrollView>

      {selected.length > 0 && (
        <View style={styles.selectionTray}>
          <Text style={styles.trayLabel}>{selected.length} selected</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.trayScroll}>
            {selected.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleIngredient(item)}
                style={styles.trayChip}
                activeOpacity={0.75}
              >
                <Text style={styles.trayChipText}>{item} ✕</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.footer}>
        <Button
          label="Next: Utensils"
          onPress={handleNext}
          disabled={selected.length === 0}
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.foundation,
    paddingVertical: Spacing.sm + 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
  },
  group: {
    marginBottom: Spacing.lg,
  },
  groupLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
  },
  chip: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  chipText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.foundation,
  },
  chipTextSelected: {
    color: Colors.white,
    fontFamily: Fonts.bodySemiBold,
  },
  bottomPad: {
    height: Spacing.xxl,
  },
  selectionTray: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  trayLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  trayScroll: {
    flexGrow: 0,
  },
  trayChip: {
    backgroundColor: `${Colors.primary}15`,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm + 2,
    marginRight: Spacing.xs,
  },
  trayChipText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.primary,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.background,
  },
});
