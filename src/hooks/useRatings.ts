"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { getParametersWithSubParameters, getUserRatingForCollege, upsertUserRating } from "@/lib/db/ratings";
import { getUserCommentsForCollege, upsertParameterComment } from "@/lib/db/comments";
import { ParameterWithSubParameters } from "@/types/parameter";
import { SubParameterRatingInput } from "@/types/rating";
import { calculateParameterAverage, calculateUserCollegeRating } from "@/lib/utils/ratingMath";

export function useRatings(collegeId: string | undefined) {
  const { user } = useAuth();
  const [dbParameters, setDbParameters] = useState<ParameterWithSubParameters[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Load parameter definitions, user's saved ratings, and comments on mount/reset
  useEffect(() => {
    if (!collegeId || !user) {
      setLoading(false);
      return;
    }

    const userId = user.id;
    const cid = collegeId;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch parameter definitions
        const params = await getParametersWithSubParameters(supabase);
        setDbParameters(params);

        // Initialize empty ratings & comments
        const initialRatings: Record<string, number> = {};
        const initialComments: Record<string, string> = {};
        params.forEach((p) => {
          initialComments[p.id] = "";
          p.subParameters.forEach((sp) => {
            initialRatings[sp.id] = 0;
          });
        });

        // 2. Fetch user's existing ratings if they exist
        const existingRatingData = await getUserRatingForCollege(supabase, userId, cid);
        
        if (existingRatingData && existingRatingData.sub_parameter_ratings) {
          existingRatingData.sub_parameter_ratings.forEach((sr) => {
            initialRatings[sr.sub_parameter_id] = sr.stars;
          });
        }

        // 3. Fetch user's existing parameter comments if they exist
        const existingComments = await getUserCommentsForCollege(supabase, userId, cid);
        existingComments.forEach((c) => {
          // If comment is the deleted placeholder, display as empty on the dashboard form
          if (c.content === "[Comment deleted by user]") {
            initialComments[c.parameter_id] = "";
          } else {
            initialComments[c.parameter_id] = c.content;
          }
        });

        setRatings(initialRatings);
        setComments(initialComments);
      } catch (err: any) {
        console.error("Error loading ratings & comments data:", err);
        setError(err.message || "Failed to load ratings and comments.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [collegeId, user, supabase]);

  // Handle rating updates locally
  const handleRatingChange = (subParameterId: string, value: number) => {
    setRatings((prev) => ({
      ...prev,
      [subParameterId]: value,
    }));
  };

  // Handle comment updates locally
  const handleCommentChange = (parameterId: string, value: string) => {
    setComments((prev) => ({
      ...prev,
      [parameterId]: value,
    }));
  };

  // Compute live averages dynamically
  const { averages, overallRating } = useMemo(() => {
    const computedAverages: Record<string, number | "Unrated"> = {};
    const validParameterAverages: number[] = [];

    dbParameters.forEach((param) => {
      const subScores = param.subParameters
        .map((sp) => ratings[sp.id] || 0)
        .filter((stars) => stars > 0);

      if (subScores.length > 0) {
        const avg = calculateParameterAverage(subScores);
        computedAverages[param.id] = avg;
        validParameterAverages.push(avg);
      } else {
        computedAverages[param.id] = "Unrated";
      }
    });

    const computedOverall = validParameterAverages.length > 0
      ? calculateUserCollegeRating(validParameterAverages)
      : "Unrated";

    return {
      averages: computedAverages,
      overallRating: computedOverall,
    };
  }, [dbParameters, ratings]);

  // Save/Upsert ratings and comments in Supabase
  const saveRatings = async (): Promise<boolean> => {
    if (!user || !collegeId) {
      setError("User session or college context missing.");
      return false;
    }

    try {
      setSaving(true);
      setError(null);

      // Build payload for all rated sub-parameters
      const subParameterRatingsInput: SubParameterRatingInput[] = Object.entries(ratings)
        .filter(([_, stars]) => stars > 0)
        .map(([subParameterId, stars]) => ({
          subParameterId,
          stars,
        }));

      // 1. Upsert Ratings
      await upsertUserRating(supabase, user.id, collegeId, subParameterRatingsInput);

      // 2. Upsert/Delete Comments
      const promises = dbParameters.map((param) => {
        const content = comments[param.id] || "";
        return upsertParameterComment(supabase, user.id, collegeId, param.id, content);
      });

      await Promise.all(promises);

      return true;
    } catch (err: any) {
      console.error("Error saving ratings and comments:", err);
      setError(err.message || "Failed to save ratings and comments.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    dbParameters,
    ratings,
    comments,
    averages,
    overallRating,
    loading,
    saving,
    error,
    handleRatingChange,
    handleCommentChange,
    saveRatings,
  };
}

