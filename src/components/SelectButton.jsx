// src/components/SelectButton.js
import React from "react";
import { TouchableRipple, Text } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../constants/Colors";

/**
 * Reusable Select Button Component (for Category, Date, etc.)
 * @param {string} label - Button label text
 * @param {string} value - Selected value to display
 * @param {function} onPress - Function to call when pressed
 */
export default function SelectButton({ label, value, onPress }) {
  return (
    <TouchableRipple
      style={styles.container}
      onPress={onPress}
      rippleColor="rgba(0, 0, 0, 0.05)"
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12, // Match the 12px radius of your cards
    borderWidth: 1.5, // Thicker, intentional border
    borderColor: "#000000", // Solid black
    overflow: "hidden",
    marginBottom: 12, // Added spacing for form flow
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10, // Slightly more breathing room
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 11, // Smaller and bolder for "Utility" look
    color: COLORS.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "700", // Bolder value for readability
  },
  arrow: {
    // If using an Icon component, use these; if using text, keep the size
    fontSize: 24,
    color: "#000000", // Black arrow for consistency
    marginLeft: 12,
  },
});
