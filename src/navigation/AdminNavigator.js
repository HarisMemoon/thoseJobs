// src/navigation/AdminNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import MetricsOverviewScreen from "../screens/Admin/MetricsOverviewScreen";
import UsersScreen from "../screens/Admin/UsersScreen";
import JobsDisputesScreen from "../screens/Admin/JobsDisputesScreen";
import FinancePayoutsScreen from "../screens/Admin/FinancePayoutsScreen";
import AppHeader from "../components/AppHeader"; // Ensure this path is correct

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
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
  });

  return (
    <Tab.Navigator screenOptions={commonScreenOptions}>
      <Tab.Screen
        name="Metrics/Overview"
        component={MetricsOverviewScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="view-dashboard" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Users"
        component={UsersScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Jobs & Disputes"
        component={JobsDisputesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="gavel" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Finance & Payouts"
        component={FinancePayoutsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cash-multiple" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
