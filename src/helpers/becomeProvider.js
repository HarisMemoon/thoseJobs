// src/helpers/becomeProvider.js

// Make sure to import the necessary components:
import { Alert } from "react-native";
import { supabase } from "../utils/supabase"; // <-- ENSURE THIS PATH IS CORRECT

export const becomeProvider = async () => {
  // Use the synchronous method to get the current user session data
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    Alert.alert("Error", "You must be logged in to become a provider.");
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: "provider" })
    .eq("id", user.id); // Use user.id from the retrieved object

  if (error) {
    Alert.alert("Role Update Error", error.message);
    console.error("Supabase Role Update Error:", error.message);
  } else {
    Alert.alert(
      "Success",
      "You are now a Provider! Your view will update shortly."
    );

    // CRUCIAL: Force the AuthContext to re-fetch the new role from the database.
    // This tells the AppNavigator to switch from WorkerNavigator to ProviderNavigator.
    supabase.auth.refreshSession();
  }
};
