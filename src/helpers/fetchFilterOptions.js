// src/helpers/fetchFilterOptions.js
import { supabase } from "../utils/supabase";

/**
 * Fetches unique, non-empty categories and locations from all posted jobs.
 */
export const fetchFilterOptions = async () => {
  // Note: RLS SELECT policies must allow this user to view jobs to pull categories/locations.

  // Fetch distinct categories and locations
  const { data: categories, error: catError } = await supabase
    .from("jobs")
    .select("category", { count: "exact", head: false })
    .not("category", "is", null);

  const { data: locations, error: locError } = await await supabase
    .from("jobs")
    .select("location", { count: "exact", head: false })
    .not("location", "is", null);

  if (catError || locError) {
    console.error("Error fetching filter options:", catError || locError);
    return { categories: [], locations: [] };
  }

  // Process and unique the results
  const uniqueCategories = [...new Set(categories.map((row) => row.category))];
  const uniqueLocations = [...new Set(locations.map((row) => row.location))];

  return {
    categories: uniqueCategories,
    locations: uniqueLocations,
  };
};
