/**
 * Responsibility: Database query helpers for the 'users' table.
 * Purpose: Provides data access functions for user profile CRUD and verification.
 * What code will eventually live here: Fetching, creating, updating, and validating user profiles.
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { DBUser } from "@/types/user";

/**
 * Fetches a user profile from the database by user ID.
 */
export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<DBUser | null> {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Postgrest error code for '0 rows returned'
      return null;
    }
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }

  return data as DBUser;
}

/**
 * Creates a new user profile in the database.
 */
export async function createUserProfile(
  supabase: SupabaseClient,
  profile: Omit<DBUser, "created_at">
): Promise<DBUser> {
  const { data, error } = await supabase
    .from("users")
    .insert([profile])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create user profile: ${error.message}`);
  }

  return data as DBUser;
}

/**
 * Updates an existing user profile.
 */
export async function updateUserProfile(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Omit<DBUser, "id" | "created_at">>
): Promise<DBUser> {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }

  return data as DBUser;
}

/**
 * Checks whether a username is available.
 * Returns true if available (no matching user), false otherwise.
 */
export async function isUsernameAvailable(
  supabase: SupabaseClient,
  username: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("users")
    .select("username")
    .eq("username", username.trim())
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to check username availability: ${error.message}`);
  }

  return data === null;
}
