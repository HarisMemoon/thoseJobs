// src/components/SelectModal.js (Modern Enhanced Version)
import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
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
        {/* Cross Icon */}
        <TouchableOpacity onPress={onDismiss} style={styles.closeIcon}>
          <Icon name="close" size={22} color="#777" />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.header}>
          <Text variant="titleLarge" style={styles.titleText}>
            {title || "Select Option"}
          </Text>
        </View>

        <Divider style={styles.divider} />

        {/* Scrollable Options */}
        <ScrollView
          style={styles.scrollArea}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item) => {
            const isSelected = item === selectedItem;

            return (
              <TouchableOpacity
                key={item}
                onPress={() => handleSelect(item)}
                activeOpacity={0.8}
                style={[
                  styles.optionRow,
                  isSelected && styles.optionRowSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>

                {isSelected && (
                  <Icon
                    name="check-circle"
                    size={22}
                    color={COLORS.primary}
                    style={{ marginLeft: 10 }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 22,
    marginHorizontal: 25,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 5,
    position: "relative",
  },

  closeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
    padding: 6,
    zIndex: 10,
  },

  header: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 24,
  },

  titleText: {
    fontWeight: "700",
    color: COLORS.textDark,
    fontSize: 20,
  },

  divider: {
    backgroundColor: COLORS.accentHighlight,
    marginBottom: 8,
  },

  scrollArea: {
    maxHeight: 330,
    paddingVertical: 4,
  },

  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
  },

  optionRowSelected: {
    backgroundColor: "rgba(37, 99, 235, 0.15)", // sub 15% opacity
  },

  optionText: {
    fontSize: 17,
    color: COLORS.textDark,
    fontWeight: "500",
  },

  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
