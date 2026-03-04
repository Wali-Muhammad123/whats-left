import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { ScreenHeader } from '@/components/ui/screen-header';
import { useAppDispatch } from '@/store/hooks';
import { setLastGeneratedRecipes } from '@/store/slices/recipeGeneratorSlice';
import { useGetKitchenQuery, useGenerateRecipesMutation } from '@/store/apiSlice';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';

const LOADING_MESSAGES = [
  'Checking your pantry…',
  'Finding the best matches…',
  'Almost there…',
  'Crafting your recipes…',
];

function timeParamToMinutes(timeId: string | undefined): number | undefined {
  if (!timeId) return undefined;
  if (timeId === 'under-15') return 15;
  if (timeId === '15-30') return 30;
  if (timeId === '30-60') return 60;
  if (timeId === '1hr+') return 90;
  return undefined;
}

export default function ConfirmIngredients() {
  const { cuisine, time } = useLocalSearchParams<{ cuisine: string; time: string }>();
  const dispatch = useAppDispatch();
  const { data: kitchen } = useGetKitchenQuery();
  const [generateRecipes, { isLoading: generating }] = useGenerateRecipesMutation();
  const ingredients = kitchen?.ingredients ?? [];
  const [isLoading, setIsLoading] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (!isLoading) return;
    pulseScale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 600 }), withTiming(1, { duration: 600 })),
      -1
    );
    pulseOpacity.value = withRepeat(
      withSequence(withTiming(1, { duration: 600 }), withTiming(0.4, { duration: 600 })),
      -1
    );

    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [isLoading]);

  async function runGenerate() {
    try {
      const result = await generateRecipes({
        ingredients,
        cuisine: cuisine && cuisine !== 'any' ? cuisine : undefined,
        max_time_minutes: timeParamToMinutes(time),
      }).unwrap();
      dispatch(setLastGeneratedRecipes(result.recipes));
      router.replace({
        pathname: '/recipe-generator/results',
        params: { cuisine: cuisine ?? '', time: time ?? '' },
      });
    } catch {
      setError('Failed to generate recipes. Try again.');
      setIsLoading(false);
    }
  }

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  function handleContinue() {
    setError(null);
    setIsLoading(true);
    runGenerate();
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.pulseWrapper}>
            <Animated.View style={[styles.pulseRing, pulseStyle]} />
            <Text style={styles.loadingEmoji}>🥘</Text>
          </View>
          <Text style={styles.loadingMessage}>{LOADING_MESSAGES[messageIndex]}</Text>
          <Text style={styles.loadingSubtext}>
            {error ?? 'Generating personalized recipes for you'}
          </Text>
          {error && (
            <TouchableOpacity onPress={() => { setError(null); setIsLoading(false); }} style={styles.retryLink}>
              <Text style={styles.retryText}>Tap to try again</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  const cuisineLabel = cuisine === 'any' ? 'Any Cuisine' : cuisine?.charAt(0).toUpperCase() + cuisine?.slice(1);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Confirm Ingredients" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.summaryRow}>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryChipText}>🍽 {cuisineLabel}</Text>
          </View>
          <View style={styles.summaryChip}>
            <Text style={styles.summaryChipText}>⏱ {time?.replace('-', '–')}</Text>
          </View>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          We'll use these ingredients from your pantry
        </Text>

        <View style={styles.ingredientList}>
          {ingredients.length > 0 ? (
            ingredients.map((item) => (
              <View key={item} style={styles.ingredientRow}>
                <View style={styles.checkCircle}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <Text style={styles.ingredientText}>{item}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyIngredients}>
              <Text style={styles.emptyText}>No ingredients in pantry yet</Text>
            </View>
          )}
        </View>


        <TouchableOpacity
          onPress={() => router.push('/(tabs)/pantry')}
          activeOpacity={0.7}
          style={styles.updatePantryLink}
        >
          <Text style={styles.updatePantryText}>Missing something? Update Pantry →</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Continue Anyway" onPress={handleContinue} />
        <Button
          label="Cancel"
          onPress={() => router.back()}
          variant="ghost"
          style={styles.cancelButton}
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
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  summaryChip: {
    backgroundColor: `${Colors.primary}15`,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
  },
  summaryChipText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.primary,
  },
  sectionTitle: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: Colors.foundation,
    marginBottom: Spacing.md,
  },
  missingSectionTitle: {
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: Colors.muted,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  ingredientList: {
    gap: Spacing.xs + 2,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${Colors.success}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    fontSize: 14,
    color: Colors.success,
    fontFamily: Fonts.bodySemiBold,
  },
  missingCircle: {
    backgroundColor: Colors.border,
  },
  missingMark: {
    fontSize: 14,
    color: Colors.muted,
    fontFamily: Fonts.bodySemiBold,
  },
  ingredientText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.foundation,
  },
  missingText: {
    color: Colors.muted,
    textDecorationLine: 'line-through',
  },
  emptyIngredients: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
  },
  updatePantryLink: {
    marginTop: Spacing.lg,
    alignSelf: 'flex-start',
  },
  updatePantryText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.primary,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
    backgroundColor: Colors.background,
  },
  cancelButton: {
    paddingVertical: Spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  pulseWrapper: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${Colors.primary}30`,
  },
  loadingEmoji: {
    fontSize: 56,
  },
  loadingMessage: {
    fontFamily: Fonts.heading,
    fontSize: 22,
    color: Colors.foundation,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  loadingSubtext: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
  },
  retryLink: {
    marginTop: Spacing.md,
  },
  retryText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.primary,
  },
  errorBanner: {
    backgroundColor: `${Colors.error}15`,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.error,
  },
  errorBannerText: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.error,
  },
});
