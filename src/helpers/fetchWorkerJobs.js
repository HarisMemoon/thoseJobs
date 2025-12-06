// src/helpers/fetchWorkerJobs.js (Final Reliable, Two-Query Version)
import { supabase } from "../utils/supabase";

/**
 * Fetches all jobs accepted by the currently authenticated user (Worker).
 * Uses two separate, simple queries for maximum reliability, avoiding complex RLS joins.
 * @returns {Array} List of job objects with the client/provider's name attached.
 */
export const fetchWorkerJobs = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be logged in.");
  } // --- Query 1: Fetch all jobs assigned to the current worker --- // Simple select with no joins.

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select(`*`)
    .eq("worker_id", user.id) // Filter by jobs accepted by this user
    .order("created_at", { ascending: false });

  if (jobsError) {
    console.error("Error fetching worker jobs:", jobsError);
    throw jobsError;
  }

  if (jobs.length === 0) {
    return [];
  } // --- Query 2: Fetch client (provider) usernames for mapping --- // Get unique provider IDs (clients) who posted these jobs

  const providerIds = [
    ...new Set(jobs.map((job) => job.provider_id).filter((id) => id)),
  ];

  let clientMap = {};
  if (providerIds.length > 0) {
    // Simple select from profiles table using the IN filter
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", providerIds);

    if (profilesError) {
      console.error("Error fetching client profiles:", profilesError);
    } else {
      // Create a quick lookup map: { 'provider_uuid': 'username' }
      clientMap = profiles.reduce((map, profile) => {
        map[profile.id] = profile.username;
        return map;
      }, {});
    }
  } // --- Step 3: Merge the data in JavaScript ---

  return jobs.map((job) => ({
    ...job, // Lookup the client's username using the job's provider_id
    client: job.provider_id ? clientMap[job.provider_id] || null : null,
  }));
};
