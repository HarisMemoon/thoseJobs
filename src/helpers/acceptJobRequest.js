// src/helpers/acceptJobRequest.js (Final and RLS-Resistant Version)
import { supabase } from "../utils/supabase";

/**
 * Worker submits a request to accept a job.
 * Enforces that the job must be 'posted' and 'unclaimed' (worker_id is null)
 * before the worker can set their ID.
 * @param {string} jobId - The ID of the job the worker is claiming.
 * @returns {object} Result object.
 */
export const acceptJobRequest = async (jobId) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: { message: "You must be logged in to accept a job." },
    };
  }

  try {
    const { data, error } = await supabase
      .from("jobs")
      .update({
        status: "submitted",
        worker_id: user.id, // Assign the worker ID
      })
      .eq("id", jobId)
      .eq("status", "posted") // Must be in the initial state
      .is("worker_id", null) // <--- CRUCIAL FIX: Ensure job is unclaimed
      .select()
      .single();

    if (error) {
      // If error code 406 (Not Found) is returned, it means the job was already claimed.
      if (error.code === "406") {
        return {
          success: false,
          error: { message: "Job is already claimed or no longer available." },
        };
      }
      throw error;
    }

    // This handles the case where no row was updated (e.g., job status wasn't 'posted')
    if (!data) {
      return {
        success: false,
        error: {
          message: "Job is already claimed or status prevents acceptance.",
        },
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Job acceptance request failed:", error.message);
    return {
      success: false,
      error: { message: error.message || "Failed to submit job request." },
    };
  }
};
