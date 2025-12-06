// src/helpers/fetchProviderJobs.js (Final Reliable Helper - No Joins)
import { supabase } from "../utils/supabase";

/**
 * Fetches all job listings posted by the currently authenticated user (Provider)
 * using two separate queries (no RLS join complexity) for reliability.
 * * @returns {Array} List of job objects with the worker's name attached.
 */
export const fetchProviderJobs = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be logged in to view their jobs.");
  }

  // --- Query 1: Fetch all jobs posted by the provider ---
  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select(`*`)
    .eq("provider_id", user.id)
    .order("created_at", { ascending: false });

  if (jobsError) {
    console.error("Error fetching provider jobs:", jobsError);
    throw jobsError;
  }

  if (jobs.length === 0) {
    return []; // No jobs found
  }

  // --- Query 2: Fetch worker usernames for mapping ---

  // Get unique worker IDs from the fetched jobs that are not null
  const workerIds = [
    ...new Set(jobs.map((job) => job.worker_id).filter((id) => id)),
  ];

  let workerMap = {};
  if (workerIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", workerIds); // Fetch all necessary profiles in one go

    if (profilesError) {
      console.error("Error fetching worker profiles:", profilesError);
      // We can continue here, but worker names will be missing.
    } else {
      // Create a quick lookup map: { 'worker_uuid': 'username' }
      workerMap = profiles.reduce((map, profile) => {
        map[profile.id] = profile.username;
        return map;
      }, {});
    }
  }

  // --- Step 3: Merge the data in JavaScript ---
  return jobs.map((job) => ({
    ...job,
    // Lookup the worker's username using the worker_id from the job record
    worker: job.worker_id ? workerMap[job.worker_id] || null : null,
    // The worker_id column itself is no longer needed in the final object
  }));
};
