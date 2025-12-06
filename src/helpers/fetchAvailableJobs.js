// src/helpers/fetchAvailableJobs.js
import { supabase } from "../utils/supabase";

/**
 * Fetches all jobs available for the worker (status='posted' and worker_id is null).
 * Also fetches the Client/Provider's username for display.
 * @returns {Array} List of available job objects.
 */
export const fetchAvailableJobs = async () => {
  // Note: No user check required here if RLS allows public SELECT on posted jobs.

  // --- Query 1: Fetch all unclaimed jobs (status = 'posted' AND worker_id is NULL) ---
  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select(`*`)
    .eq("status", "posted")
    .is("worker_id", null) // Crucial filter: Job must be unclaimed
    .order("created_at", { ascending: false });

  if (jobsError) {
    console.error("Error fetching available jobs:", jobsError);
    throw jobsError;
  }

  if (jobs.length === 0) {
    return [];
  }

  // --- Query 2: Fetch client (provider) usernames for mapping ---
  // Collect all unique provider IDs from the fetched jobs
  const providerIds = [
    ...new Set(jobs.map((job) => job.provider_id).filter((id) => id)),
  ];

  let clientMap = {};
  if (providerIds.length > 0) {
    // Fetch all necessary client profiles in one query
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
  }

  // --- Step 3: Merge the data in JavaScript ---
  return jobs.map((job) => ({
    ...job,
    // Lookup the client's username using the job's provider_id
    client: job.provider_id ? clientMap[job.provider_id] || null : null,
    // Since this is the worker view, ensure 'worker' is explicitly null/undefined
    worker: null,
  }));
};
