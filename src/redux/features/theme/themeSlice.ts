import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ThemeMode, ThemeState } from "./theme.types";

const initialState: ThemeState = {
  mode: "light",
  accentColor: "#1fbf6a",
  isSystemTheme: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;
    },
    setSystemTheme: (state, action: PayloadAction<boolean>) => {
      state.isSystemTheme = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, setAccentColor, setSystemTheme } =
  themeSlice.actions;
export default themeSlice.reducer;
