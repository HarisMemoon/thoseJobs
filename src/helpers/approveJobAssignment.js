// src/helpers/approveJobAssignment.js
import { supabase } from "../utils/supabase";

/**
 * Provider approves a worker's submission, finalizing the assignment.
 * Moves job status from 'submitted' to 'accepted'.
 * @param {string} jobId - The job ID to approve.
 * @returns {object} Result object.
 */
export const approveJobAssignment = async (jobId) => {
  try {
    const { data, error } = await supabase
      .from("jobs")
      .update({ status: "accepted" }) // Final status change
      .eq("id", jobId)
      .eq("status", "submitted") // Crucial: Only approve jobs currently in 'submitted' status
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Job approval failed:", error.message);
    return {
      success: false,
      error: { message: error.message || "Failed to approve assignment." },
    };
  }
};
