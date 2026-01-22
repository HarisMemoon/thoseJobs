// src/components/AppHeader.js
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function AppHeader({ onMenuPress }) {
  const theme = useTheme();
  const { profile } = useAuth();

  const userName =
    profile?.username || profile?.email?.split("@")[0] || "Guest";

  return (
    <View style={styles.header}>
      {/* LEFT — Menu Button */}
      <View style={{ width: 28 }} />

      {/* CENTER — Logo */}
      <View style={styles.logoContainer}>
        <Icon name="tools" size={24} color={theme.colors.primary} />
        <Text
          variant="titleLarge"
          style={[styles.logoText, { color: theme.colors.primary }]}
        >
          ThoseJobs
        </Text>
      </View>

      {/* RIGHT — Empty placeholder to balance center alignment */}
      <TouchableOpacity
        onPress={onMenuPress}
        style={styles.menuButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Icon name="menu" size={28} color="#4B5563" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 40,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  logoContainer: {
    marginRight: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontWeight: "800",
    marginLeft: 5,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileBadge: {
    alignItems: "flex-end",
    marginRight: 10,
    paddingHorizontal: 5,
  },
  profileText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    maxWidth: 100, // Prevent overflow
  },
  roleText: {
    fontSize: 11,
    color: "#6B7280",
    textTransform: "capitalize",
  },
  menuButton: {
    marginLeft: 10,
  },
});
