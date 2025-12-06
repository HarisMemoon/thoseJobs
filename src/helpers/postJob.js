// src/helpers/postJob.js
import { Alert } from "react-native";
// Assuming the supabase client is configured and available at this path:
import { supabase } from "../utils/supabase";

/**
 * Inserts a new job into the 'jobs' table.
 * Automatically assigns the current authenticated user as the provider_id.
 * * @param {object} jobDetails - Object containing job data from PostJobScreen state.
 * @returns {object} Response object with success or error.
 */
export const postJob = async (jobDetails) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: { message: "User not authenticated. Please log in." },
    };
  }

  try {
    // Attempt to insert the job data into the 'jobs' table
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        provider_id: user.id, // FK: Automatically assigned from the logged-in user
        title: jobDetails.title,
        category: jobDetails.category,
        description: jobDetails.description,
        budget: parseFloat(jobDetails.budget), // Convert budget string to numeric type
        location: jobDetails.location,
        deadline_at: jobDetails.deadline_at.toISOString(), // Convert Date object to ISO string for Postgres timestamp
        time_window: jobDetails.time_window,
        special_requirements: jobDetails.special_requirements,
        media_urls: jobDetails.media_urls || [], // Ensure it's an array for the TEXT[] column
        status: "posted", // Default status upon creation
      })
      .select()
      .single(); // Return the newly created job record

    if (error) {
      // Throw the Supabase error for the catch block
      throw error;
    }

    // Success response
    return { success: true, data };
  } catch (error) {
    console.error("Supabase Job Posting Error:", error.message || error);
    return {
      success: false,
      error: {
        message: error.message || "An unknown database error occurred.",
      },
    };
  }
};
