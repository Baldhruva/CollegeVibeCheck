"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCollegesWithStats } from "@/lib/db/ratings";
import { CollegeWithStats } from "@/types/college";

export function useCollegeSearch() {
  const [colleges, setColleges] = useState<CollegeWithStats[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Fetch all colleges with stats on mount
  useEffect(() => {
    async function fetchColleges() {
      try {
        setLoading(true);
        setError(null);
        const data = await getCollegesWithStats(supabase);
        setColleges(data);
      } catch (err: any) {
        console.error("Error loading colleges:", err);
        setError(err.message || "Failed to load colleges list.");
      } finally {
        setLoading(false);
      }
    }

    fetchColleges();
  }, [supabase]);

  // Derive filtered results and autocomplete suggestions in-memory for instant feedback
  const { results, suggestions } = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      return {
        results: colleges,
        suggestions: [],
      };
    }

    // Filter colleges by name matching query
    const filtered = colleges.filter((c) =>
      c.name.toLowerCase().includes(trimmedQuery)
    );

    // Auto-complete suggestions (top 5 matched names)
    const matchedNames = filtered.map((c) => c.name).slice(0, 5);

    return {
      results: filtered,
      suggestions: matchedNames,
    };
  }, [colleges, query]);

  return {
    query,
    setQuery,
    results,
    suggestions,
    loading,
    error,
  };
}
