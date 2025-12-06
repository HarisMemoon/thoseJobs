import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://eyadmmvxgujuxgdipdbw.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5YWRtbXZ4Z3VqdXhnZGlwZGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NDk4MzgsImV4cCI6MjA4MDMyNTgzOH0.pH36hCfFGVmMTUSq9GxLZYG9O6vpeCg_ATXvRDvbhJg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
