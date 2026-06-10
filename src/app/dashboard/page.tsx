import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Get authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect("/");
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/auth/complete-profile");
  }

  if (profile.role !== "student") {
    redirect("/");
  }

  // Get student's associated college details
  let college = null;
  if (profile.college_id) {
    const { data: collegeData, error: collegeError } = await supabase
      .from("colleges")
      .select("*")
      .eq("id", profile.college_id)
      .maybeSingle();
    
    if (!collegeError && collegeData) {
      college = collegeData;
    }
  }

  return <DashboardShell profile={profile} college={college} />;
}
