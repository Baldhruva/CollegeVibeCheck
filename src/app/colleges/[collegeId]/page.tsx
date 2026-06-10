import React from "react";
import { createClient } from "@/lib/supabase/server";
import { getCollegeWithStats } from "@/lib/db/ratings";
import CollegeStats from "@/components/colleges/CollegeStats";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type CollegeDetailPageProps = {
  params: Promise<{
    collegeId: string;
  }>;
};

export default async function CollegeDetailPage({ params }: CollegeDetailPageProps) {
  const { collegeId } = await params;
  
  const supabase = await createClient();
  let college = null;
  
  try {
    college = await getCollegeWithStats(supabase, collegeId);
  } catch (err) {
    console.error("Error fetching college stats:", err);
  }

  if (!college) {
    notFound();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      
      <main style={{ flex: 1, padding: "3rem 1.5rem" }} className="container">
        <CollegeStats college={college} />
      </main>
      
      <Footer />
    </div>
  );
}
