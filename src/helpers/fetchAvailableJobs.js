import { supabase } from "../utils/supabase";

export const fetchAvailableJobs = async (filters = {}) => {
  // 1. GET THE CURRENT USER ID
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User must be logged in.");

  // 2. BASE QUERY
  let query = supabase
    .from("jobs")
    .select(`*`)
    .eq("status", "posted")
    .is("worker_id", null)
    // CRITICAL: Filter out jobs where current user is in the quoted_worker_ids array
    // We use .not() with the 'cs' (contains) operator
    .not("quoted_worker_ids", "cs", `{${user.id}}`)
    // ALSO: Filter out jobs the user posted themselves
    .neq("provider_id", user.id);

  // -----------------------
  // 1. Apply Search Filter
  // -----------------------
  if (filters.search) {
    const search = `%${filters.search}%`;
    query = query.or(`title.ilike.${search},category.ilike.${search}`);
  }

  // -----------------------
  // 2. Apply Location Filter
  // -----------------------
  if (filters.location && filters.location !== "null") {
    query = query.eq("location", filters.location);
  }

  // -----------------------
  // 3. Apply Category Filter
  // -----------------------
  if (filters.category && filters.category !== "null") {
    query = query.eq("category", filters.category);
  }

  // -----------------------
  // 4. Apply Sort Order
  // -----------------------
  const sortString = filters.sort || "created_at_desc";
  const lastUnderscore = sortString.lastIndexOf("_");
  const column = sortString.substring(0, lastUnderscore);
  const orderType = sortString.substring(lastUnderscore + 1);

  query = query.order(column, { ascending: orderType === "asc" });

  const { data: jobs, error: jobsError } = await query;

  if (jobsError) {
    console.error("Error fetching available jobs:", jobsError);
    throw jobsError;
  }

  if (!jobs || jobs.length === 0) return [];

  // --- Query 2: Fetch client profiles (Same as before) ---
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
    }
  }

  return jobs.map((job) => ({
    ...job,
    client: job.provider_id ? clientMap[job.provider_id] || null : null,
    worker: null,
  }));
};
