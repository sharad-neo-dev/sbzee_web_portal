import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "./auth.types";

const initialState: AuthState = {
  user: null,
  isAuthenticated: true,
  accessToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjY5OTQ5MDcyNTc3OGNkMmFkODRmOSIsInVzZXJUeXBlIjoiY3VzdG9tZXIiLCJpYXQiOjE3NjY5OTk0MzQsImV4cCI6MTc5ODUzNTQzNH0.ziTJdx7VsYIPUSqAUgOt0VndGrWkr9VydygRckztcLo",
  // accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjY5OTQ5MDcyNTc3OGNkMmFkODRmOSIsInVzZXJUeXBlIjoiY3VzdG9tZXIiLCJpYXQiOjE3NjY5OTk0MzQsImV4cCI6MTc5ODUzNTQzNH0.ziTJdx7VsYIPUSqAUgOt0VndGrWkr9VydygRckztcLo",
  refreshToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MjY5OTQ5MDcyNTc3OGNkMmFkODRmOSIsInVzZXJUeXBlIjoiY3VzdG9tZXIiLCJpYXQiOjE3NjY5OTk0MzQsImV4cCI6MTc5ODUzNTQzNH0.ziTJdx7VsYIPUSqAUgOt0VndGrWkr9VydygRckztcLo",
  otp: {
    phone: "",
    userId: null,
    isLoading: false,
    error: null,
    isOtpSent: false,
    isVerifying: false,
    verifyError: null,
  },
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
      state.otp = initialState.otp;
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
      state.otp = initialState.otp;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth");
      }
    },

    // OTP Actions
    setOtpPhone: (state, action: PayloadAction<string>) => {
      state.otp.phone = action.payload;
    },

    setOtpUserId: (state, action: PayloadAction<string | null>) => {
      state.otp.userId = action.payload;
    },

    sendOtpStart: (state) => {
      state.otp.isLoading = true;
      state.otp.error = null;
    },

    sendOtpSuccess: (state) => {
      state.otp.isLoading = false;
      state.otp.isOtpSent = true;
      state.otp.error = null;
    },

    sendOtpFailure: (state, action: PayloadAction<string>) => {
      state.otp.isLoading = false;
      state.otp.error = action.payload;
      state.otp.isOtpSent = false;
    },

    verifyOtpStart: (state) => {
      state.otp.isVerifying = true;
      state.otp.verifyError = null;
    },

    verifyOtpSuccess: (state) => {
      state.otp.isVerifying = false;
      state.otp.verifyError = null;
    },

    verifyOtpFailure: (state, action: PayloadAction<string>) => {
      state.otp.isVerifying = false;
      state.otp.verifyError = action.payload;
    },

    resetOtpState: (state) => {
      state.otp = initialState.otp;
    },
  },
});

export const {
  setCredentials,
  logout,
  updateToken,
  setOtpPhone,
  setOtpUserId,
  sendOtpStart,
  sendOtpSuccess,
  sendOtpFailure,
  verifyOtpStart,
  verifyOtpSuccess,
  verifyOtpFailure,
  resetOtpState,
} = authSlice.actions;

export default authSlice.reducer;
