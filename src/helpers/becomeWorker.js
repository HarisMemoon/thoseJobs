// src/helpers/becomeWorker.js

import { Alert } from "react-native";
import { supabase } from "../utils/supabase"; // Ensure the path is correct

export const becomeWorker = async () => {
  // Use the asynchronous method to get the current user object
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    Alert.alert("Error", "You must be logged in to switch roles.");
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role: "worker" }) // Set the role back to 'worker'
    .eq("id", user.id); // Update only the current user's profile

  if (error) {
    Alert.alert("Role Update Error", error.message);
    console.error("Supabase Role Update Error:", error.message);
  } else {
    Alert.alert(
      "Success",
      "You are now a Worker! Your view will update shortly."
    );

    // CRUCIAL: Force the AuthContext to re-fetch the new role from the database.
    // This tells the AppNavigator to switch from ProviderNavigator to WorkerNavigator.
    supabase.auth.refreshSession();
  }
};
