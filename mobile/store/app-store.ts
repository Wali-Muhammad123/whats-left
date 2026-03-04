import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  // Onboarding
  hasSeenSlides: boolean;
  hasCompletedKitchenSetup: boolean;
  // Pantry
  ingredients: string[];
  utensils: string[];
  dietaryPreferences: string[];
  householdSize: number;
  pantryLastUpdated: Date | null;
  // Actions
  setUser: (user: User | null) => void;
  setHasSeenSlides: (value: boolean) => void;
  setHasCompletedKitchenSetup: (value: boolean) => void;
  setIngredients: (ingredients: string[]) => void;
  setUtensils: (utensils: string[]) => void;
  setDietaryPreferences: (prefs: string[]) => void;
  setHouseholdSize: (size: number) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  hasSeenSlides: false,
  hasCompletedKitchenSetup: false,
  ingredients: [],
  utensils: [],
  dietaryPreferences: [],
  householdSize: 2,
  pantryLastUpdated: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setHasSeenSlides: (value) => set({ hasSeenSlides: value }),
  setHasCompletedKitchenSetup: (value) => set({ hasCompletedKitchenSetup: value }),
  setIngredients: (ingredients) => set({ ingredients, pantryLastUpdated: new Date() }),
  setUtensils: (utensils) => set({ utensils }),
  setDietaryPreferences: (dietaryPreferences) => set({ dietaryPreferences }),
  setHouseholdSize: (householdSize) => set({ householdSize }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
      hasCompletedKitchenSetup: false,
    }),
}));
