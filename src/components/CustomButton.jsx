// src/components/CustomButton.js
import React from "react";
import { Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { COLORS } from "../constants/Colors";

/**
 * Reusable Button Component
 * @param {string} type - 'primary' (default, solid), 'secondary' (outlined)
 * @param {string} title - Button text
 * @param {object} props - Passes through standard Button props (onPress, loading, disabled, icon)
 */
export default function CustomButton({
  type = "primary",
  title,
  style,
  ...props
}) {
  const isPrimary = type === "primary";

  return (
    <Button
      mode={isPrimary ? "contained" : "outlined"}
      style={[
        styles.baseButton,
        isPrimary && styles.primaryButton,
        !isPrimary && styles.secondaryButton,
        style,
      ]}
      contentStyle={styles.buttonContent}
      labelStyle={[
        styles.baseLabel,
        isPrimary && styles.primaryLabel,
        !isPrimary && styles.secondaryLabel,
      ]}
      buttonColor={isPrimary ? COLORS.primary : "transparent"}
      textColor={isPrimary ? "#ffffff" : "#000000"}
      {...props}
    >
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  baseButtonSmall: {
    borderRadius: 999,
    // Reduce height from 52 to 36-40
    minHeight: 38,
    // Tighter horizontal padding
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  baseLabelSmall: {
    // 13-14px is the sweet spot for small buttons
    fontSize: 14,
    fontWeight: "600",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  // Use the same primary/secondary color logic as before
  primaryButtonSmall: {
    backgroundColor: COLORS.primary,
    // Smaller shadow/elevation for smaller objects
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  secondaryButtonSmall: {
    borderWidth: 1.5, // Thinner border for a smaller button
    borderColor: COLORS.primary,
    backgroundColor: "transparent",
  },
});
