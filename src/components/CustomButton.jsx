// src/components/CustomButton.js
import React from "react";
import { Button, View } from "react-native-paper";
import { StyleSheet } from "react-native";
import { COLORS } from "../constants/Colors";

/**
 * Reusable Button Component
 * @param {string} type - 'primary' (default, solid blue), 'secondary' (contained-tonal/upload)
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
  const isSecondary = type === "secondary";

  return (
    <Button
      mode={isPrimary ? "contained" : "contained-tonal"}
      // Apply standard submit button dimensions/shape/shadow for primary type
      style={[
        styles.baseButton,
        isPrimary ? styles.submitButton : styles.uploadButton,
        style,
      ]}
      contentStyle={styles.buttonContent}
      labelStyle={
        isPrimary ? styles.submitButtonLabel : styles.uploadButtonLabel
      }
      buttonColor={isPrimary ? COLORS.primary : COLORS.accentHighlight}
      {...props}
    >
      {title}
    </Button>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    height: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    paddingVertical: 0,
  },
  // Matches the styles.uploadButton from the original code
  uploadButton: {
    backgroundColor: COLORS.accentHighlight,
  },
  uploadButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark, // Ensure contrast against light background
  },
  // Matches the styles.submitButton from the original code
  submitButton: {
    // Shadow and elevation styles from original submitButton
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  submitButtonLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
});
