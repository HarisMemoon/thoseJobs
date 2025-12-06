// src/navigation/ProviderNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import MyJobsScreen from "../screens/Provider/MyJobsScreen";
import PostJobScreen from "../screens/Provider/PostJobScreen";
import PaymentsScreen from "../screens/Provider/PaymentsScreen";
import AppHeader from "../components/AppHeader"; // Ensure this path is correct

const Tab = createBottomTabNavigator();

export default function ProviderNavigator() {
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
        name="My Jobs"
        component={MyJobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="format-list-checks" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Post a Job"
        component={PostJobScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-circle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="wallet" color={color} size={size} />
          ),
        }}
      />
      {/* Settings tab removed as it is now in MenuModal */}
    </Tab.Navigator>
  );
}
