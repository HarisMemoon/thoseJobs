// src/screens/Auth/RegisterScreen.js
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../utils/supabase";

import { COLORS } from "../../constants/Colors";
import CustomTextInput from "../../components/CustomTextInput";
import CustomButton from "../../components/CustomButton";
import { updateUsername } from "../../helpers/updateUserProfile"; // NEW IMPORT
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(""); // Now required
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    // 1. Client-side Validation (All fields now required)
    if (!email || !username || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "All fields are required for registration.",
        text2: error.message,
      });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);

    // 2. Perform Supabase Auth signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      Toast.show({
        type: "error",
        text1: "Signup Error",
        text2: authError.message,
      });
      setLoading(false);
      return;
    }

    // 3. Post-Signup: Update Profile with Username
    // The user's profile is auto-created by the trigger, now we update it.
    const user = authData.user;
    if (user) {
      const { error: profileError } = await updateUsername(user.id, username);

      if (profileError) {
        // Note: Handle unique username constraint violation here

        Toast.show({
          type: "error",
          text1: "Username Error",
          text2: "The chosen username is already taken or invalid.",
        });
        // You might want to log out the user here if profile update is critical:
        // await supabase.auth.signOut();
        setLoading(false);
        return;
      }
    }

    // 4. Success and Navigation
    Toast.show({
      type: "success",
      text1: "User created successfully!!",
    });
    navigation.goBack();
    setLoading(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={{ backgroundColor: COLORS.backgroundLight }}
    >
      <View style={styles.formContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          Join ThoseJobs
        </Text>

        <Text variant="bodyMedium" style={styles.subtitle}>
          Sign up as a Worker and start finding projects immediately.
        </Text>
        {/* --- Custom Text Inputs --- */}

        <CustomTextInput
          label="Email"
          required={true}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomTextInput
          label="Username "
          required={true}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <CustomTextInput
          label="Password "
          required={true}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomTextInput
          label="Confirm Password "
          required={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {/* --- Custom Primary Button (Register) --- */}

        <CustomButton
          type="text"
          title="Register & Find Jobs"
          required={true}
          onPress={handleSignUp}
          loading={loading}
          disabled={loading || !email || !password || !confirmPassword}
          style={styles.registerButton}
        />

        {/* --- Back to Login Link --- */}

        <TouchableOpacity
          style={styles.guestLinkContainer}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.guestLink}>Already have an account? Sign In</Text>
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
    color: COLORS.textDark,
  },
  registerButton: {
    marginTop: 20,
    backgroundColor: COLORS.secondary, // Using primary color for consistency
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
