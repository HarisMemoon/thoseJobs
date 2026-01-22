import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text, Avatar, IconButton } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { COLORS } from "../../constants/Colors";
import CustomTextInput from "../../components/CustomTextInput";

export default function EditProfileScreen({ navigation }) {
  // Mock initial state
  const [profile, setProfile] = useState({
    name: "Ahmed Khan",
    email: "ahmed.khan@email.com",
    phone: "+92 300 1234567",
    city: "Lahore, Pakistan",
    bio: "Full-stack developer looking for interesting micro-tasks.",
  });

  const [loading, setLoading] = useState(false);

  const handleUpdate = () => {
    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }, 1500);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 1. HEADER SECTION */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>EDIT{"\n"}PROFILE.</Text>
        <TouchableOpacity style={styles.avatarWrapper}>
          <Avatar.Text
            size={100}
            label={profile.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <View style={styles.cameraIconBox}>
            <Icon name="camera" size={20} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* 2. FORM SECTION */}
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>Personal Details</Text>

          <CustomTextInput
            label="Full Name"
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            icon="account-outline"
          />

          <CustomTextInput
            label="Email Address"
            value={profile.email}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
            keyboardType="email-address"
            icon="email-outline"
          />

          <CustomTextInput
            label="Phone Number"
            value={profile.phone}
            onChangeText={(text) => setProfile({ ...profile, phone: text })}
            keyboardType="phone-pad"
            icon="phone-outline"
          />

          <CustomTextInput
            label="Location"
            value={profile.city}
            onChangeText={(text) => setProfile({ ...profile, city: text })}
            icon="map-marker-outline"
          />

          <CustomTextInput
            label="Bio"
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* 3. SECURITY SECTION */}
        <TouchableOpacity style={styles.securityRow}>
          <View style={styles.securityIconBox}>
            <Icon name="lock-reset" size={24} color="#000" />
          </View>
          <Text style={styles.securityText}>Change Password</Text>
          <Icon name="chevron-right" size={24} color="#000" />
        </TouchableOpacity>

        {/* 4. SAVE BUTTON */}
        <TouchableOpacity
          style={[styles.saveButton, loading && { opacity: 0.7 }]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "SAVING..." : "SAVE CHANGES"}
          </Text>
          {!loading && <Icon name="check-bold" size={20} color="#000" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Discard Changes</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  // HEADER
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: "900",
    color: "#000",
    lineHeight: 40,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    backgroundColor: COLORS.secondary, // Cyber Lime
    borderWidth: 1,
    borderColor: "#000",
  },
  avatarLabel: {
    color: "#000",
    fontWeight: "800",
  },
  cameraIconBox: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    padding: 6,
  },

  // CONTENT
  content: { padding: 20 },

  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#000",
    padding: 20,
    marginBottom: 20,
    // Soft Lime Offset Shadow
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 20,
    color: "#000",
  },

  // SECURITY ROW
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#F3F4F6",
    marginBottom: 30,
  },
  securityIconBox: {
    marginRight: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },

  // BUTTONS
  saveButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000",
    gap: 10,
    marginBottom: 15,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#000",
    letterSpacing: 1,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textMuted,
    textDecorationLine: "underline",
  },
});
