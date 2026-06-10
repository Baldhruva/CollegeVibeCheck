/**
 * Responsibility: TypeScript interfaces for College entities.
 * Purpose: Defines database row schema and extended statistical views for colleges.
 * What code will eventually live here: DBCollege and CollegeWithStats interfaces.
 */

export interface DBCollege {
  id: string; // uuid, primary key, default gen_random_uuid()
  name: string; // varchar(200), unique, not null
  description: string | null; // text, nullable
  created_at: string; // timestamptz, default now()
}

export interface CollegeParameterStats {
  parameterId: string;
  parameterName: string;
  averageRating: number; // average of all sub-parameters across all users
}

export interface CollegeWithStats extends DBCollege {
  overallRating: number; // average of all user ratings
  ratingCount: number; // total number of user ratings
  parameterStats: CollegeParameterStats[]; // breakdown of the 8 parameters
}
