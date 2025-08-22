/**
 * Utility functions for route-based analytics suppression
 */

/**
 * List of route patterns that should be suppressed from analytics
 */
export const SUPPRESSED_ROUTE_PATTERNS = [
  // Redirect routes
  /^\/go\/.*/,
  /^\/out\/.*/,
  // API routes
  /^\/api\/.*/,
];

/**
 * Checks if analytics should be suppressed for the given route
 *
 * @param pathname - The current pathname (from window.location.pathname)
 * @param statusCode - Optional HTTP status code (for detecting error pages)
 * @returns true if analytics should be suppressed, false otherwise
 */
export function shouldSuppressAnalytics(
  pathname: string,
  statusCode?: number
): boolean {
  // Check for error pages (404, 500, etc.)
  if (statusCode && (statusCode === 404 || statusCode >= 500)) {
    return true;
  }

  // Check against suppressed route patterns
  return SUPPRESSED_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));
}
