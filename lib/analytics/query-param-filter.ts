/**
 * Utility functions for filtering sensitive query parameters from URLs
 */

/**
 * List of query parameter names that should be filtered out
 * These are typically parameters that might contain sensitive information
 */
export const SENSITIVE_QUERY_PARAMS = [
  // Authentication and security
  'token',
  'access_token',
  'refresh_token',
  'id_token',
  'auth_token',
  'api_key',
  'apikey',
  'password',
  'secret',
  'code',
  // Session and state
  'state',
  'session',
  'sessionid',
  // Personal information
  'email',
  'phone',
  'address',
  // Other potentially sensitive parameters
  'signature',
  'hash',
];

/**
 * Filters sensitive query parameters from a URL
 *
 * @param url - The URL to filter
 * @returns The URL with sensitive query parameters removed or masked
 */
export function filterSensitiveQueryParams(url: string): string {
  try {
    const urlObj = new URL(url, window.location.origin);

    // Check if there are any query parameters
    if (urlObj.search) {
      // Get all query parameters
      const params = new URLSearchParams(urlObj.search);
      let hasChanges = false;

      // Check each parameter against the sensitive list
      SENSITIVE_QUERY_PARAMS.forEach((param) => {
        if (params.has(param)) {
          // Remove the sensitive parameter
          params.delete(param);
          hasChanges = true;
        }
      });

      // Update the URL if changes were made
      if (hasChanges) {
        const newSearch = params.toString();
        return `${urlObj.pathname}${newSearch ? `?${newSearch}` : ''}${urlObj.hash}`;
      }
    }

    // Return the original URL if no changes were made or no query parameters exist
    return url.startsWith('http')
      ? url
      : `${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
  } catch (error) {
    // If URL parsing fails, return the original URL
    console.warn('Error filtering sensitive query params:', error);
    return url;
  }
}
