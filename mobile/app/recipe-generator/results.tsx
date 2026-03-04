import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipeCard, RecipeCardData } from '@/components/ui/recipe-card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

function toRecipeCardData(r: { id: string; title: string; cuisine: string; prep_time: string; match_percent?: number | null; image_url?: string | null }): RecipeCardData {
  return {
    id: r.id,
    title: r.title,
    cuisine: r.cuisine,
    prepTime: r.prep_time,
    matchPercent: r.match_percent ?? undefined,
    imageUrl: r.image_url ?? undefined,
  };
}

type SortOption = 'match' | 'time' | 'name';

export default function RecipeResults() {
  const { cuisine } = useLocalSearchParams<{ cuisine: string; time: string }>();
  const lastGenerated = useAppSelector((s) => s.recipeGenerator.lastGeneratedRecipes);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [dietaryFilter, setDietaryFilter] = useState<string[]>([]);

  const baseResults: RecipeCardData[] = useMemo(
    () => lastGenerated.map((r) => ({ ...toRecipeCardData(r), saved: savedRecipes.includes(r.id) })),
    [lastGenerated, savedRecipes]
  );

  const cuisineLabel =
    cuisine === 'any'
      ? 'Any Cuisine'
      : (cuisine?.charAt(0).toUpperCase() ?? '') + (cuisine?.slice(1) ?? '');

  function toggleSave(id: string) {
    setSavedRecipes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }

  function toggleDietary(id: string) {
    setDietaryFilter((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  const sortedResults = [...baseResults].sort((a, b) => {
    if (sortBy === 'match') return (b.matchPercent ?? 0) - (a.matchPercent ?? 0);
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  const renderItem: ListRenderItem<RecipeCardData> = ({ item }) => (
    <RecipeCard
      recipe={{ ...item, saved: savedRecipes.includes(item.id) }}
      onPress={() => router.push(`/recipe/${item.id}`)}
      onSave={() => toggleSave(item.id)}
      variant="horizontal"
    />
  );

  const ListHeader = (
    <View style={styles.listHeader}>
      <Text style={styles.resultCount}>{sortedResults.length} recipes found</Text>
    </View>
  );

  const ListEmpty = (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🍽</Text>
      <Text style={styles.emptyTitle}>No recipes found</Text>
      <Text style={styles.emptySubtitle}>
        Try a different cuisine or add more ingredients to your pantry
      </Text>
      <Button
        label="Update Pantry"
        onPress={() => router.push('/(tabs)/pantry')}
        variant="secondary"
        fullWidth={false}
        style={styles.emptyButton}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title={`Results for ${cuisineLabel}`}
        rightElement={
          <TouchableOpacity
            onPress={() => setFilterVisible(true)}
            style={styles.filterButton}
            activeOpacity={0.7}
          >
            <Text style={styles.filterIcon}>⚙️</Text>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={sortedResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <BottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        title="Filter & Sort"
        heightPercent={60}
      >
        <Text style={styles.filterSectionLabel}>Sort by</Text>
        <View style={styles.sortOptions}>
          {([
            { id: 'match', label: '🎯 Best Match' },
            { id: 'time', label: '⏱ Prep Time' },
            { id: 'name', label: '🔤 Name' },
          ] as { id: SortOption; label: string }[]).map((opt) => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setSortBy(opt.id)}
              activeOpacity={0.8}
              style={[styles.sortChip, sortBy === opt.id && styles.sortChipSelected]}
            >
              <Text style={[styles.sortChipText, sortBy === opt.id && styles.sortChipTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.filterSectionLabel}>Dietary</Text>
        <View style={styles.sortOptions}>
          {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => toggleDietary(d)}
              activeOpacity={0.8}
              style={[styles.sortChip, dietaryFilter.includes(d) && styles.sortChipSelected]}
            >
              <Text
                style={[
                  styles.sortChipText,
                  dietaryFilter.includes(d) && styles.sortChipTextSelected,
                ]}
              >
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button
          label="Apply Filters"
          onPress={() => setFilterVisible(false)}
          style={styles.applyButton}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  listHeader: {
    paddingVertical: Spacing.md,
  },
  resultCount: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.muted,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing.xxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
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
    marginBottom: Spacing.xl,
  },
  emptyButton: {
    paddingHorizontal: Spacing.xl,
  },
  filterSectionLabel: {
    fontFamily: Fonts.heading,
    fontSize: 15,
    color: Colors.foundation,
    marginBottom: Spacing.sm,
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  sortChip: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  sortChipSelected: {
    backgroundColor: `${Colors.primary}15`,
    borderColor: Colors.primary,
  },
  sortChipText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.foundation,
  },
  sortChipTextSelected: {
    color: Colors.primary,
    fontFamily: Fonts.bodySemiBold,
  },
  applyButton: {
    marginTop: Spacing.sm,
  },
});
