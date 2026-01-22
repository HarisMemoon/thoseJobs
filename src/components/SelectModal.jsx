import React from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Modal, Portal, Text, Divider } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { COLORS } from "../constants/Colors";

export default function SelectModal({
  visible,
  onDismiss,
  onSelect,
  selectedItem,
  items,
  title,
  labels,
}) {
  const handleSelect = (item) => {
    onSelect(item);
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        {/* CLOSE */}
        <Pressable onPress={onDismiss} style={styles.closeIcon}>
          <Icon name="close" size={22} color="#6B7280" />
        </Pressable>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.titleText}>{title || "Choose an option"}</Text>
          <Text style={styles.subtitle}>Select one to continue</Text>
        </View>

        <Divider style={styles.divider} />

        {/* LIST */}
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item, index) => {
            const label =
              item === null ? "Not Selected" : labels?.[index] ?? String(item);

            const isSelected = item === selectedItem;

            return (
              <Pressable
                key={item ?? `null-${index}`}
                onPress={() => handleSelect(item)}
                style={({ pressed }) => [
                  styles.optionRow,
                  isSelected && styles.optionSelected,
                  pressed && styles.optionPressed,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {label}
                </Text>

                {/* RIGHT INDICATOR */}
                <Icon
                  name={isSelected ? "check-circle" : "chevron-right"}
                  size={20}
                  color={isSelected ? COLORS.primary : "#9CA3AF"}
                />
              </Pressable>
            );
          })}
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    paddingTop: 24,
    paddingBottom: 10,
    paddingHorizontal: 18,
    marginHorizontal: 22,

    // THE FLAT UI UPDATE
    borderRadius: 12, // Match your card radius
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5, // Solid black border
    borderColor: "#000000",
    elevation: 0, // Kill the shadow
  },

  closeIcon: {
    position: "absolute",
    right: 14,
    top: 14,
    padding: 6,
    zIndex: 10,
    // Optional: add a border to the close icon to make it a tiny box

    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },

  header: {
    paddingBottom: 12,
    paddingRight: 32,
  },

  titleText: {
    fontSize: 22,
    fontWeight: "800", // Heavier for the high-contrast look
    color: COLORS.textDark,
  },

  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: "600",
  },

  divider: {
    height: 1.5,
    backgroundColor: "#000000", // Solid black divider
    marginBottom: 8,
  },

  scrollArea: {
    maxHeight: 360,
    paddingVertical: 6,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 10,

    // Plain look for options
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB", // Subtle border for non-selected
  },

  optionPressed: {
    backgroundColor: "#F3F4F6", // Light grey on press
  },

  optionSelected: {
    backgroundColor: "#FFFFFF",
    borderColor: "#000000", // Black border for selected
    borderWidth: 0.5, // Thicker border for selected
  },

  optionText: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#000000",
    fontWeight: "800",
  },
});
