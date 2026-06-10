import { SupabaseClient } from "@supabase/supabase-js";
import { DBUser } from "@/types/user";

/**
 * Gets the current active session from Supabase.
 */
export async function getServerSession(supabase: SupabaseClient) {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

/**
 * Gets the current authenticated user details from Supabase Auth.
 */
export async function getCurrentUser(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

/**
 * Gets the user's database profile details from the 'users' table.
 */
export async function getCurrentProfile(
  supabase: SupabaseClient
): Promise<DBUser | null> {
  const user = await getCurrentUser(supabase);
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) return null;
  return profile as DBUser | null;
}

/**
 * Checks if the user is currently authenticated.
 */
export async function isAuthenticated(supabase: SupabaseClient): Promise<boolean> {
  const user = await getCurrentUser(supabase);
  return !!user;
}
