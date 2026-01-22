// src/constants/Colors.js

import { DefaultTheme } from "react-native-paper";

export const COLORS = {
  primary: "#0846BC", // Your brand blue
  secondary: "#FEF08A",
  green: "#EDFCF3",
  yellow: "#FEF9C2",
  purple: "#D3C0F9",
  lightPurple: "#FAF5FF",
  pink: "#FFC1E3",
  blue: "#D0E8FF",
  lightBlue: "#E0F2FE",
  orange: "#FFD8B1",
  burntOrange: "#FB923C",
  red: "#FFE1E1",
  darkRed: "#F87171",
  darkGreen: "#22C55E",
  // primary: "#0145FA", // Your brand blue
  // secondary: "#ffd856",
  backgroundLight: "#F7F8FC", // A slightly off-white/very light gray for screen background
  surface: "#FFFFFF", // Pure white for cards, inputs, buttons
  textDark: "#1F2937", // Dark gray for main text
  textMuted: "#6B7280", // Medium gray for subtitles/hints
  accentHighlight: "#D1D5DB", // Light gray for borders/dividers
};

// Create a custom theme using your primary color
export const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    background: COLORS.backgroundLight,
    surface: COLORS.surface,
  },
};
