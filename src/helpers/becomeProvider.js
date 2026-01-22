// src/helpers/becomeProvider.js

import Toast from "react-native-toast-message";
import { supabase } from "../utils/supabase";

export const becomeProvider = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    Toast.show({
      type: "error",
      text1: "Authentication Error",
      text2: "You must be logged in to continue.",
    });
    return;
  }

  try {
    // 🔒 Check if worker has submitted ANY quotes
    const { count, error: quoteError } = await supabase
      .from("quotations")
      .select("id", { count: "exact", head: true })
      .eq("worker_id", user.id);

    if (quoteError) throw quoteError;

    if (count > 0) {
      Toast.show({
        type: "error",
        text1: "Action Not Allowed",
        text2: "You cannot become a Provider after submitting job quotes.",
      });
      return;
    }

    // ✅ Update role
    const { error } = await supabase
      .from("profiles")
      .update({ role: "provider" })
      .eq("id", user.id);

    if (error) throw error;

    Toast.show({
      type: "success",
      text1: "Role Updated",
      text2: "You are now a Provider.",
    });

    // Refresh session so role-dependent UI updates
    await supabase.auth.refreshSession();
  } catch (err) {
    console.error("Become Provider Error:", err);
    Toast.show({
      type: "error",
      text1: "Update Failed",
      text2: err.message || "Could not update role.",
    });
  }
};
