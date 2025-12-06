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
  },
  // --- Logo & Title Section ---
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoIcon: {
    marginBottom: 5,
  },
  logoText: {
    fontWeight: "800",
    color: COLORS.textDark,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 25,
    shadowColor: COLORS.textDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    marginBottom: 5,
    textAlign: "center",
    fontWeight: "700",
    color: COLORS.textDark,
  },
  subtitle: {
    marginBottom: 30,
    textAlign: "center",
    color: COLORS.textMuted,
  },
  // --- Buttons ---
  loginButton: {
    backgroundColor: COLORS.primary,
    marginTop: 15,
    borderRadius: 50,
  },
  registerButton: {
    marginTop: 10,
    backgroundColor: COLORS.secondary,
    color: COLORS.primary,
  },
  registerButtonLabel: {
    color: COLORS.textDark,
  },
  guestLinkContainer: {
    marginTop: 10,
    alignSelf: "flex-end", // Aligns to the left
  },

  guestLink: {
    color: COLORS.primary, // Or COLORS.textDark if you prefer
    fontSize: 12,
    fontWeight: "500",
    marginRight: 10,
  },
});
