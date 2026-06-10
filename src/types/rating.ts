/**
 * Responsibility: TypeScript interfaces for Rating entities.
 * Purpose: Defines database schemas, user submission formats, and aggregated representation of college rating scores.
 * What code will eventually live here: DBRating, DBSubParameterRating, and associated payload types.
 */

export interface DBRating {
  id: string; // uuid, primary key, default gen_random_uuid()
  user_id: string; // uuid, not null, foreign key to users(id) on delete cascade
  college_id: string; // uuid, not null, foreign key to colleges(id) on delete cascade
  created_at: string; // timestamptz, default now()
  // unique(user_id, college_id)
}

export interface DBSubParameterRating {
  id: string; // uuid, primary key, default gen_random_uuid()
  rating_id: string; // uuid, not null, foreign key to ratings(id) on delete cascade
  sub_parameter_id: string; // uuid, not null, foreign key to sub_parameters(id) on delete cascade
  stars: number; // integer, not null, check between 1 and 5
  // unique(rating_id, sub_parameter_id)
}

export interface SubParameterRatingInput {
  subParameterId: string;
  stars: number; // 1 to 5
}

export interface RatingSubmissionInput {
  collegeId: string;
  subParameterRatings: SubParameterRatingInput[]; // Expecting exactly 32 sub-parameter scores
}

export interface UserRatingBreakdown {
  ratingId: string;
  userId: string;
  collegeId: string;
  overallRating: number; // average of all parameter ratings
  parameterAverages: {
    parameterId: string;
    parameterName: string;
    averageRating: number; // average of the 4 sub-parameter ratings
    subParameterRatings: {
      subParameterId: string;
      subParameterName: string;
      stars: number;
    }[];
  }[];
}
