/**
 * Validates a Venmo handle
 * 
 * Rules:
 * - Must be between 1 and 32 characters
 * - Can contain letters, numbers, hyphens, underscores
 * - Cannot contain spaces or special characters
 * - '@' symbol is optional at the beginning
 * 
 * @param handle The Venmo handle to validate
 * @returns An object with isValid and error properties
 */
export function validateVenmoHandle(handle: string | null | undefined): { 
  isValid: boolean; 
  error?: string;
  normalizedHandle?: string;
} {
  if (!handle || handle.trim() === '') {
    return { isValid: true, normalizedHandle: '' }; // Empty is valid (to clear the handle)
  }

  // Remove @ prefix if present
  const normalizedHandle = handle.trim().startsWith('@') 
    ? handle.trim().substring(1) 
    : handle.trim();
  
  // Check length (1-32 characters)
  if (normalizedHandle.length > 32) {
    return { 
      isValid: false, 
      error: 'Venmo handle must be 32 characters or less' 
    };
  }
  
  // Check for valid characters (letters, numbers, hyphens, underscores)
  const validPattern = /^[a-zA-Z0-9_-]+$/;
  if (!validPattern.test(normalizedHandle)) {
    return { 
      isValid: false, 
      error: 'Venmo handle can only contain letters, numbers, hyphens, and underscores' 
    };
  }
  
  return { 
    isValid: true, 
    normalizedHandle 
  };
}

