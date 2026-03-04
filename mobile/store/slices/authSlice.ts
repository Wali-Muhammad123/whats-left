import { createSlice } from '@reduxjs/toolkit';

/** User shape from API (full_name) mapped for app display (name). */
export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  hasSeenSlides: boolean;
  hasCompletedKitchenSetup: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  hasSeenSlides: false,
  hasCompletedKitchenSetup: false,
};

function apiUserToAuthUser(api: { id: string; full_name?: string | null; email?: string; phone?: string | null }): AuthUser {
  return {
    id: String(api.id),
    name: api.full_name ?? 'User',
    email: api.email,
    phone: api.phone ?? undefined,
  };
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: {
        payload: {
          token: string;
          user?: { id: string; full_name?: string | null; email?: string; phone?: string | null };
        };
      }
    ) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (action.payload.user) {
        state.user = apiUserToAuthUser(action.payload.user);
      }
    },
    setUser: (
      state,
      action: { payload: { id: string; full_name?: string | null; email?: string; phone?: string | null } }
    ) => {
      if (state.isAuthenticated) {
        state.user = apiUserToAuthUser(action.payload);
      }
    },
    setHasSeenSlides: (state, action: { payload: boolean }) => {
      state.hasSeenSlides = action.payload;
    },
    setHasCompletedKitchenSetup: (state, action: { payload: boolean }) => {
      state.hasCompletedKitchenSetup = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.hasCompletedKitchenSetup = false;
    },
  },
});

export const { setCredentials, setUser, setHasSeenSlides, setHasCompletedKitchenSetup, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectHasSeenSlides = (state: { auth: AuthState }) => state.auth.hasSeenSlides;
export const selectHasCompletedKitchenSetup = (state: { auth: AuthState }) => state.auth.hasCompletedKitchenSetup;
