import { useEffect, useState, useRef, useCallback } from 'react';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
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
import { store, persistor } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, logout } from '@/store/slices/authSlice';
import { useTestTokenMutation } from '@/store/apiSlice';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const dispatch = useAppDispatch();
  const hasSeenSlides = useAppSelector((s) => s.auth.hasSeenSlides);
  const hasCompletedKitchenSetup = useAppSelector((s) => s.auth.hasCompletedKitchenSetup);
  const token = useAppSelector((s) => s.auth.token);
  const [testToken] = useTestTokenMutation();
  const didBootstrap = useRef(false);
  const [rehydrated, setRehydrated] = useState(() => persistor.getState().bootstrapped);

  const [fontsLoaded, fontError] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (rehydrated) return;
    const unsub = persistor.subscribe(() => {
      if (persistor.getState().bootstrapped) {
        setRehydrated(true);
        unsub();
      }
    });
    const t = setTimeout(() => setRehydrated(true), 8000);
    return () => { unsub(); clearTimeout(t); };
  }, [rehydrated]);

  const fontsReady = fontsLoaded || !!fontError;

  const bootstrap = useCallback(async () => {
    if (didBootstrap.current) return;
    didBootstrap.current = true;

    try {
      if (token) {
        const result = await Promise.race([
          testToken().unwrap(),
          new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000)),
        ]);
        dispatch(setUser(result as { id: string; full_name?: string | null; email?: string; phone?: string | null }));
        const route = hasCompletedKitchenSetup ? '/(tabs)' : '/onboarding/kitchen/step-ingredients';
        router.replace(route as '/(tabs)' | '/onboarding/kitchen/step-ingredients');
      } else {
        const route = !hasSeenSlides ? '/onboarding/slides' : '/auth';
        router.replace(route);
      }
    } catch {
      dispatch(logout());
      const route = !hasSeenSlides ? '/onboarding/slides' : '/auth';
      router.replace(route);
    } finally {
      await SplashScreen.hideAsync();
    }
  }, [token, hasSeenSlides, hasCompletedKitchenSetup, dispatch, testToken]);

  useEffect(() => {
    if (!rehydrated || !fontsReady) return;
    bootstrap();
  }, [rehydrated, fontsReady, bootstrap]);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding/slides" />
        <Stack.Screen name="onboarding/kitchen/step-ingredients" />
        <Stack.Screen name="onboarding/kitchen/step-utensils" />
        <Stack.Screen name="onboarding/kitchen/step-dietary" />
        <Stack.Screen name="onboarding/kitchen/step-household" />
        <Stack.Screen name="auth/index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup-email" />
        <Stack.Screen name="auth/forgot-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="recipe-generator/confirm-ingredients" />
        <Stack.Screen name="recipe-generator/results" />
        <Stack.Screen name="recipe/[id]" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
