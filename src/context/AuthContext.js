import React, { useState, useEffect, createContext, useContext } from "react";
import { supabase } from "../utils/supabase"; // Import your configured Supabase client

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null); // NEW: To store username, etc.
  const [role, setRole] = useState(null); // 'admin', 'provider', 'worker', or null

  // 1. Fetch Session on Mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Fetch profile and role if a session exists
        fetchUserProfile(session.user.id);
      }
    });

    // 2. Listen for Auth State Changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (session) {
          fetchUserProfile(session.user.id);
        } else {
          setRole(null); // Clear role on sign out
          setProfile(null); // Clear profile on sign out
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 3. Helper to Fetch User Role and Profile from 'profiles' table
  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      // Fetch all necessary profile columns
      .select("id, username, role, wallet_balance")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error.message);
      setRole(null);
      setProfile(null);
    } else if (data) {
      setRole(data.role); // Sets role to 'admin', 'provider', or 'worker'
      setProfile(data); // Set the entire profile object
    }
  };

  const value = {
    session,
    role,
    profile, // EXPOSED: The full profile object
    loading: session === undefined, // Simple loading check
    signIn: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
