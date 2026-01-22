// src/helpers/fetchProviderJobs.js
import { supabase } from "../utils/supabase";

export const fetchProviderJobs = async (filters = {}) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User must be logged in to view your posted jobs.");
  }

  // ------- Base query -------
  let query = supabase.from("jobs").select("*").eq("provider_id", user.id);

  // ------- SEARCH -------
  if (filters.search) {
    const search = `%${filters.search}%`;
    query = query.or(`title.ilike.${search},category.ilike.${search}`);
  }

  // ------- LOCATION FILTER -------
  if (filters.location && filters.location !== "null") {
    query = query.eq("location", filters.location);
  }

  // ------- CATEGORY FILTER -------
  if (filters.category && filters.category !== "null") {
    query = query.eq("category", filters.category);
  }

  // ------- SORTING FIX -------
  const sortString = filters.sort || "created_at_desc";

  const lastUnderscore = sortString.lastIndexOf("_");
  const column = sortString.substring(0, lastUnderscore); // e.g. "created_at"
  const orderType = sortString.substring(lastUnderscore + 1); // e.g. "desc"

  query = query.order(column, { ascending: orderType === "asc" });

  // ------- Execute query -------
  const { data: jobs, error: jobsError } = await query;

  if (jobsError) {
    console.error("Fetch Provider Jobs Error:", jobsError);
    throw jobsError;
  }

  if (!jobs || jobs.length === 0) {
    return [];
  }

  // ------- Fetch Worker Profiles -------
  const workerIds = [
    ...new Set(jobs.map((j) => j.worker_id).filter((id) => id)),
  ];

  let workerMap = {};

  if (workerIds.length > 0) {
    const { data: profiles, error: profileErr } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", workerIds);

    if (!profileErr && profiles) {
      workerMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = profile.username;
        return acc;
      }, {});
    }
  }

  // ------- Merge -------
  return jobs.map((job) => ({
    ...job,
    worker: job.worker_id ? workerMap[job.worker_id] || null : null,
  }));
};
