import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '@/store/app-store';
import { Colors, Fonts, Radius, Shadow, Spacing } from '@/constants/theme';

const CATEGORIES = ['All', 'Proteins', 'Vegetables', 'Grains', 'Dairy', 'Spices'];

const CATEGORY_MAP: Record<string, string[]> = {
  Proteins: ['Chicken', 'Beef', 'Eggs', 'Tofu', 'Salmon', 'Shrimp', 'Lentils', 'Chickpeas'],
  Vegetables: ['Onion', 'Garlic', 'Tomato', 'Spinach', 'Carrot', 'Bell Pepper', 'Broccoli', 'Potato'],
  Grains: ['Rice', 'Pasta', 'Bread', 'Oats', 'Quinoa', 'Flour', 'Noodles'],
  Dairy: ['Milk', 'Butter', 'Cheese', 'Yogurt', 'Cream', 'Sour Cream'],
  Spices: ['Salt', 'Pepper', 'Cumin', 'Paprika', 'Turmeric', 'Oregano', 'Chili Flakes', 'Cinnamon'],
};

function getCategoryForIngredient(ingredient: string): string {
  for (const [cat, items] of Object.entries(CATEGORY_MAP)) {
    if (items.includes(ingredient)) return cat;
  }
  return 'Other';
}

export default function PantryScreen() {
  const { ingredients, setIngredients } = useAppStore();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = ingredients.filter((ing) => {
    const matchesSearch = ing.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' || getCategoryForIngredient(ing) === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const grouped = CATEGORIES.slice(1).reduce<Record<string, string[]>>((acc, cat) => {
    const items = filtered.filter((i) => getCategoryForIngredient(i) === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  const otherItems = filtered.filter((i) => getCategoryForIngredient(i) === 'Other');
  if (otherItems.length > 0) grouped['Other'] = otherItems;

  function removeIngredient(item: string) {
    setIngredients(ingredients.filter((i) => i !== item));
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pantry</Text>
        <Text style={styles.subtitle}>{ingredients.length} ingredients</Text>
      </View>

      {/* Search */}
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

      {/* Category filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        style={styles.categoryBar}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            activeOpacity={0.8}
            style={[styles.categoryChip, activeCategory === cat && styles.categoryChipActive]}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Ingredient list */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {ingredients.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🧺</Text>
            <Text style={styles.emptyTitle}>Your pantry is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add ingredients to get personalized recipe suggestions
            </Text>
          </View>
        ) : Object.keys(grouped).length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>No results</Text>
            <Text style={styles.emptySubtitle}>Try a different search term</Text>
          </View>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <View key={category} style={styles.group}>
              <Text style={styles.groupLabel}>{category}</Text>
              {items.map((item) => (
                <View key={item} style={[styles.ingredientRow, Shadow.sm]}>
                  <Text style={styles.ingredientEmoji}>
                    {category === 'Proteins' ? '🥩' :
                     category === 'Vegetables' ? '🥦' :
                     category === 'Grains' ? '🌾' :
                     category === 'Dairy' ? '🥛' :
                     category === 'Spices' ? '🌶' : '📦'}
                  </Text>
                  <Text style={styles.ingredientName}>{item}</Text>
                  <TouchableOpacity
                    onPress={() => removeIngredient(item)}
                    style={styles.removeBtn}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        )}
        <View style={styles.bottomPad} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    paddingBottom: Spacing.sm,
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.xl,
    marginVertical: Spacing.md,
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
  categoryBar: {
    flexGrow: 0,
    marginBottom: Spacing.sm,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs + 2,
  },
  categoryChip: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.foundation,
  },
  categoryTextActive: {
    color: Colors.white,
    fontFamily: Fonts.bodySemiBold,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  group: {
    marginBottom: Spacing.lg,
  },
  groupLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xs + 2,
    gap: Spacing.md,
  },
  ingredientEmoji: {
    fontSize: 20,
  },
  ingredientName: {
    flex: 1,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.foundation,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    fontSize: 12,
    color: Colors.muted,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xxl * 2,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.foundation,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.lg,
  },
  bottomPad: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.lg,
  },
  fabText: {
    fontSize: 28,
    color: Colors.white,
    lineHeight: 32,
  },
});
