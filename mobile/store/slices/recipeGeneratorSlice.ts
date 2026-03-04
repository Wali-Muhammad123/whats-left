import { createSlice } from '@reduxjs/toolkit';
import type { RecipeCardResponse } from '@/store/apiSlice';

interface RecipeGeneratorState {
  lastGeneratedRecipes: RecipeCardResponse[];
}

const initialState: RecipeGeneratorState = {
  lastGeneratedRecipes: [],
};

export const recipeGeneratorSlice = createSlice({
  name: 'recipeGenerator',
  initialState,
  reducers: {
    setLastGeneratedRecipes: (state, action: { payload: RecipeCardResponse[] }) => {
      state.lastGeneratedRecipes = action.payload;
    },
    clearLastGeneratedRecipes: (state) => {
      state.lastGeneratedRecipes = [];
    },
  },
});

export const { setLastGeneratedRecipes, clearLastGeneratedRecipes } = recipeGeneratorSlice.actions;
export default recipeGeneratorSlice.reducer;
