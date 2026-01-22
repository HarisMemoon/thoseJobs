import React from "react";
import { TextInput, HelperText } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../constants/Colors";

export default function CustomTextInput({
  label,
  value,
  required,
  onChangeText,
  multiline,
  numberOfLines = 4,
  keyboardType,
  maxLength,
  left,
  error,
  ...props
}) {
  const finalLabel = required ? `${label} *` : label;

  return (
    <View style={styles.container}>
      <TextInput
        label={finalLabel}
        value={value}
        onChangeText={onChangeText}
        mode="outlined"
        style={[
          styles.input,
          multiline && { minHeight: numberOfLines * 20 + 40 },
        ]}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        keyboardType={keyboardType}
        maxLength={maxLength}
        left={left}
        error={!!error}
        // FLAT THEME UPDATES
        outlineColor="#000000" // Always black border
        activeOutlineColor="#000000" // Stay black even when typing
        outlineStyle={styles.outline} // Custom border weight
        theme={{
          colors: {
            // Label colors
            onSurfaceVariant: COLORS.textMuted, // Default label color
            primary: "#000000", // Focused label color
            error: "#DC2626",
          },
          roundness: 12, // Match your cards
        }}
        {...props}
      />
      {error && (
        <HelperText type="error" visible={!!error} style={styles.errorText}>
          {error}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  outline: {
    borderWidth: 1.5, // Thicker, bold border
  },
  errorText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    color: "#DC2626",
    textTransform: "uppercase",
  },
});
