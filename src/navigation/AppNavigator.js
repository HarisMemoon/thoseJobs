// src/navigation/AppNavigator.js
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

// Screens & Navigators
import RegisterScreen from "../screens/Auth/RegisterScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import JobsScreen from "../screens/JobsScreen";
import AboutScreen from "../screens/AboutScreen";
import ContactScreen from "../screens/ContactScreen";
import SettingsScreen from "../screens/Shared/SettingsScreen"; // Use the shared settings screen for the menu link
import MenuModalScreen from "../screens/Shared/MenuModalScreen"; // NEW IMPORT
import AppHeader from "../components/AppHeader"; // NEW IMPORT
import ProviderNavigator from "./ProviderNavigator";
import WorkerNavigator from "./WorkerNavigator";
import AdminNavigator from "./AdminNavigator";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator(); // Main Root Stack
const AuthStack = createStackNavigator(); // New Stack for Login/Register/Public Tabs

// --- Helper function to create a unified header ---
const commonScreenOptions = ({ navigation, route }) => ({
  headerShown: true, // IMPORTANT: Ensure header is shown
  header: ({ options }) => (
    <AppHeader
      onMenuPress={() => navigation.navigate("MenuModal")}
      // title={options.title} // Title is handled by the component
    />
  ),
});

// --- 1. Public Tab Navigator (Simplified) ---
function PublicNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        ...commonScreenOptions({ navigation, route }), // Apply custom header
        tabBarActiveTintColor: "#34495e",
        tabBarInactiveTintColor: "#94a3b8",
        // ONLY Home and Jobs remain in the bottom tab for guests/public users
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Jobs") iconName = "briefcase-search";
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Jobs" component={JobsScreen} />
      {/* About and Contact are removed from the bottom tabs */}
    </Tab.Navigator>
  );
}

// --- 2. Public Authentication Stack (The flow for logged out users) ---
function PublicAuthStack() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      {/* Login and Register screens don't need the custom app header */}
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />

      {/* PublicTabs applies the custom header */}
      <AuthStack.Screen name="PublicTabs" component={PublicNavigator} />
    </AuthStack.Navigator>
  );
}
function LoadingRoleScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#34495e" />
    </View>
  );
}
// --- 3. Root Navigator (Role Selection Logic) ---
export default function AppNavigator() {
  const { session, role, loading } = useAuth();

  if (loading) {
    // Show a loading spinner while checking session/role
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34495e" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* The main Stack Navigator needs to register the MenuModalScreen */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* A. Auth Flow */}
        {!session ? (
          <Stack.Screen name="AuthFlow" component={PublicAuthStack} />
        ) : role === null ? (
          <Stack.Screen name="LoadingRole" component={LoadingRoleScreen} />
        ) : (
          <>
            {role === "admin" && (
              <Stack.Screen name="AdminDashboard" component={AdminNavigator} />
            )}

            {role === "provider" && (
              <Stack.Screen
                name="ProviderDashboard"
                component={ProviderNavigator}
              />
            )}

            {role === "worker" && (
              <Stack.Screen
                name="WorkerDashboard"
                component={WorkerNavigator}
              />
            )}
          </>
        )}

        {/* C. Global Modal Screens (Accessible from any screen via the Menu button) */}
        <Stack.Screen
          name="MenuModal"
          component={MenuModalScreen}
          options={{ presentation: "modal", headerShown: false }} // Use a clean modal presentation
        />
        {/* Register global access to Home/About/Contact/Settings for navigation from the MenuModal */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={commonScreenOptions}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={commonScreenOptions}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={commonScreenOptions}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={commonScreenOptions}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
