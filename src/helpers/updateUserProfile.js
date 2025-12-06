// src/helpers/updateUserProfile.js
import { supabase } from "../utils/supabase";

/**
 * Updates the username of the profile matching the given user ID.
 * @param {string} userId - The UUID of the user.
 * @param {string} username - The desired unique username.
 * @returns {object} The result of the update query.
 */
export const updateUsername = async (userId, username) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ username: username })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    console.error("Profile update failed:", error);
  }

  return { data, error };
};
