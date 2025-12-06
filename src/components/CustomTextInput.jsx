// src/components/CustomTextInput.js
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
  numberOfLines,
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
        style={styles.input}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        maxLength={maxLength}
        left={left}
        error={!!error}
        {...props}
      />
      {error && (
        <HelperText type="error" visible={error}>
          {error}
        </HelperText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15, // Standard vertical spacing
  },
  input: {
    backgroundColor: COLORS.surface,
    height: 40, // Standard background color
    // The borderColor from styles.input is handled by 'mode="outlined"' in Paper,
    // but we ensure the container spacing is correct.
  },
});
