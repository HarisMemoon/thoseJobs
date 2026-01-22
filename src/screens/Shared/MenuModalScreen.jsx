// src/screens/Shared/MenuModalScreen.js - Enhanced Premium UI
// src/screens/Shared/MenuModalScreen.js

import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, Button, Divider, Surface, Avatar } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../constants/Colors";
import { becomeProvider } from "../../helpers/becomeProvider";
import { becomeWorker } from "../../helpers/becomeWorker";
import CustomButton from "../../components/CustomButton";

export default function MenuModalScreen() {
  const navigation = useNavigation();
  const { profile, signOut, role } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);

  const menuItems = [
    { name: "Home", icon: "home-outline", target: "Home" },
    { name: "About Us", icon: "information-outline", target: "About" },
    { name: "Contact Support", icon: "phone-outline", target: "Contact" },
    { name: "Account Settings", icon: "cog-outline", target: "Settings" },
  ];

  /** SAFEST CLOSE HANDLER */
  const safeClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleNavigate = (target) => {
    safeClose();
    requestAnimationFrame(() => {
      navigation.navigate(target);
    });
  };

  const handleLogout = async () => {
    await signOut();
    safeClose();
  };

  const handleBecomeProvider = async () => {
    setIsSwitching(true);
    await becomeProvider();
    setIsSwitching(false);
    safeClose(); // close menu after role switch
  };

  const handleSwitchToWorker = async () => {
    setIsSwitching(true);
    await becomeWorker();
    setIsSwitching(false);
    safeClose(); // close menu after role switch
  };

  const userDisplayName = profile?.username || profile?.email || "Guest User";
  const initials = userDisplayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const getRoleBadgeStyle = () => {
    if (role === "provider") {
      return { backgroundColor: "#DBEAFE", color: "#1E40AF", text: "PROVIDER" };
    }
    if (role === "worker") {
      return { backgroundColor: "#D1FAE5", color: "#065F46", text: "WORKER" };
    }
    return { backgroundColor: "#F3F4F6", color: "#6B7280", text: "GUEST" };
  };

  const roleBadge = getRoleBadgeStyle();

  return (
    <View style={styles.container}>
      {/* TOP RIGHT CLOSE (X) */}
      <TouchableOpacity style={styles.crossButton} onPress={safeClose}>
        <Icon name="close" size={26} color="#000" />
      </TouchableOpacity>

      <View style={styles.headerGradient}>
        <Surface style={styles.profileCard} elevation={3}>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={80}
              label={initials}
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
            <View style={styles.onlineIndicator} />
          </View>

          <Text style={styles.profileName}>{userDisplayName}</Text>

          <View
            style={[
              styles.roleBadge,
              { backgroundColor: roleBadge.backgroundColor },
            ]}
          >
            <Text style={[styles.roleBadgeText, { color: roleBadge.color }]}>
              {roleBadge.text}
            </Text>
          </View>
        </Surface>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Navigation</Text>

          {menuItems.map((item, index) => (
            <React.Fragment key={item.name}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate(item.target)}
              >
                <View style={styles.menuIconContainer}>
                  <Icon name={item.icon} size={22} />
                </View>
                <Text style={styles.menuText}>{item.name}</Text>
                <Icon name="chevron-right" size={20} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && (
                <Divider style={styles.menuDivider} />
              )}
            </React.Fragment>
          ))}
        </Surface>

        {(role === "worker" || role === "provider") && (
          <Surface style={styles.switchSection}>
            <Text style={styles.sectionTitle}>Switch Role</Text>

            {role === "worker" && (
              <TouchableOpacity
                style={styles.switchCard}
                onPress={handleBecomeProvider}
                disabled={isSwitching}
              >
                <Icon name="briefcase" size={24} />
                <Text style={styles.switchTitle}>Become Provider</Text>
              </TouchableOpacity>
            )}

            {role === "provider" && (
              <TouchableOpacity
                style={styles.switchCardWorker}
                onPress={handleSwitchToWorker}
                disabled={isSwitching}
              >
                <Icon name="account-hard-hat" size={24} />
                <Text style={styles.switchTitle}>Become Worker</Text>
              </TouchableOpacity>
            )}
          </Surface>
        )}

        <CustomButton
          type="primary"
          style={styles.logoutButton}
          title="Sign Out"
          mode="outlined"
          onPress={handleLogout}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  crossButton: {
    position: "absolute",
    top: 25,
    right: 3,
    zIndex: 10,
    padding: 6,
  },
  // Flat Header (Replaced Gradient with Solid/Border)
  headerGradient: {
    backgroundColor: COLORS.surface,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },

  profileCard: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 12, // Standardized radius
    borderWidth: 1,
    borderColor: "#000000",
    elevation: 0, // Kill shadow
    shadowOpacity: 0,
    marginTop: 10, // Overlap slightly with header if desired
    marginHorizontal: 20,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },

  avatar: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#000000",
  },

  avatarLabel: {
    fontSize: 32,
    fontWeight: "800",
    color: "#000000",
  },

  onlineIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#10B981", // Keep green for status
    borderWidth: 1,
    borderColor: "#000000",
  },

  profileName: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 4,
  },

  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 999, // Pill shape
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: COLORS.surface,
  },

  roleBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    color: "#000000",
  },

  scrollContent: {
    padding: 20,
  },

  // Menu Section (Flat White Box)
  menuSection: {
    backgroundColor: COLORS.lightPurple,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#000000",
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#000000",
    marginVertical: 4,
  },

  // Switch Section
  switchSection: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#000000",
    marginTop: 15,
  },

  switchCard: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: COLORS.lightBlue,
  },
  switchCardWorker: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.green,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#000000",
  },

  switchIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  switchTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textDark,
    marginLeft: 8,
    textAlign: "center",
  },

  switchSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "600",
  },

  // Action Buttons
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  logoutButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: "#000000",
    backgroundColor: COLORS.darkRed, // Very light red for warning
    marginTop: 15,
  },

  closeButton: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "#000000", // Black button for primary action
    marginTop: 15,
  },

  buttonLabel: {
    fontWeight: "800",
    fontSize: 14,
    textTransform: "uppercase",
  },
});
