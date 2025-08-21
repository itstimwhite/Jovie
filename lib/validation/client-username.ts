/**
 * Client-side username validation for instant feedback
 * This provides immediate validation without API calls
 */

import { validateUsername, normalizeUsername } from './username';

export interface ClientValidationResult {
  isValid: boolean;
  isFormatValid: boolean;
  error?: string;
  suggestions?: string[];
}

/**
 * Instant client-side validation for username format and rules
 * Does not check database availability - use for immediate feedback
 */
export function validateUsernameClient(username: string): ClientValidationResult {
  if (!username || username.trim() === '') {
    return {
      isValid: false,
      isFormatValid: false,
      error: undefined, // Don't show error for empty field initially
    };
  }

  const normalized = normalizeUsername(username);
  const validation = validateUsername(normalized);

  // Format is valid if it passes all rules except database availability
  const isFormatValid = validation.isValid;

  return {
    isValid: isFormatValid, // Will be updated with availability check
    isFormatValid,
    error: validation.error,
    suggestions: isFormatValid ? [] : generateSuggestions(username),
  };
}

/**
 * Generate username suggestions based on input
 */
function generateSuggestions(username: string): string[] {
  const base = username.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  if (base.length < 3) return [];

  const suggestions: string[] = [];
  
  // Add numbers
  for (let i = 1; i <= 3; i++) {
    suggestions.push(`${base}${i}`);
  }
  
  // Add hyphen variations
  if (base.length >= 3) {
    suggestions.push(`${base}-1`);
    suggestions.push(`my-${base}`);
  }
  
  // Add truncated versions if too long
  if (base.length > 30) {
    suggestions.push(base.substring(0, 27) + '123');
  }

  return suggestions.slice(0, 3); // Limit to 3 suggestions
}

/**
 * Check if username format is valid for API validation
 * Use this before making API calls to avoid unnecessary requests
 */
export function shouldValidateWithAPI(username: string): boolean {
  const result = validateUsernameClient(username);
  return result.isFormatValid && username.length >= 3;
}

/**
 * Debounce function for API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}