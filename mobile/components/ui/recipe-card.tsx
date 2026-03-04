import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ViewStyle,
} from 'react-native';
import { Colors, Fonts, Radius, Shadow, Spacing } from '@/constants/theme';

export interface RecipeCardData {
  id: string;
  title: string;
  cuisine: string;
  prepTime: string;
  matchPercent?: number;
  imageUrl?: string;
  saved?: boolean;
}

interface RecipeCardProps {
  recipe: RecipeCardData;
  onPress: () => void;
  onSave?: () => void;
  style?: ViewStyle;
  variant?: 'horizontal' | 'vertical';
}

export function RecipeCard({
  recipe,
  onPress,
  onSave,
  style,
  variant = 'vertical',
}: RecipeCardProps) {
  if (variant === 'horizontal') {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[styles.horizontalCard, Shadow.sm, style]}
      >
        <View style={styles.horizontalImage}>
          {recipe.imageUrl ? (
            <Image source={{ uri: recipe.imageUrl }} style={styles.horizontalImageImg} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderEmoji}>🍽</Text>
            </View>
          )}
        </View>
        <View style={styles.horizontalContent}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {recipe.title}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.cuisineTag}>
              <Text style={styles.cuisineTagText}>{recipe.cuisine}</Text>
            </View>
            <Text style={styles.prepTime}>⏱ {recipe.prepTime}</Text>
          </View>
          {recipe.matchPercent !== undefined && (
            <View style={styles.matchRow}>
              <View style={styles.matchBar}>
                <View style={[styles.matchFill, { width: `${recipe.matchPercent}%` }]} />
              </View>
              <Text style={styles.matchText}>{recipe.matchPercent}% match</Text>
            </View>
          )}
        </View>
        {onSave && (
          <TouchableOpacity onPress={onSave} style={styles.bookmarkButton} activeOpacity={0.7}>
            <Text style={styles.bookmarkIcon}>{recipe.saved ? '🔖' : '🏷'}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.verticalCard, Shadow.sm, style]}
    >
      <View style={styles.verticalImage}>
        {recipe.imageUrl ? (
          <Image source={{ uri: recipe.imageUrl }} style={styles.verticalImageImg} />
        ) : (
          <View style={[styles.imagePlaceholder, styles.verticalImagePlaceholder]}>
            <Text style={styles.imagePlaceholderEmoji}>🍽</Text>
          </View>
        )}
        {onSave && (
          <TouchableOpacity onPress={onSave} style={styles.verticalBookmark} activeOpacity={0.7}>
            <Text style={styles.bookmarkIcon}>{recipe.saved ? '🔖' : '🏷'}</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.verticalContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.cuisineTag}>
            <Text style={styles.cuisineTagText}>{recipe.cuisine}</Text>
          </View>
          <Text style={styles.prepTime}>⏱ {recipe.prepTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  horizontalImage: {
    width: 110,
    height: 110,
  },
  horizontalImageImg: {
    width: '100%',
    height: '100%',
  },
  horizontalContent: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  verticalCard: {
    width: 160,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginRight: Spacing.md,
  },
  verticalImage: {
    height: 110,
    position: 'relative',
  },
  verticalImageImg: {
    width: '100%',
    height: '100%',
  },
  verticalImagePlaceholder: {
    height: 110,
  },
  verticalContent: {
    padding: Spacing.sm + 2,
  },
  verticalBookmark: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: Radius.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    flex: 1,
    backgroundColor: `${Colors.accent}33`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderEmoji: {
    fontSize: 32,
  },
  cardTitle: {
    fontFamily: Fonts.heading,
    fontSize: 14,
    color: Colors.foundation,
    marginBottom: Spacing.xs,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  cuisineTag: {
    backgroundColor: `${Colors.accent}33`,
    paddingVertical: 2,
    paddingHorizontal: Spacing.xs + 2,
    borderRadius: Radius.full,
  },
  cuisineTagText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.foundation,
  },
  prepTime: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.muted,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  matchBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  matchFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
  },
  matchText: {
    fontFamily: Fonts.body,
    fontSize: 11,
    color: Colors.accent,
  },
  bookmarkButton: {
    padding: Spacing.sm,
    alignSelf: 'center',
  },
  bookmarkIcon: {
    fontSize: 16,
  },
});
