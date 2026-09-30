/**
 * Age boundary configuration and audience utilities for CyberMentor AI.
 * 
 * Boundary specification:
 * - Ages 12 and below -> "kids" experience
 * - Ages 13 and above -> "adult" experience
 * 
 * Changing DEFAULT_AGE_BOUNDARY here automatically updates the threshold throughout the app.
 */

export const DEFAULT_AGE_BOUNDARY = 13;
export const MIN_REALISTIC_AGE = 4;
export const MAX_REALISTIC_AGE = 120;

export type AudienceType = 'kids' | 'adult';

/**
 * Determines whether a learner receives the kids or adult experience based on their age.
 * Uses DEFAULT_AGE_BOUNDARY (13) by default.
 */
export function getAudienceType(age: number, boundary = DEFAULT_AGE_BOUNDARY): AudienceType {
  return age >= boundary ? 'adult' : 'kids';
}

/**
 * Validates user-submitted age input.
 * Rejects empty, non-number, negative, decimal, or unrealistic values.
 */
export function validateAge(val: unknown): { valid: boolean; error?: string; age?: number } {
  if (val === undefined || val === null || val === '') {
    return { valid: false, error: 'Please enter your age.' };
  }

  const str = String(val).trim();
  if (!str) {
    return { valid: false, error: 'Please enter your age.' };
  }

  // Reject decimal values (e.g. 12.5)
  if (str.includes('.') || str.includes(',')) {
    return { valid: false, error: 'Please enter a whole number without decimals.' };
  }

  const num = Number(str);
  if (isNaN(num)) {
    return { valid: false, error: 'Please enter a valid numeric age.' };
  }

  if (!Number.isInteger(num)) {
    return { valid: false, error: 'Please enter a whole number.' };
  }

  if (num <= 0) {
    return { valid: false, error: 'Age must be a positive number.' };
  }

  if (num < MIN_REALISTIC_AGE) {
    return { valid: false, error: `Age must be at least ${MIN_REALISTIC_AGE} years.` };
  }

  if (num > MAX_REALISTIC_AGE) {
    return { valid: false, error: `Please enter a realistic age (maximum ${MAX_REALISTIC_AGE}).` };
  }

  return { valid: true, age: num };
}

export function getAudienceLabel(audienceType: AudienceType): string {
  return audienceType === 'kids' ? 'Kids Experience' : 'Adult Experience';
}

export function getAudienceDescription(audienceType: AudienceType): string {
  return audienceType === 'kids'
    ? 'Friendly, encouraging scenarios focused on gaming, school, password privacy, and asking a trusted adult.'
    : 'In-depth, realistic topics covering workplace security, phishing, identity theft, financial scams, and incident response.';
}
