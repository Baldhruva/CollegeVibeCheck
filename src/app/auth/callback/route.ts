import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const role = requestUrl.searchParams.get("role") as "student" | "viewer" | null;

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange code error:", error.message);
      return NextResponse.redirect(new URL("/?error=auth-failed", request.url));
    }

    if (user) {
      // Check if user profile already exists
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Fetch profile error:", profileError.message);
      }

      if (profile) {
        // Profile exists: Redirect based on profile role
        if (profile.role === "student") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        } else {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } else {
        // Profile does not exist: Handle onboarding path
        const targetRole = role || "viewer"; // Default fallback to viewer

        if (targetRole === "viewer") {
          // Viewer Flow: Auto-create profile and redirect to home
          const { error: insertError } = await supabase
            .from("users")
            .insert({
              id: user.id,
              username: null,
              role: "viewer",
              college_id: null
            });

          if (insertError) {
            console.error("Auto-create viewer profile error:", insertError.message);
            return NextResponse.redirect(new URL("/?error=profile-creation-failed", request.url));
          }

          return NextResponse.redirect(new URL("/", request.url));
        } else {
          // Student Flow: Redirect to complete-profile onboarding
          return NextResponse.redirect(new URL("/auth/complete-profile", request.url));
        }
      }
    }
  }

  // Fallback redirect to home if no authorization code is present
  return NextResponse.redirect(new URL("/", request.url));
}
