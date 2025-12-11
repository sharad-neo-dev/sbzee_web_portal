import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
  accentColor: string;
  isSystemTheme: boolean;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem("theme") as ThemeMode;
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  return savedTheme || (systemPrefersDark ? "dark" : "light");
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
  accentColor: "#1fbf6a",
  isSystemTheme: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", state.mode);
        document.documentElement.classList.toggle(
          "dark",
          state.mode === "dark"
        );
      }
    },

    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.isSystemTheme = false;

      if (typeof window !== "undefined") {
        localStorage.setItem("theme", action.payload);
        document.documentElement.classList.toggle(
          "dark",
          action.payload === "dark"
        );
      }
    },

    useSystemTheme: (state) => {
      if (typeof window !== "undefined") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        state.mode = systemPrefersDark ? "dark" : "light";
        state.isSystemTheme = true;
        localStorage.removeItem("theme");
        document.documentElement.classList.toggle("dark", systemPrefersDark);
      }
    },

    setAccentColor: (state, action: PayloadAction<string>) => {
      state.accentColor = action.payload;

      if (typeof window !== "undefined") {
        document.documentElement.style.setProperty("--accent", action.payload);
      }
    },
  },
});

export const { toggleTheme, setTheme, useSystemTheme, setAccentColor } =
  themeSlice.actions;
export default themeSlice.reducer;
