# PantryPal — Mobile App

Cook smarter with what you have. PantryPal is a React Native (Expo) mobile application that helps users discover recipes based on the ingredients and utensils they already own.

---

## The Problem

People forget what they have in the kitchen, and most recipes found online require equipment or ingredients that aren't readily available. PantryPal solves this by:

- Tracking what ingredients and utensils a user has
- Generating personalized recipes based on their actual pantry
- Filtering by cuisine preference and available prep time

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo SDK 54) |
| Routing | expo-router (file-based, typed routes) |
| State | Zustand |
| Fonts | Roboto (headings) + Montserrat (body) via expo-google-fonts |
| Storage | @react-native-async-storage/async-storage |
| Animations | react-native-reanimated |

---

## Design System

**Colors**

| Token | Hex | Usage |
|---|---|---|
| Primary | `#D96C06` | CTAs, active states, highlights |
| Foundation | `#2C3531` | Primary text, dark surfaces, tab bar |
| Background | `#F7F5F0` | App background, cards |
| Accent | `#8CA98C` | Tags, freshness indicators, match bars |
| White | `#FFFFFF` | Input surfaces, cards |
| Error | `#C0392B` | Form validation |

**Fonts**
- Headings: `Roboto_700Bold` / `Roboto_500Medium`
- Body: `Montserrat_400Regular` / `Montserrat_600SemiBold`

---

## App Flow

```
Splash → First launch? → Onboarding Slides → Auth → Kitchen Setup → Main App
                       ↓ (returning user)
                       Auth → Main App (if kitchen already set up)
```

---

## Screen Inventory

### Onboarding
| Screen | Path | Description |
|---|---|---|
| Onboarding Slides | `app/onboarding/slides.tsx` | 3-slide intro carousel with Skip + Next |
| Ingredients Setup | `app/onboarding/kitchen/step-ingredients.tsx` | Select pantry ingredients by category |
| Utensils Setup | `app/onboarding/kitchen/step-utensils.tsx` | Select available cooking equipment |
| Dietary Preferences | `app/onboarding/kitchen/step-dietary.tsx` | Set dietary filters (Vegetarian, Halal, etc.) |
| Household Size | `app/onboarding/kitchen/step-household.tsx` | Set number of people to cook for |

### Auth
| Screen | Path | Description |
|---|---|---|
| Auth Landing | `app/auth/index.tsx` | Choose email or phone sign-up |
| Sign Up (Email) | `app/auth/signup-email.tsx` | Name, email, password with inline validation |
| Sign Up (Phone) | `app/auth/signup-phone.tsx` | Country code picker + phone + password |
| OTP Verification | `app/auth/otp.tsx` | 6-cell OTP input with 60s resend countdown |
| Login | `app/auth/login.tsx` | Email/phone + password with forgot password |
| Forgot Password | `app/auth/forgot-password.tsx` | Reset link via email |

### Main App (Tabs)
| Tab | Path | Description |
|---|---|---|
| Home | `app/(tabs)/index.tsx` | Greeting, Generate Recipe card, Quick Picks, Pantry Alert |
| Pantry | `app/(tabs)/pantry.tsx` | Ingredient list with search, category filter, and FAB |
| Meal Plan | `app/(tabs)/meal-plan.tsx` | Weekly calendar with per-day meal slots |
| Profile | `app/(tabs)/profile.tsx` | User info, settings, dietary preferences, logout |

### Recipe Generator
| Screen | Path | Description |
|---|---|---|
| Confirm Ingredients | `app/recipe-generator/confirm-ingredients.tsx` | Review pantry match before generating |
| Results | `app/recipe-generator/results.tsx` | List of generated recipes with filter/sort |
| Recipe Detail | `app/recipe/[id].tsx` | Parallax hero, Ingredients / Instructions / Nutrition tabs |

---

## Shared Components (`components/ui/`)

| Component | Description |
|---|---|
| `button.tsx` | Primary / secondary / ghost variants, loading state |
| `input.tsx` | Label, error, password show/hide, focus ring |
| `tag.tsx` | Selectable chips with default / accent / outline variants |
| `recipe-card.tsx` | Horizontal (list) and vertical (carousel) variants |
| `progress-dots.tsx` | Animated dot indicator for onboarding slides |
| `screen-header.tsx` | Back arrow + centered title + optional right slot |
| `bottom-sheet.tsx` | Animated modal sheet with backdrop dismiss |
| `kitchen-progress.tsx` | 4-segment progress bar for kitchen onboarding |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (macOS) or Android Emulator

### Install dependencies

```bash
npm install
```

### Run on iOS

```bash
npm run ios
```

### Run on Android

Requires Android SDK. Set `ANDROID_HOME` to your SDK path:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
npm run android
```

### Run in browser (limited)

```bash
npm run web
```

### Run with Expo Go

```bash
npx expo start
```

Scan the QR code with the Expo Go app on your device.

---

## Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx                    # Root stack, font loading, splash, nav guard
│   ├── onboarding/
│   │   ├── slides.tsx
│   │   └── kitchen/
│   │       ├── step-ingredients.tsx
│   │       ├── step-utensils.tsx
│   │       ├── step-dietary.tsx
│   │       └── step-household.tsx
│   ├── auth/
│   │   ├── index.tsx
│   │   ├── signup-email.tsx
│   │   ├── signup-phone.tsx
│   │   ├── otp.tsx
│   │   ├── login.tsx
│   │   └── forgot-password.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── pantry.tsx
│   │   ├── meal-plan.tsx
│   │   └── profile.tsx
│   ├── recipe-generator/
│   │   ├── confirm-ingredients.tsx
│   │   └── results.tsx
│   └── recipe/
│       └── [id].tsx
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── tag.tsx
│   │   ├── recipe-card.tsx
│   │   ├── progress-dots.tsx
│   │   ├── screen-header.tsx
│   │   ├── bottom-sheet.tsx
│   │   └── kitchen-progress.tsx
│   └── recipe-generator-sheet.tsx
├── constants/
│   └── theme.ts                       # Design tokens (colors, fonts, spacing, radii)
└── store/
    └── app-store.ts                   # Zustand store (auth, pantry, preferences)
```

---

## Planned Features

- Shopping list generation from missing recipe ingredients
- AI-powered recipe generation via backend API
- Weekly meal plan auto-generation
- Step-by-step cooking mode
- Community recipe sharing
- Nutrition tracking
