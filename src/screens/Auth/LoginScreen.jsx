// src/screens/Auth/LoginScreen.js (Refactored for Modern UI & Components)
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, useTheme } from "react-native-paper"; // Removed TextInput, Button
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons"; // For logo icon
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../../constants/Colors"; // Import COLORS
import CustomTextInput from "../../components/CustomTextInput"; // NEW IMPORT
import CustomButton from "../../components/CustomButton"; // NEW IMPORT
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBrowseAsGuest = () => {
    navigation.navigate("PublicTabs");
  };

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await signIn(email, password);

    if (error) {
      Toast.show({
        type: "error",
        text1: "Login Error",
        text2: error.message,
      });
    }
    setLoading(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={{ backgroundColor: COLORS.backgroundLight }}
    >
      <View style={styles.logoContainer}>
        <Icon
          name="tools"
          size={48}
          color={COLORS.primary}
          style={styles.logoIcon}
        />
        <Text variant="headlineLarge" style={styles.logoText}>
          ThoseJobs
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Sign In
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Securely access your escrow-backed dashboard.
        </Text>

        {/* --- Custom Text Inputs --- */}
        <CustomTextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomTextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* --- Custom Primary Button (Login) --- */}

        <CustomButton
          type="primary"
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          disabled={loading || !email || !password}
          style={styles.loginButton}
        />
        {/* --- Secondary Actions --- */}

        {/* Register Link */}
        <CustomButton
          type="text"
          title="Browse as Guest"
          onPress={handleBrowseAsGuest}
          style={styles.registerButton}
          labelStyle={styles.registerButtonLabel}
        />

        {/* Guest Browsing */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          style={styles.guestLinkContainer}
        >
          <Text style={styles.guestLink}>Don't have an account? Join Now.</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFFFFF", // Keep base clean
  },

  // --- Logo & Title Section ---
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoIcon: {
    marginBottom: 10,
    // Optional: add a small black border box around your logo icon
    padding: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "900", // Heavy weight
    color: "#000000",
    letterSpacing: -1,
  },

  // --- Main Card (Flat UI Update) ---
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 25,
    borderWidth: 2,
    borderColor: "#000000",
  },

  title: {
    fontSize: 24,
    marginBottom: 6,
    textAlign: "center",
    fontWeight: "900",
    color: "#000000",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 30,
    textAlign: "center",
    color: COLORS.textMuted,
    fontWeight: "600",
  },

  // --- Buttons (Pill Shaped & High Contrast) ---
  loginButton: {
    backgroundColor: COLORS.primary, // Action color
    marginTop: 20,
    borderRadius: 999, // Pill shape
    borderWidth: 2,
    borderColor: "#000000",
  },
  registerButton: {
    marginTop: 12,
    backgroundColor: "transparent",
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#000000",
  },
  registerButtonLabel: {
    color: "#000000",
    fontWeight: "800",
    fontSize: 14,
  },

  // --- Links ---
  guestLinkContainer: {
    marginTop: 15,
    alignSelf: "center", // Center looks better on auth screens
  },
  guestLink: {
    color: "#000000",
    fontSize: 13,
    fontWeight: "700",
    textDecorationLine: "underline", // Make it look clickable
  },
});
