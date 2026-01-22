// src/helpers/fetchWorkerJobs.js (Enhanced with Search, Filters, Sorting)
import { supabase } from "../utils/supabase";

/**
 * Fetches all jobs accepted by the currently authenticated user (Worker).
 * Now supports:
 *  - Search (title/category)
 *  - Filters (location, category)
 *  - Sorting (created_at_desc, budget_asc, etc.)
 */
export const fetchWorkerJobs = async (filters = {}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be logged in.");
  }

  // -----------------------
  // BASE QUERY
  // -----------------------
  let query = supabase.from("jobs").select("*").eq("worker_id", user.id);

  // -----------------------
  // SEARCH
  // -----------------------
  if (filters.search) {
    const search = `%${filters.search}%`;
    query = query.or(`title.ilike.${search},category.ilike.${search}`);
  }

  // -----------------------
  // LOCATION FILTER
  // -----------------------
  if (filters.location && filters.location !== "null") {
    query = query.eq("location", filters.location);
  }

  // -----------------------
  // CATEGORY FILTER
  // -----------------------
  if (filters.category && filters.category !== "null") {
    query = query.eq("category", filters.category);
  }

  // -----------------------
  // SORTING
  // -----------------------
  const sortString = filters.sort || "created_at_desc";

  const lastUnderscore = sortString.lastIndexOf("_");
  const column = sortString.substring(0, lastUnderscore); // e.g., "created_at"
  const orderType = sortString.substring(lastUnderscore + 1); // e.g., "desc"

  query = query.order(column, { ascending: orderType === "asc" });

  // -----------------------
  // EXECUTE MAIN QUERY
  // -----------------------
  const { data: jobs, error: jobsError } = await query;

  if (jobsError) {
    console.error("Error fetching worker jobs:", jobsError);
    throw jobsError;
  }

  if (!jobs || jobs.length === 0) {
    return [];
  }

  // -----------------------
  // FETCH PROVIDER PROFILES
  // -----------------------
  const providerIds = [
    ...new Set(jobs.map((job) => job.provider_id).filter((id) => id)),
  ];

  let clientMap = {};

  if (providerIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", providerIds);

    if (!profilesError && profiles) {
      clientMap = profiles.reduce((map, profile) => {
        map[profile.id] = profile.username;
        return map;
      }, {});
    } else {
      console.error("Error fetching client profiles:", profilesError);
    }
  }

  // -----------------------
  // MERGE
  // -----------------------
  return jobs.map((job) => ({
    ...job,
    client: job.provider_id ? clientMap[job.provider_id] || null : null,
  }));
};
