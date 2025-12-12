import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "./auth.types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    updateToken: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string | null;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, logout, updateToken } = authSlice.actions;
export default authSlice.reducer;
