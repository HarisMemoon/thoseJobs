// src/helpers/becomeWorker.js

import Toast from "react-native-toast-message";
import { supabase } from "../utils/supabase";

export const becomeWorker = async () => {
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
    // 🔒 Check if provider has posted ANY jobs
    const { count, error: jobError } = await supabase
      .from("jobs")
      .select("id", { count: "exact", head: true })
      .eq("provider_id", user.id);

    if (jobError) throw jobError;

    if (count > 0) {
      Toast.show({
        type: "error",
        text1: "Action Not Allowed",
        text2: "You cannot switch to Worker after posting jobs.",
      });
      return;
    }

    // ✅ Update role
    const { error } = await supabase
      .from("profiles")
      .update({ role: "worker" })
      .eq("id", user.id);

    if (error) throw error;

    Toast.show({
      type: "success",
      text1: "Role Updated",
      text2: "You are now a Worker.",
    });

    // Refresh session so role-dependent UI updates
    await supabase.auth.refreshSession();
  } catch (err) {
    console.error("Become Worker Error:", err);
    Toast.show({
      type: "error",
      text1: "Update Failed",
      text2: err.message || "Could not update role.",
    });
  }
};
