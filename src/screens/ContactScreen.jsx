// src/screens/Auth/RegisterScreen.js
import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useAuth } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../utils/supabase";
import Toast from "react-native-toast-message";

export default function ContactScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match.",
      });
      return;
    }

    setLoading(true);

    // This performs the standard Supabase Auth signup
    // The Postgres trigger automatically creates the 'worker' profile
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Toast.show({
        type: "error",
        text1: "Signup Error",
        text2: error.message,
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Loggeed In",
        text2: error.message,
      });
      // Navigate back to login screen
      navigation.goBack();
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Join ThoseJobs
      </Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Sign up as a Job Seeker (Worker) and start finding projects.
      </Text>

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSignUp}
        loading={loading}
        disabled={loading || !email || !password || !confirmPassword}
        style={styles.button}
      >
        Register & Find Jobs
      </Button>

      <Button
        mode="text"
        onPress={() => navigation.navigate("Login")}
        style={styles.textButton}
      >
        Already have an account? Sign In
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 8,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 30,
    textAlign: "center",
    color: "#777",
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
  textButton: {
    marginTop: 15,
  },
});
