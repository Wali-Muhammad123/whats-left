import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import {
  Montserrat_400Regular,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppStore } from '@/store/app-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setHasSeenSlides, setUser, setHasCompletedKitchenSetup } = useAppStore();

  const [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    async function bootstrap() {
      if (!fontsLoaded && !fontError) return;

      try {
        const [seenSlides, authToken, kitchenDone] = await Promise.all([
          AsyncStorage.getItem('hasSeenSlides'),
          AsyncStorage.getItem('authToken'),
          AsyncStorage.getItem('hasCompletedKitchenSetup'),
        ]);

        if (seenSlides === 'true') setHasSeenSlides(true);
        if (kitchenDone === 'true') setHasCompletedKitchenSetup(true);

        if (authToken) {
          const userJson = await AsyncStorage.getItem('user');
          if (userJson) {
            setUser(JSON.parse(userJson));
          }
        }
      } catch {
        // Silently handle storage errors
      } finally {
        await SplashScreen.hideAsync();
        await navigateToCorrectScreen();
      }
    }

    bootstrap();
  }, [fontsLoaded, fontError]);

  async function navigateToCorrectScreen() {
    try {
      const [seenSlides, authToken, kitchenDone] = await Promise.all([
        AsyncStorage.getItem('hasSeenSlides'),
        AsyncStorage.getItem('authToken'),
        AsyncStorage.getItem('hasCompletedKitchenSetup'),
      ]);

      if (!seenSlides) {
        router.replace('/onboarding/slides');
      } else if (!authToken) {
        router.replace('/auth');
      } else if (!kitchenDone) {
        router.replace('/onboarding/kitchen/step-ingredients');
      } else {
        router.replace('/(tabs)');
      }
    } catch {
      router.replace('/onboarding/slides');
    }
  }

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding/slides" />
        <Stack.Screen name="onboarding/kitchen/step-ingredients" />
        <Stack.Screen name="onboarding/kitchen/step-utensils" />
        <Stack.Screen name="onboarding/kitchen/step-dietary" />
        <Stack.Screen name="onboarding/kitchen/step-household" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="recipe-generator/confirm-ingredients" />
        <Stack.Screen name="recipe-generator/results" />
        <Stack.Screen name="recipe/[id]" />
      </Stack>
    </>
  );
}
