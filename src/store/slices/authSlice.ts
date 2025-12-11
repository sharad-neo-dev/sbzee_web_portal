import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  phone: string | null;
  token: string | null;
  isOtpSent: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  phone: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isOtpSent: false,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    sendOtpStart: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
      state.isLoading = true;
      state.error = null;
    },

    sendOtpSuccess: (state) => {
      state.isOtpSent = true;
      state.isLoading = false;
      state.error = null;
    },

    sendOtpFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    verifyOtpStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },

    verifyOtpSuccess: (state, action: PayloadAction<string>) => {
      const token = action.payload;

      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
    },

    verifyOtpFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    logout: (state) => {
      state.phone = null;
      state.token = null;
      state.isOtpSent = false;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },

    setTokenFromStorage: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
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
  logout,
  setTokenFromStorage,
} = authSlice.actions;

export default authSlice.reducer;
