import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User, AuthTokens } from "./auth.types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  otpSentTo: undefined,
  userId: undefined,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // OTP sending
    sendOtpStart: (state, action: PayloadAction<string>) => {
      state.isLoading = true;
      state.error = null;
      state.otpSentTo = action.payload;
    },
    sendOtpSuccess: (state, action: PayloadAction<{ user: User }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.userId = action.payload.user.id;
      state.error = null;
    },
    sendOtpFailure: (state, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.otpSentTo = undefined;
      state.userId = undefined;
    },

    // OTP verification
    verifyOtpStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    verifyOtpSuccess: (
      state,
      action: PayloadAction<{ user: User; tokens: AuthTokens }>
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.accessToken = action.payload.tokens.accessToken.token;
      state.refreshToken = action.payload.tokens.refreshToken.token;
      state.error = null;
      state.otpSentTo = undefined;
      state.userId = undefined;
    },
    verifyOtpFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

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
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      if (typeof window !== "undefined") {
        const authData = localStorage.getItem("auth");
        if (authData) {
          const current = JSON.parse(authData);
          localStorage.setItem(
            "auth",
            JSON.stringify({
              ...current,
              user: action.payload,
            })
          );
        }
      }
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.isLoading = false;
      state.error = null;
      state.otpSentTo = undefined;
      state.userId = undefined;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
        sessionStorage.removeItem("redirectAfterLogin");
      }
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  setCredentials,
  updateUser,
  logout,
  updateToken,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
