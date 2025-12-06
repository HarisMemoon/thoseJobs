// src/navigation/WorkerNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import JobsScreen from "../screens/JobsScreen";
import MyApplicationsScreen from "../screens/Worker/MyApplicationsScreen";
import Wallet from "../screens/Worker/Wallet";
import Profile from "../screens/Worker/Profile";
import AppHeader from "../components/AppHeader";

const Tab = createBottomTabNavigator();

export default function WorkerNavigator() {
  // Helper function to define the custom header and menu access
  const commonScreenOptions = ({ navigation }) => ({
    headerShown: true,
    header: ({ options }) => (
      <AppHeader
        onMenuPress={() => navigation.navigate("MenuModal")}
        title={options.title}
      />
    ),
    tabBarActiveTintColor: "#34495e",
    tabBarInactiveTintColor: "#94a3b8",
  });

  return (
    <Tab.Navigator screenOptions={commonScreenOptions}>
      <Tab.Screen
        name="Jobs Available"
        component={JobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="briefcase-search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="My Work"
        component={MyApplicationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="folder-check" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="wallet" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
      {/* Profile and Settings tabs removed as they are now in MenuModal */}
    </Tab.Navigator>
  );
}
