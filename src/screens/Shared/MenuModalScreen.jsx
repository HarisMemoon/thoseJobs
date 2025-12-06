// src/screens/Shared/MenuModalScreen.js
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, Button, Divider, useTheme } from "react-native-paper";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../constants/Colors";
import { becomeProvider } from "../../helpers/becomeProvider";
import { becomeWorker } from "../../helpers/becomeWorker";

export default function MenuModalScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const { profile, signOut, role } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);

  const menuItems = [
    { name: "Home", icon: "home-outline", target: "Home" },
    { name: "About Us", icon: "information-outline", target: "About" },
    { name: "Contact Support", icon: "phone-outline", target: "Contact" },
    { name: "Account Settings", icon: "cog-outline", target: "Settings" },
  ];

  const handleNavigate = (target) => {
    navigation.goBack();
    navigation.navigate(target);
  };

  const handleLogout = async () => {
    await signOut();
    navigation.popToTop();
  };
  const handleBecomeProvider = async () => {
    setIsSwitching(true);
    await becomeProvider();
    setIsSwitching(false);
  };
  const handleSwitchToWorker = async () => {
    setIsSwitching(true);
    await becomeWorker();
    setIsSwitching(false);
  };
  const handleCloseMenu = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.popToTop();
  };

  const userDisplayName = profile?.username || profile?.email || "Guest User";

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <Icon
            name="account-circle"
            size={70}
            color={COLORS.primary}
            style={{ marginBottom: 6 }}
          />

          <Text style={styles.profileName}>{userDisplayName}</Text>

          <Text style={styles.profileRole}>
            {role ? `${role.toUpperCase()}` : "Browsing as Guest"}
          </Text>
        </View>

        <Divider style={styles.divider} />

        {/* Menu List */}
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={styles.menuItem}
            onPress={() => handleNavigate(item.target)}
          >
            <Icon name={item.icon} size={24} color={COLORS.primary} />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}

        <Divider style={styles.divider} />
        {role == "worker" ? (
          <Button
            mode="contained-tonal"
            onPress={handleBecomeProvider}
            style={styles.greenButton}
            textColor={"#22C55E"}
            loading={isSwitching}
            disabled={isSwitching}
            buttonColor="#E0F2FE"
            labelStyle={{ fontWeight: "600" }}
          >
            Become a Provider
          </Button>
        ) : null}

        {role == "provider" ? (
          <Button
            mode="contained-tonal"
            onPress={handleSwitchToWorker}
            style={styles.greenButton}
            loading={isSwitching}
            disabled={isSwitching}
            textColor={"#22C55E"}
            buttonColor="#E0F2FE"
            labelStyle={{ fontWeight: "600" }}
          >
            Become a Worker
          </Button>
        ) : null}
        {/* Logout */}
        <View style={styles.bottomButtons}>
          {profile && (
            <Button
              mode="contained-tonal"
              icon="logout"
              onPress={handleLogout}
              style={styles.logoutButton}
              buttonColor="#FEE2E2"
              textColor="#B91C1C"
              labelStyle={{ fontWeight: "600" }}
            >
              Sign Out
            </Button>
          )}

          {/* Close Menu Button */}
          <Button
            mode="contained-tonal"
            icon="close"
            onPress={handleCloseMenu}
            style={styles.closeButton}
            textColor={COLORS.primary}
            buttonColor="#E0F2FE"
            labelStyle={{ fontWeight: "600" }}
          >
            Close Menu
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  scrollContent: {
    padding: 20,
  },

  /** HEADER */
  profileHeader: {
    alignItems: "center",
    paddingVertical: 25,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textDark,
  },

  profileRole: {
    fontSize: 14,
    marginTop: 3,
    color: COLORS.textLight,
  },

  divider: {
    marginVertical: 10,
  },

  /** MENU ITEMS */
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1.5,
  },

  menuText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },

  /** BUTTONS */
  logoutButton: {
    marginTop: 15,
    paddingVertical: 6,
    borderRadius: 10,
    width: "49%",
  },

  closeButton: {
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 6,
    width: "49%",
  },
  greenButton: {
    marginTop: 15,
    paddingTop: 5,

    paddingBottom: 5,
    backgroundColor: "rgba(34,197,94,0.15)", // soft green tint (like faded red/blue)
    borderRadius: 10,
    alignItems: "center",
  },

  greenButtonLabel: {
    color: "#22C55E", // bright green text (same as Tailwind 'green-500')
    fontWeight: "600",
    fontSize: 16,
  },
  bottomButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
