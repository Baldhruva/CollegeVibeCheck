/**
 * Responsibility: Database query helpers for the 'colleges' table.
 * Purpose: Provides data access functions to fetch and search Mumbai colleges.
 * What code will eventually live here: Reading pre-seeded colleges with simple fetches or full search autocomplete queries.
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { DBCollege } from "@/types/college";

/**
 * Fetches all colleges in the system.
 */
export async function getAllColleges(
  supabase: SupabaseClient
): Promise<DBCollege[]> {
  const { data, error } = await supabase
    .from("colleges")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch colleges: ${error.message}`);
  }

  return data as DBCollege[];
}

/**
 * Fetches a single college by its ID.
 */
export async function getCollegeById(
  supabase: SupabaseClient,
  id: string
): Promise<DBCollege | null> {
  const { data, error } = await supabase
    .from("colleges")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Failed to fetch college by ID: ${error.message}`);
  }

  return data as DBCollege;
}

/**
 * Searches colleges by name (case-insensitive autocomplete).
 * @param query The search string.
 */
export async function searchCollegesByName(
  supabase: SupabaseClient,
  query: string
): Promise<DBCollege[]> {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from("colleges")
    .select("*")
    .ilike("name", `%${query.trim()}%`)
    .order("name", { ascending: true })
    .limit(10); // Limit autocomplete results to top 10 matches

  if (error) {
    throw new Error(`Failed to search colleges: ${error.message}`);
  }

  return data as DBCollege[];
}
