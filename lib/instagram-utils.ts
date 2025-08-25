/**
 * Instagram handle validation and normalization utilities
 * 
 * These utilities help validate and normalize Instagram handles to ensure
 * consistent storage and lookup.
 */

/**
 * Instagram handle validation rules:
 * - 1-30 characters
 * - Can contain letters, numbers, periods, and underscores
 * - Cannot start with a period or underscore
 * - Cannot have consecutive periods
 * - Cannot use reserved words like "instagram" or "admin"
 */
const INSTAGRAM_HANDLE_REGEX = /^[a-zA-Z0-9](?:[a-zA-Z0-9._]*[a-zA-Z0-9])?$/;
const MAX_HANDLE_LENGTH = 30;
const RESERVED_HANDLES = [
  'instagram', 'admin', 'about', 'explore', 'login', 'signup', 'accounts',
  'direct', 'stories', 'reels', 'tags', 'official', 'help', 'api', 'press',
  'jobs', 'privacy', 'terms', 'contact', 'support', 'security'
];

/**
 * Validates an Instagram handle
 * 
 * @param handle The Instagram handle to validate
 * @returns An object with isValid and error properties
 */
export function validateInstagramHandle(handle: string): { 
  isValid: boolean; 
  error?: string;
} {
  // Normalize the handle first to remove @, instagram.com/, etc.
  const normalizedHandle = normalizeInstagramHandle(handle);
  
  // Empty handle is invalid
  if (!normalizedHandle) {
    return { isValid: false, error: 'Instagram handle cannot be empty' };
  }
  
  // Check length
  if (normalizedHandle.length > MAX_HANDLE_LENGTH) {
    return { 
      isValid: false, 
      error: `Instagram handle cannot exceed ${MAX_HANDLE_LENGTH} characters` 
    };
  }
  
  // Check format using regex
  if (!INSTAGRAM_HANDLE_REGEX.test(normalizedHandle)) {
    return { 
      isValid: false, 
      error: 'Instagram handle can only contain letters, numbers, periods, and underscores, and cannot start or end with a period or underscore' 
    };
  }
  
  // Check for consecutive periods
  if (normalizedHandle.includes('..')) {
    return { 
      isValid: false, 
      error: 'Instagram handle cannot contain consecutive periods' 
    };
  }
  
  // Check for reserved handles
  if (RESERVED_HANDLES.includes(normalizedHandle.toLowerCase())) {
    return { 
      isValid: false, 
      error: 'This Instagram handle is reserved and cannot be used' 
    };
  }
  
  return { isValid: true };
}

/**
 * Normalizes an Instagram handle by removing @, instagram.com/, etc.
 * 
 * @param handle The Instagram handle to normalize
 * @returns The normalized handle
 */
export function normalizeInstagramHandle(handle: string): string {
  if (!handle) return '';
  
  // Trim whitespace
  let normalized = handle.trim();
  
  // Remove @ prefix if present
  if (normalized.startsWith('@')) {
    normalized = normalized.substring(1);
  }
  
  // Remove instagram.com/ prefix if present
  const instagramUrlRegex = /^(?:https?:\/\/)?(?:www\.)?instagram\.com\//i;
  normalized = normalized.replace(instagramUrlRegex, '');
  
  // Remove trailing slash if present
  if (normalized.endsWith('/')) {
    normalized = normalized.substring(0, normalized.length - 1);
  }
  
  // Remove query parameters if present
  const queryParamIndex = normalized.indexOf('?');
  if (queryParamIndex !== -1) {
    normalized = normalized.substring(0, queryParamIndex);
  }
  
  return normalized;
}

/**
 * Gets the canonical Instagram profile URL for a handle
 * 
 * @param handle The Instagram handle (can be normalized or not)
 * @returns The canonical Instagram profile URL
 */
export function getInstagramProfileUrl(handle: string): string {
  const normalized = normalizeInstagramHandle(handle);
  if (!normalized) return '';
  
  return `https://www.instagram.com/${normalized}/`;
}

/**
 * Gets the Instagram oEmbed API URL for a handle
 * 
 * @param handle The Instagram handle (can be normalized or not)
 * @returns The Instagram oEmbed API URL
 */
export function getInstagramOEmbedUrl(handle: string): string {
  const profileUrl = getInstagramProfileUrl(handle);
  if (!profileUrl) return '';
  
  return `https://api.instagram.com/oembed/?url=${encodeURIComponent(profileUrl)}`;
}

