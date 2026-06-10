/**
 * Responsibility: Pure mathematical functions for rating calculations.
 * Purpose: Computes averages for parameters, user overall ratings, and college aggregates.
 * What code will eventually live here: Functions to aggregate and average numerical ratings.
 */

/**
 * Calculates the average of an array of numbers.
 * Safely returns 0 if the array is empty.
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, val) => acc + val, 0);
  return sum / numbers.length;
}

/**
 * Calculates a single parameter rating.
 * Parameter Rating = Average of all its sub-parameter ratings.
 * @param subParameterRatings Array of stars (1-5) for the sub-parameters.
 */
export function calculateParameterAverage(subParameterRatings: number[]): number {
  return calculateAverage(subParameterRatings);
}

/**
 * Calculates a user's overall rating for a college.
 * College Rating By User = Average of all 8 parameter ratings.
 * @param parameterRatings Array of the 8 parameter average ratings.
 */
export function calculateUserCollegeRating(parameterRatings: number[]): number {
  return calculateAverage(parameterRatings);
}

/**
 * Calculates the overall rating of a college.
 * College Overall Rating = Average of all user overall ratings.
 * @param userOverallRatings Array of overall ratings from multiple users.
 */
export function calculateCollegeOverallRating(userOverallRatings: number[]): number {
  return calculateAverage(userOverallRatings);
}

/**
 * Round a rating to a specific number of decimal places (default 2).
 */
export function roundRating(rating: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(rating * factor) / factor;
}
