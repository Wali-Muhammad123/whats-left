import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Button } from '@/components/ui/button';
import { Colors, Fonts, Radius, Shadow, Spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HERO_HEIGHT = 280;

const MOCK_RECIPE = {
  id: '1',
  title: 'Garlic Butter Pasta',
  cuisine: 'Italian',
  prepTime: '20 min',
  servings: 2,
  matchPercent: 95,
  ingredients: [
    { name: 'Pasta', amount: '200g', have: true },
    { name: 'Garlic', amount: '4 cloves', have: true },
    { name: 'Butter', amount: '3 tbsp', have: true },
    { name: 'Parmesan Cheese', amount: '50g', have: false },
    { name: 'Fresh Parsley', amount: 'handful', have: false },
    { name: 'Salt', amount: 'to taste', have: true },
    { name: 'Black Pepper', amount: 'to taste', have: true },
    { name: 'Olive Oil', amount: '2 tbsp', have: false },
  ],
  instructions: [
    { step: 1, text: 'Bring a large pot of salted water to boil. Cook pasta according to package instructions until al dente.', time: '10 min' },
    { step: 2, text: 'While pasta cooks, mince the garlic cloves finely.', time: '2 min' },
    { step: 3, text: 'In a large pan over medium heat, melt butter with olive oil. Add garlic and sauté for 2 minutes until fragrant but not browned.', time: '3 min' },
    { step: 4, text: 'Reserve 1 cup of pasta water before draining. Drain the pasta.', time: '1 min' },
    { step: 5, text: 'Add drained pasta to the garlic butter pan. Toss well, adding pasta water as needed to create a silky sauce.', time: '3 min' },
    { step: 6, text: 'Remove from heat. Add parmesan, fresh parsley, salt and pepper. Toss and serve immediately.', time: '1 min' },
  ],
};

type ActiveTab = 'ingredients' | 'instructions' | 'nutrition';

export default function RecipeDetail() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ingredients');
  const [servings, setServings] = useState(MOCK_RECIPE.servings);
  const [saved, setSaved] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, HERO_HEIGHT],
          [0, -HERO_HEIGHT * 0.4],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  const floatingHeaderOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HERO_HEIGHT - 80, HERO_HEIGHT - 40], [0, 1], Extrapolation.CLAMP),
  }));

  const haveIngredients = MOCK_RECIPE.ingredients.filter((i) => i.have);
  const needIngredients = MOCK_RECIPE.ingredients.filter((i) => !i.have);

  return (
    <View style={styles.container}>
      {/* Floating header (appears on scroll) */}
      <Animated.View style={[styles.floatingHeader, floatingHeaderOpacity]}>
        <SafeAreaView>
          <View style={styles.floatingHeaderContent}>
            <TouchableOpacity onPress={() => router.back()} style={styles.floatingBackBtn} activeOpacity={0.8}>
              <Text style={styles.floatingBackText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.floatingTitle} numberOfLines={1}>{MOCK_RECIPE.title}</Text>
            <TouchableOpacity onPress={() => setSaved(!saved)} style={styles.floatingBackBtn} activeOpacity={0.8}>
              <Text style={styles.floatingBackText}>{saved ? '🔖' : '🏷'}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero */}
        <Animated.View style={[styles.hero, heroStyle]}>
          <View style={styles.heroPlaceholder}>
            <Text style={styles.heroEmoji}>🍝</Text>
          </View>

          {/* Floating back + actions */}
          <SafeAreaView style={styles.heroOverlay}>
            <View style={styles.heroTopRow}>
              <TouchableOpacity onPress={() => router.back()} style={styles.heroBtn} activeOpacity={0.8}>
                <Text style={styles.heroBtnText}>←</Text>
              </TouchableOpacity>
              <View style={styles.heroActions}>
                <TouchableOpacity onPress={() => setSaved(!saved)} style={styles.heroBtn} activeOpacity={0.8}>
                  <Text style={styles.heroBtnText}>{saved ? '🔖' : '🏷'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.heroBtn} activeOpacity={0.8}>
                  <Text style={styles.heroBtnText}>↗</Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title + badges */}
          <Text style={styles.title}>{MOCK_RECIPE.title}</Text>

          <View style={styles.badgeRow}>
            <View style={styles.cuisineBadge}>
              <Text style={styles.cuisineBadgeText}>{MOCK_RECIPE.cuisine}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⏱ {MOCK_RECIPE.prepTime}</Text>
            </View>
            <View style={styles.servingsStepper}>
              <TouchableOpacity
                onPress={() => setServings((s) => Math.max(1, s - 1))}
                style={styles.stepperBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.stepperBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.servingsText}>👥 {servings}</Text>
              <TouchableOpacity
                onPress={() => setServings((s) => s + 1)}
                style={styles.stepperBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.stepperBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Match bar */}
          <View style={styles.matchSection}>
            <View style={styles.matchLabelRow}>
              <Text style={styles.matchLabel}>Pantry Match</Text>
              <Text style={styles.matchPercent}>{MOCK_RECIPE.matchPercent}%</Text>
            </View>
            <View style={styles.matchBarBg}>
              <View style={[styles.matchBarFill, { width: `${MOCK_RECIPE.matchPercent}%` }]} />
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabBar}>
            {(['ingredients', 'instructions', 'nutrition'] as ActiveTab[]).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          {activeTab === 'ingredients' && (
            <View style={styles.tabContent}>
              <Text style={styles.subheading}>In your pantry ({haveIngredients.length})</Text>
              {haveIngredients.map((ing) => (
                <View key={ing.name} style={styles.ingredientRow}>
                  <View style={styles.ingCheckCircle}>
                    <Text style={styles.ingCheckText}>✓</Text>
                  </View>
                  <Text style={styles.ingName}>{ing.name}</Text>
                  <Text style={styles.ingAmount}>{ing.amount}</Text>
                </View>
              ))}

              {needIngredients.length > 0 && (
                <>
                  <Text style={[styles.subheading, styles.subheadingMissing]}>
                    Need to buy ({needIngredients.length})
                  </Text>
                  {needIngredients.map((ing) => (
                    <View key={ing.name} style={[styles.ingredientRow, styles.ingredientRowMissing]}>
                      <View style={[styles.ingCheckCircle, styles.ingMissingCircle]}>
                        <Text style={styles.ingMissingText}>+</Text>
                      </View>
                      <Text style={[styles.ingName, styles.ingNameMissing]}>{ing.name}</Text>
                      <View style={styles.addToListRow}>
                        <Text style={styles.ingAmount}>{ing.amount}</Text>
                        <TouchableOpacity style={styles.addToListBtn} activeOpacity={0.7}>
                          <Text style={styles.addToListText}>+ List</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}

          {activeTab === 'instructions' && (
            <View style={styles.tabContent}>
              {MOCK_RECIPE.instructions.map((step) => (
                <TouchableOpacity
                  key={step.step}
                  onPress={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                  activeOpacity={0.85}
                  style={styles.stepCard}
                >
                  <View style={styles.stepHeader}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{step.step}</Text>
                    </View>
                    <View style={styles.stepMeta}>
                      <Text style={styles.stepTimeText}>⏱ {step.time}</Text>
                      <Text style={styles.stepChevron}>
                        {expandedStep === step.step ? '▲' : '▼'}
                      </Text>
                    </View>
                  </View>
                  {expandedStep === step.step && (
                    <Text style={styles.stepText}>{step.text}</Text>
                  )}
                  {expandedStep !== step.step && (
                    <Text style={styles.stepTextCollapsed} numberOfLines={2}>
                      {step.text}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'nutrition' && (
            <View style={styles.tabContent}>
              <View style={styles.comingSoon}>
                <Text style={styles.comingSoonEmoji}>📊</Text>
                <Text style={styles.comingSoonTitle}>Coming Soon</Text>
                <Text style={styles.comingSoonText}>
                  Detailed nutrition information will be available in a future update.
                </Text>
              </View>
            </View>
          )}

          <View style={styles.bottomPad} />
        </View>
      </Animated.ScrollView>

      {/* Sticky CTA */}
      <View style={styles.stickyBar}>
        <Button label="Start Cooking 🍳" onPress={() => {}} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  floatingHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  floatingBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  floatingBackText: {
    fontSize: 18,
    color: Colors.foundation,
  },
  floatingTitle: {
    flex: 1,
    fontFamily: Fonts.heading,
    fontSize: 16,
    color: Colors.foundation,
    textAlign: 'center',
  },
  hero: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroPlaceholder: {
    flex: 1,
    backgroundColor: `${Colors.accent}40`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 96,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  heroBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  heroBtnText: {
    fontSize: 18,
    color: Colors.foundation,
  },
  heroActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  content: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -Radius.xl,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
  },
  title: {
    fontFamily: Fonts.heading,
    fontSize: 26,
    color: Colors.foundation,
    marginBottom: Spacing.md,
    lineHeight: 32,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
  },
  cuisineBadge: {
    backgroundColor: `${Colors.accent}33`,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  cuisineBadgeText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 12,
    color: Colors.foundation,
  },
  badge: {
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  badgeText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
  },
  servingsStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  stepperBtn: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs,
  },
  stepperBtnText: {
    fontSize: 16,
    color: Colors.primary,
    fontFamily: Fonts.heading,
  },
  servingsText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.foundation,
    paddingHorizontal: Spacing.xs,
  },
  matchSection: {
    marginBottom: Spacing.lg,
  },
  matchLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  matchLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.muted,
  },
  matchPercent: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.accent,
  },
  matchBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  matchBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: 4,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.muted,
  },
  tabTextActive: {
    color: Colors.white,
  },
  tabContent: {
    gap: Spacing.sm,
  },
  subheading: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
    marginTop: Spacing.sm,
  },
  subheadingMissing: {
    color: Colors.primary,
    marginTop: Spacing.lg,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  ingredientRowMissing: {
    borderWidth: 1,
    borderColor: `${Colors.primary}30`,
    backgroundColor: `${Colors.primary}05`,
  },
  ingCheckCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${Colors.success}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ingCheckText: {
    fontSize: 13,
    color: Colors.success,
    fontFamily: Fonts.bodySemiBold,
  },
  ingMissingCircle: {
    backgroundColor: `${Colors.primary}15`,
  },
  ingMissingText: {
    fontSize: 13,
    color: Colors.primary,
    fontFamily: Fonts.bodySemiBold,
  },
  ingName: {
    flex: 1,
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.foundation,
  },
  ingNameMissing: {
    color: Colors.primary,
  },
  ingAmount: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
  },
  addToListRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  addToListBtn: {
    backgroundColor: `${Colors.primary}15`,
    borderRadius: Radius.full,
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
  },
  addToListText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 11,
    color: Colors.primary,
  },
  stepCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: Fonts.heading,
    fontSize: 13,
    color: Colors.white,
  },
  stepMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  stepTimeText: {
    fontFamily: Fonts.body,
    fontSize: 12,
    color: Colors.muted,
  },
  stepChevron: {
    fontSize: 10,
    color: Colors.muted,
  },
  stepText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.foundation,
    lineHeight: 22,
    marginTop: Spacing.xs,
  },
  stepTextCollapsed: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
    lineHeight: 20,
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  comingSoonEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  comingSoonTitle: {
    fontFamily: Fonts.heading,
    fontSize: 20,
    color: Colors.foundation,
    marginBottom: Spacing.sm,
  },
  comingSoonText: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomPad: {
    height: Spacing.xxl,
  },
  stickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
