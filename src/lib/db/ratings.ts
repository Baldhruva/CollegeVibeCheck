/**
 * Responsibility: Database query helpers for ratings and sub-parameter ratings.
 * Purpose: Handles retrieval, upserting, and aggregation calculations for college ratings.
 * What code will eventually live here: Reading/writing rating sheets and computing statistical averages.
 */

import { SupabaseClient } from "@supabase/supabase-js";
import { DBRating, DBSubParameterRating, SubParameterRatingInput } from "@/types/rating";
import { CollegeWithStats, CollegeParameterStats } from "@/types/college";
import { getCollegeById, getAllColleges } from "./colleges";
import { ParameterWithSubParameters } from "@/types/parameter";
import { calculateParameterAverage, calculateUserCollegeRating, calculateCollegeOverallRating, roundRating } from "../utils/ratingMath";

/**
 * Fetches a user's rating for a specific college, including the sub-parameter rating breakdown.
 */
export async function getUserRatingForCollege(
  supabase: SupabaseClient,
  userId: string,
  collegeId: string
): Promise<(DBRating & { sub_parameter_ratings: DBSubParameterRating[] }) | null> {
  const { data, error } = await supabase
    .from("ratings")
    .select(`
      id,
      user_id,
      college_id,
      created_at,
      sub_parameter_ratings (
        id,
        rating_id,
        sub_parameter_id,
        stars
      )
    `)
    .eq("user_id", userId)
    .eq("college_id", collegeId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch user rating: ${error.message}`);
  }

  return data;
}

/**
 * Creates or updates a student's ratings for a college (upserts the rating and sub-parameter breakdown).
 */
export async function upsertUserRating(
  supabase: SupabaseClient,
  userId: string,
  collegeId: string,
  subParameterRatings: SubParameterRatingInput[]
): Promise<{ ratingId: string }> {
  // 1. Upsert rating record for (user_id, college_id)
  const { data: ratingData, error: ratingError } = await supabase
    .from("ratings")
    .upsert(
      { user_id: userId, college_id: collegeId },
      { onConflict: "user_id,college_id" }
    )
    .select("id")
    .single();

  if (ratingError) {
    throw new Error(`Failed to upsert rating metadata: ${ratingError.message}`);
  }

  const ratingId = ratingData.id;

  // 2. Prepare sub-parameter ratings upsert
  const subRatingsUpsert = subParameterRatings.map((item) => ({
    rating_id: ratingId,
    sub_parameter_id: item.subParameterId,
    stars: item.stars
  }));

  const { error: subRatingsError } = await supabase
    .from("sub_parameter_ratings")
    .upsert(subRatingsUpsert, { onConflict: "rating_id,sub_parameter_id" });

  if (subRatingsError) {
    throw new Error(`Failed to upsert sub-parameter ratings: ${subRatingsError.message}`);
  }

  return { ratingId };
}

/**
 * Fetches a college with overall rating stats.
 * Aggregates all user ratings and sub-parameter ratings into parameter averages and an overall rating.
 */
export async function getCollegeWithStats(
  supabase: SupabaseClient,
  collegeId: string
): Promise<CollegeWithStats | null> {
  // 1. Fetch college details
  const college = await getCollegeById(supabase, collegeId);
  if (!college) return null;

  // 2. Fetch parameters and sub-parameters structure
  const { data: parametersData, error: paramsError } = await supabase
    .from("parameters")
    .select(`
      id,
      name,
      sub_parameters (
        id,
        name
      )
    `);

  if (paramsError) {
    throw new Error(`Failed to fetch parameters metadata: ${paramsError.message}`);
  }

  // 3. Fetch all ratings submitted for this college
  const { data: ratingsData, error: ratingsError } = await supabase
    .from("ratings")
    .select(`
      id,
      sub_parameter_ratings (
        sub_parameter_id,
        stars
      )
    `)
    .eq("college_id", collegeId);

  if (ratingsError) {
    throw new Error(`Failed to fetch college ratings: ${ratingsError.message}`);
  }

  // If no ratings yet, return college with 0 stats
  if (!ratingsData || ratingsData.length === 0) {
    const defaultParamsStats: CollegeParameterStats[] = parametersData.map((p: any) => ({
      parameterId: p.id,
      parameterName: p.name,
      averageRating: 0
    }));

    return {
      ...college,
      overallRating: 0,
      ratingCount: 0,
      parameterStats: defaultParamsStats
    };
  }

  // 4. Map sub-parameter ID to parameter ID and name
  const subParamToParamMap: Record<string, { paramId: string; paramName: string }> = {};
  parametersData.forEach((param: any) => {
    param.sub_parameters.forEach((sub: any) => {
      subParamToParamMap[sub.id] = {
        paramId: param.id,
        paramName: param.name
      };
    });
  });

  // 5. Aggregate averages
  // We want to calculate the Overall Rating, which is the average of each USER's overall rating.
  // User Rating = average of all 8 parameter ratings.
  // Parameter Rating = average of its 4 sub-parameters.
  const userOverallRatings: number[] = [];
  const parameterTotals: Record<string, { sum: number; count: number; name: string }> = {};

  // Initialize parameter aggregation trackers
  parametersData.forEach((p: any) => {
    parameterTotals[p.id] = { sum: 0, count: 0, name: p.name };
  });

  ratingsData.forEach((userRating: any) => {
    const subRatings = userRating.sub_parameter_ratings || [];
    
    // Group sub-ratings by parameter for this specific user
    const userParamScores: Record<string, number[]> = {};
    subRatings.forEach((sr: any) => {
      const mapping = subParamToParamMap[sr.sub_parameter_id];
      if (mapping) {
        if (!userParamScores[mapping.paramId]) {
          userParamScores[mapping.paramId] = [];
        }
        userParamScores[mapping.paramId].push(sr.stars);
      }
    });

    // Compute parameter averages for this user
    const userParamAverages: number[] = [];
    Object.keys(userParamScores).forEach((paramId) => {
      const avg = calculateParameterAverage(userParamScores[paramId]);
      userParamAverages.push(avg);

      // Accumulate for college-wide parameter averages
      parameterTotals[paramId].sum += avg;
      parameterTotals[paramId].count += 1;
    });

    // Compute user overall rating
    if (userParamAverages.length > 0) {
      userOverallRatings.push(calculateUserCollegeRating(userParamAverages));
    }
  });

  const overallRating = roundRating(calculateCollegeOverallRating(userOverallRatings), 2);
  const ratingCount = userOverallRatings.length;

  const parameterStats: CollegeParameterStats[] = Object.keys(parameterTotals).map((paramId) => {
    const item = parameterTotals[paramId];
    const avg = item.count > 0 ? roundRating(item.sum / item.count, 2) : 0;
    return {
      parameterId: paramId,
      parameterName: item.name,
      averageRating: avg
    };
  });

  return {
    ...college,
    overallRating,
    ratingCount,
    parameterStats
  };
}

/**
 * Fetches all parameters with their nested sub-parameters.
 */
export async function getParametersWithSubParameters(
  supabase: SupabaseClient
): Promise<ParameterWithSubParameters[]> {
  const { data, error } = await supabase
    .from("parameters")
    .select(`
      id,
      name,
      description,
      sub_parameters (
        id,
        parameter_id,
        name
      )
    `)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch parameters with sub-parameters: ${error.message}`);
  }

  return (data || []).map((param: any) => ({
    id: param.id,
    name: param.name,
    description: param.description,
    subParameters: (param.sub_parameters || []).map((sub: any) => ({
      id: sub.id,
      parameter_id: sub.parameter_id,
      name: sub.name
    }))
  })) as ParameterWithSubParameters[];
}

/**
 * Fetches all colleges with their overall rating stats using batch queries (averts N+1 queries).
 */
export async function getCollegesWithStats(
  supabase: SupabaseClient
): Promise<CollegeWithStats[]> {
  const colleges = await getAllColleges(supabase);
  if (colleges.length === 0) return [];

  const { data: parametersData, error: paramsError } = await supabase
    .from("parameters")
    .select(`
      id,
      name,
      sub_parameters (
        id,
        name
      )
    `);

  if (paramsError) {
    throw new Error(`Failed to fetch parameters metadata: ${paramsError.message}`);
  }

  const { data: ratingsData, error: ratingsError } = await supabase
    .from("ratings")
    .select(`
      id,
      college_id,
      sub_parameter_ratings (
        sub_parameter_id,
        stars
      )
    `);

  if (ratingsError) {
    throw new Error(`Failed to fetch ratings: ${ratingsError.message}`);
  }

  // Map sub-parameter ID to parameter ID and name
  const subParamToParamMap: Record<string, { paramId: string; paramName: string }> = {};
  parametersData.forEach((param: any) => {
    (param.sub_parameters || []).forEach((sub: any) => {
      subParamToParamMap[sub.id] = {
        paramId: param.id,
        paramName: param.name
      };
    });
  });

  // Group ratings by college_id
  const ratingsByCollege: Record<string, any[]> = {};
  colleges.forEach((c) => {
    ratingsByCollege[c.id] = [];
  });
  ratingsData?.forEach((r) => {
    if (ratingsByCollege[r.college_id]) {
      ratingsByCollege[r.college_id].push(r);
    }
  });

  // Process stats for each college
  const collegesWithStats: CollegeWithStats[] = colleges.map((college) => {
    const collegeRatings = ratingsByCollege[college.id] || [];

    if (collegeRatings.length === 0) {
      const defaultParamsStats: CollegeParameterStats[] = parametersData.map((p: any) => ({
        parameterId: p.id,
        parameterName: p.name,
        averageRating: 0
      }));

      return {
        ...college,
        overallRating: 0,
        ratingCount: 0,
        parameterStats: defaultParamsStats
      };
    }

    const userOverallRatings: number[] = [];
    const parameterTotals: Record<string, { sum: number; count: number; name: string }> = {};

    parametersData.forEach((p: any) => {
      parameterTotals[p.id] = { sum: 0, count: 0, name: p.name };
    });

    collegeRatings.forEach((userRating: any) => {
      const subRatings = userRating.sub_parameter_ratings || [];
      const userParamScores: Record<string, number[]> = {};

      subRatings.forEach((sr: any) => {
        const mapping = subParamToParamMap[sr.sub_parameter_id];
        if (mapping) {
          if (!userParamScores[mapping.paramId]) {
            userParamScores[mapping.paramId] = [];
          }
          userParamScores[mapping.paramId].push(sr.stars);
        }
      });

      const userParamAverages: number[] = [];
      Object.keys(userParamScores).forEach((paramId) => {
        const avg = calculateParameterAverage(userParamScores[paramId]);
        userParamAverages.push(avg);

        parameterTotals[paramId].sum += avg;
        parameterTotals[paramId].count += 1;
      });

      if (userParamAverages.length > 0) {
        userOverallRatings.push(calculateUserCollegeRating(userParamAverages));
      }
    });

    const overallRating = roundRating(calculateCollegeOverallRating(userOverallRatings), 2);
    const ratingCount = userOverallRatings.length;

    const parameterStats: CollegeParameterStats[] = Object.keys(parameterTotals).map((paramId) => {
      const item = parameterTotals[paramId];
      const avg = item.count > 0 ? roundRating(item.sum / item.count, 2) : 0;
      return {
        parameterId: paramId,
        parameterName: item.name,
        averageRating: avg
      };
    });

    return {
      ...college,
      overallRating,
      ratingCount,
      parameterStats
    };
  });

  return collegesWithStats;
}

