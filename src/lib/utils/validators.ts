/**
 * Responsibility: Input validators and validation helper functions.
 * Purpose: Enforces validation rules for user onboarding, comments content, rating star inputs, and UUIDs.
 * What code will eventually live here: Validation functions matching constraints in the database schema.
 */

/**
 * Validates a username.
 * Rules:
 * - Must be between 3 and 30 characters.
 * - Must contain only letters, numbers, and underscores.
 * - Cannot start or end with an underscore.
 */
export function validateUsername(username: string): { isValid: boolean; error?: string } {
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 30) {
    return { isValid: false, error: "Username must be between 3 and 30 characters long." };
  }
  
  const validPattern = /^[a-zA-Z0-9_]+$/;
  if (!validPattern.test(trimmed)) {
    return { isValid: false, error: "Username can only contain alphanumeric characters and underscores." };
  }

  if (trimmed.startsWith("_") || trimmed.endsWith("_")) {
    return { isValid: false, error: "Username cannot start or end with an underscore." };
  }

  return { isValid: true };
}

/**
 * Validates comment content.
 * Rules:
 * - Must not be empty.
 * - Must be at most 250 characters.
 */
export function validateCommentContent(content: string): { isValid: boolean; error?: string } {
  const trimmed = content.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: "Comment cannot be empty." };
  }
  if (trimmed.length > 250) {
    return { isValid: false, error: "Comment cannot exceed 250 characters." };
  }
  return { isValid: true };
}

/**
 * Validates rating star values.
 * Rules:
 * - Must be an integer.
 * - Must be between 1 and 5 inclusive.
 */
export function validateStars(stars: number): { isValid: boolean; error?: string } {
  if (!Number.isInteger(stars)) {
    return { isValid: false, error: "Rating must be a whole number." };
  }
  if (stars < 1 || stars > 5) {
    return { isValid: false, error: "Rating must be between 1 and 5." };
  }
  return { isValid: true };
}

/**
 * Validates if a string is a valid UUID.
 */
export function validateUUID(id: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Validates full rating submission.
 * Rules:
 * - Must have exactly 32 sub-parameter ratings.
 * - Each rating must be valid.
 */
export function validateRatingSubmission(
  subParameterRatings: { subParameterId: string; stars: number }[]
): { isValid: boolean; error?: string } {
  if (subParameterRatings.length !== 32) {
    return { isValid: false, error: "Rating submission must contain exactly 32 sub-parameter ratings." };
  }

  for (const rating of subParameterRatings) {
    if (!validateUUID(rating.subParameterId)) {
      return { isValid: false, error: `Invalid sub-parameter ID: ${rating.subParameterId}` };
    }
    const starVal = validateStars(rating.stars);
    if (!starVal.isValid) {
      return { isValid: false, error: `Invalid rating value for sub-parameter ${rating.subParameterId}: ${starVal.error}` };
    }
  }

  return { isValid: true };
}
