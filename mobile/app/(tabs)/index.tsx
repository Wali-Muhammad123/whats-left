import React, { useState } from 'react';
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
import { RecipeCard, RecipeCardData } from '@/components/ui/recipe-card';
import { RecipeGeneratorSheet } from '@/components/recipe-generator-sheet';
import { useAppSelector } from '@/store/hooks';
import { useGetKitchenQuery, useListRecipesQuery } from '@/store/apiSlice';
import { Colors, Fonts, Radius, Shadow, Spacing } from '@/constants/theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function isPantryStale(lastUpdated: string | null): boolean {
  if (!lastUpdated) return false;
  const t = new Date(lastUpdated).getTime();
  const daysSince = (Date.now() - t) / (1000 * 60 * 60 * 24);
  return daysSince > 7;
}

function toRecipeCardData(r: { id: string; title: string; cuisine: string; prep_time: string; match_percent?: number | null; image_url?: string | null; saved?: boolean }): RecipeCardData {
  return {
    id: r.id,
    title: r.title,
    cuisine: r.cuisine,
    prepTime: r.prep_time,
    matchPercent: r.match_percent ?? undefined,
    imageUrl: r.image_url ?? undefined,
    saved: r.saved,
  };
}

export default function HomeScreen() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: kitchen } = useGetKitchenQuery();
  const { data: quickPicksList, isLoading: loadingRecipes } = useListRecipesQuery({ limit: 4 });
  const [generatorVisible, setGeneratorVisible] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);

  const greeting = getGreeting();
  const firstName = user?.name?.split(' ')[0] ?? 'Chef';
  const pantryLastUpdated = kitchen?.pantry_last_updated ?? null;
  const showPantryAlert = isPantryStale(pantryLastUpdated);
  const ingredients = kitchen?.ingredients ?? [];
  const quickPicks: RecipeCardData[] = (quickPicksList ?? []).map((r) => ({
    ...toRecipeCardData(r),
    saved: savedRecipes.includes(r.id),
  }));

  function toggleSave(id: string) {
    setSavedRecipes((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.name}>{firstName} 👋</Text>
            <Text style={styles.subtitle}>What are you cooking today?</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push('/(tabs)/profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        {/* Pantry Alert */}
        {showPantryAlert && (
          <TouchableOpacity
            style={styles.pantryAlert}
            onPress={() => router.push('/(tabs)/pantry')}
            activeOpacity={0.85}
          >
            <Text style={styles.pantryAlertIcon}>🔔</Text>
            <View style={styles.pantryAlertText}>
              <Text style={styles.pantryAlertTitle}>Pantry needs updating</Text>
              <Text style={styles.pantryAlertSubtitle}>Last updated over 7 days ago</Text>
            </View>
            <Text style={styles.pantryAlertArrow}>→</Text>
          </TouchableOpacity>
        )}

        {/* Generate Recipe Card */}
        <TouchableOpacity
          style={styles.generateCard}
          onPress={() => setGeneratorVisible(true)}
          activeOpacity={0.9}
        >
          <View style={styles.generateCardLeft}>
            <Text style={styles.generateCardEmoji}>✨</Text>
            <View>
              <Text style={styles.generateCardTitle}>Generate a Recipe</Text>
              <Text style={styles.generateCardSubtitle}>
                Based on your pantry · {ingredients.length} ingredients
              </Text>
            </View>
          </View>
          <View style={styles.generateCardArrow}>
            <Text style={styles.generateCardArrowText}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Quick Picks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Picks</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {loadingRecipes ? (
              <View style={styles.quickPicksLoading}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : (
              quickPicks.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onPress={() => router.push(`/recipe/${recipe.id}`)}
                  onSave={() => toggleSave(recipe.id)}
                  variant="vertical"
                />
              ))
            )}
          </ScrollView>
        </View>

        {/* Explore Cuisines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Cuisines</Text>
          <View style={styles.cuisineGrid}>
            {[
              { label: 'Italian', emoji: '🍝' },
              { label: 'Indian', emoji: '🍛' },
              { label: 'Mexican', emoji: '🌮' },
              { label: 'Japanese', emoji: '🍱' },
              { label: 'Chinese', emoji: '🥡' },
              { label: 'Thai', emoji: '🍜' },
            ].map((cuisine) => (
              <TouchableOpacity
                key={cuisine.label}
                style={styles.cuisineChip}
                onPress={() => setGeneratorVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.cuisineEmoji}>{cuisine.emoji}</Text>
                <Text style={styles.cuisineLabel}>{cuisine.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <RecipeGeneratorSheet
        visible={generatorVisible}
        onClose={() => setGeneratorVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.muted,
  },
  name: {
    fontFamily: Fonts.heading,
    fontSize: 26,
    color: Colors.foundation,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  avatarText: {
    fontFamily: Fonts.heading,
    fontSize: 18,
    color: Colors.white,
  },
  pantryAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.accent}20`,
    borderRadius: Radius.md,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.accent}50`,
    gap: Spacing.md,
  },
  pantryAlertIcon: {
    fontSize: 20,
  },
  pantryAlertText: {
    flex: 1,
  },
  pantryAlertTitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.foundation,
  },
  pantryAlertSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
  },
  pantryAlertArrow: {
    fontSize: 16,
    color: Colors.accent,
  },
  generateCard: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.primary,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.md,
  },
  generateCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  generateCardEmoji: {
    fontSize: 32,
  },
  generateCardTitle: {
    fontFamily: Fonts.heading,
    fontSize: 18,
    color: Colors.white,
  },
  generateCardSubtitle: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: `${Colors.white}CC`,
    marginTop: 2,
  },
  generateCardArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateCardArrowText: {
    fontSize: 18,
    color: Colors.white,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    color: Colors.foundation,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.primary,
  },
  horizontalScroll: {
    paddingLeft: Spacing.xl,
    paddingRight: Spacing.md,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  cuisineChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
    ...Shadow.sm,
  },
  cuisineEmoji: {
    fontSize: 16,
  },
  cuisineLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.foundation,
  },
  quickPicksLoading: {
    paddingVertical: Spacing.xl,
    paddingLeft: Spacing.xl,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
