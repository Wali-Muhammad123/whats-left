import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { API_V1 } from '@/constants/env';
import { logout } from '@/store/slices/authSlice';

type RootState = { auth: { token: string | null } };

const baseQuery = fetchBaseQuery({
  baseUrl: API_V1,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token ?? null;
    headers.set('ngrok-skip-browser-warning', '69420');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    };
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    api.dispatch(logout());
  }
  return result;
};

// --- Types (aligned with backend schemas) ---
export interface TokenResponse {
  access_token: string;
  token_type: string;
}
export interface UserPublic {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  is_active: boolean;
  is_superuser: boolean;
}
export interface KitchenResponse {
  ingredients: string[];
  utensils: string[];
  dietary_preferences: string[];
  household_size: number;
  has_completed_setup: boolean;
  pantry_last_updated: string | null;
}
export interface KitchenUpdate {
  ingredients?: string[];
  utensils?: string[];
  dietary_preferences?: string[];
  household_size?: number;
  has_completed_setup?: boolean;
}
export interface MealSlot {
  slot: string;
  recipe_id?: string | null;
  label?: string | null;
}
export interface DayPlan {
  day_label: string;
  date_iso: string | null;
  slots: MealSlot[];
}
export interface MealPlanResponse {
  week_days: DayPlan[];
}
export interface RecipeCardResponse {
  id: string;
  title: string;
  cuisine: string;
  prep_time: string;
  match_percent?: number | null;
  image_url?: string | null;
  saved?: boolean;
}
export interface RecipeIngredient {
  name: string;
  amount?: string;
  have?: boolean;
}
export interface RecipeInstruction {
  step: number;
  text: string;
  time?: string;
}
export interface RecipeDetailResponse {
  id: string;
  title: string;
  cuisine: string;
  prep_time: string;
  match_percent?: number | null;
  image_url?: string | null;
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
}
export interface RecipeGenerateRequest {
  ingredients: string[];
  cuisine?: string | null;
  max_time_minutes?: number | null;
}
export interface RecipeGenerateResponse {
  recipes: RecipeCardResponse[];
}
export interface KitchenOptionsResponse {
  ingredient_categories: string[];
  ingredient_options: Record<string, string[]>;
  utensil_ids: string[];
  dietary_ids: string[];
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['User', 'Kitchen', 'MealPlan', 'Recipes', 'Recipe'],
  endpoints: (builder) => ({
    // --- Auth ---
    login: builder.mutation<TokenResponse, { username: string; password: string }>({
      query: (body) => {
        // React Native fetch does not reliably serialize URLSearchParams as body; send as string.
        const formBody =
          `username=${encodeURIComponent(body.username)}&password=${encodeURIComponent(body.password)}`;
        return {
          url: '/login/access-token',
          method: 'POST',
          body: formBody,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        };
      },
    }),
    testToken: builder.mutation<UserPublic, void>({
      query: () => ({ url: '/login/test-token', method: 'POST' }),
    }),
    passwordRecovery: builder.mutation<{ message: string }, string>({
      query: (email) => ({ url: `/login/password-recovery/${encodeURIComponent(email)}`, method: 'POST' }),
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; new_password: string }>({
      query: (body) => ({ url: '/login/reset-password/', method: 'POST', body }),
    }),

    // --- Users ---
    signup: builder.mutation<UserPublic, { email: string; password: string; full_name?: string | null }>({
      query: (body) => ({ url: '/users/signup', method: 'POST', body }),
    }),
    getMe: builder.query<UserPublic, void>({
      query: () => ({ url: '/users/me' }),
      providesTags: ['User'],
    }),
    updateMe: builder.mutation<UserPublic, { full_name?: string | null; email?: string | null; phone?: string | null }>({
      query: (body) => ({ url: '/users/me', method: 'PATCH', body }),
      invalidatesTags: ['User'],
    }),
    updatePassword: builder.mutation<{ message: string }, { current_password: string; new_password: string }>({
      query: (body) => ({ url: '/users/me/password', method: 'PATCH', body }),
    }),
    deleteMe: builder.mutation<{ message: string }, void>({
      query: () => ({ url: '/users/me', method: 'DELETE' }),
    }),

    // --- Kitchen ---
    getKitchen: builder.query<KitchenResponse, void>({
      query: () => ({ url: '/users/me/kitchen' }),
      providesTags: ['Kitchen'],
    }),
    updateKitchen: builder.mutation<KitchenResponse, KitchenUpdate>({
      query: (body) => ({ url: '/users/me/kitchen', method: 'PATCH', body }),
      invalidatesTags: ['Kitchen'],
    }),

    // --- Meal plan ---
    getMealPlan: builder.query<MealPlanResponse, void>({
      query: () => ({ url: '/users/me/meal-plan' }),
      providesTags: ['MealPlan'],
    }),

    // --- Recipes ---
    listRecipes: builder.query<RecipeCardResponse[], { skip?: number; limit?: number; cuisine?: string | null; max_time?: number | null }>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params.skip != null) search.set('skip', String(params.skip));
        if (params.limit != null) search.set('limit', String(params.limit));
        if (params.cuisine != null) search.set('cuisine', params.cuisine);
        if (params.max_time != null) search.set('max_time', String(params.max_time));
        return { url: `/recipes/?${search.toString()}` };
      },
      providesTags: (_, __, arg) => [{ type: 'Recipes', id: JSON.stringify(arg) }],
    }),
    getRecipe: builder.query<RecipeDetailResponse, string>({
      query: (id) => ({ url: `/recipes/${id}` }),
      providesTags: (_, __, id) => [{ type: 'Recipe', id }],
    }),
    generateRecipes: builder.mutation<RecipeGenerateResponse, RecipeGenerateRequest>({
      query: (body) => ({ url: '/recipes/generate', method: 'POST', body }),
    }),

    // --- Utils ---
    getKitchenOptions: builder.query<KitchenOptionsResponse, void>({
      query: () => ({ url: '/utils/kitchen-options' }),
    }),
    healthCheck: builder.query<boolean, void>({
      query: () => ({ url: '/utils/health-check/' }),
    }),
  }),
});

export const {
  useLoginMutation,
  useTestTokenMutation,
  usePasswordRecoveryMutation,
  useResetPasswordMutation,
  useSignupMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useUpdateMeMutation,
  useUpdatePasswordMutation,
  useDeleteMeMutation,
  useGetKitchenQuery,
  useLazyGetKitchenQuery,
  useUpdateKitchenMutation,
  useGetMealPlanQuery,
  useListRecipesQuery,
  useGetRecipeQuery,
  useGenerateRecipesMutation,
  useGetKitchenOptionsQuery,
  useHealthCheckQuery,
} = api;
