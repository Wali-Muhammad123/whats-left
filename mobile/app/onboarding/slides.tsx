import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ListRenderItem,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '@/store/app-store';
import { Button } from '@/components/ui/button';
import { ProgressDots } from '@/components/ui/progress-dots';
import { Colors, Fonts, Spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
  id: string;
  emoji: string;
  headline: string;
  body: string;
  bgColor: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    emoji: '🧊',
    headline: 'Your Kitchen,\nYour Rules',
    body: "Tell us what's in your pantry and we'll do the thinking.",
    bgColor: '#EAF4EA',
  },
  {
    id: '2',
    emoji: '🍳',
    headline: 'Cook With\nWhat You Have',
    body: "No fancy equipment needed — we match recipes to your tools.",
    bgColor: '#FDF0E4',
  },
  {
    id: '3',
    emoji: '🍜',
    headline: 'Recipes Made\nFor You',
    body: 'Pick a cuisine, set your time, and get cooking.',
    bgColor: '#EAF4EA',
  },
];

async function markSlidesAsSeen() {
  await AsyncStorage.setItem('hasSeenSlides', 'true');
}

export default function OnboardingSlides() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const { setHasSeenSlides } = useAppStore();

  const handleSkip = async () => {
    await markSlidesAsSeen();
    setHasSeenSlides(true);
    router.replace('/auth');
  };

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      await markSlidesAsSeen();
      setHasSeenSlides(true);
      router.replace('/auth');
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const renderSlide: ListRenderItem<Slide> = ({ item }) => (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      <View style={[styles.illustrationContainer, { backgroundColor: item.bgColor }]}>
        <Text style={styles.illustrationEmoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.headline}>{item.headline}</Text>
      <Text style={styles.body}>{item.body}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleSkip} style={styles.skipButton} activeOpacity={0.7}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <ProgressDots total={SLIDES.length} current={currentIndex} />
        <Button
          label={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          fullWidth={false}
          style={styles.nextButton}
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
  skipButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  skipText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    color: Colors.muted,
  },
  slide: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.xxl,
  },
  illustrationContainer: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  illustrationEmoji: {
    fontSize: 96,
  },
  headline: {
    fontFamily: Fonts.heading,
    fontSize: 32,
    color: Colors.foundation,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: Spacing.md,
  },
  body: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.lg,
  },
  nextButton: {
    paddingHorizontal: Spacing.xl,
  },
});
