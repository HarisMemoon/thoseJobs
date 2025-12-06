// src/screens/Shared/SettingsScreen.js
import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Text, Button, useTheme } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";

export default function SettingsScreen() {
  const { signOut, role } = useAuth(); // Get the signOut function and role from context
  const theme = useTheme();

  const handleLogout = async () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            const { error } = await signOut();
            if (error) {
              Alert.alert("Logout Error", error.message);
            }
            // If successful, the AuthContext updates, session becomes null,
            // and AppNavigator automatically switches to the Login screen.
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Account Settings
      </Text>
      <Text variant="titleMedium" style={styles.roleText}>
        Logged in as: **{role?.toUpperCase() || "Unknown"}**
      </Text>

      {/* Add other settings components here */}

      <Button
        mode="contained"
        icon="logout"
        onPress={handleLogout}
        style={styles.logoutButton}
        buttonColor={theme.colors.error}
      >
        Sign Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 20,
  },
  roleText: {
    marginBottom: 40,
  },
  logoutButton: {
    marginTop: 30,
    width: "80%",
    paddingVertical: 5,
  },
});
