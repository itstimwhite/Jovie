'use client';

import { useFeatureFlag } from '@/lib/analytics';

// Custom error class for session expiry
export class SessionExpiredError extends Error {
  constructor(message = 'Your session has expired') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

// Interface for API error responses
interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// Options for guardedFetch
interface GuardedFetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

/**
 * Guarded fetch that handles authentication errors
 * 
 * @param url The URL to fetch
 * @param options Fetch options with additional retry configuration
 * @returns The fetch response
 * @throws SessionExpiredError if the session has expired
 */
export async function guardedFetch(
  url: string,
  options?: GuardedFetchOptions
): Promise<Response> {
  const { retries = 1, retryDelay = 500, ...fetchOptions } = options || {};
  
  // Helper function for exponential backoff retry
  const fetchWithRetry = async (retriesLeft: number): Promise<Response> => {
    try {
      const response = await fetch(url, fetchOptions);
      
      // Check for 401 status
      if (response.status === 401) {
        // Try to parse the response to check for SESSION_EXPIRED error
        try {
          const clone = response.clone();
          const data = await clone.json() as ApiErrorResponse;
          
          if (data.error === 'SESSION_EXPIRED') {
            // Dispatch custom event for SessionWatch to handle
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('auth:session-expired'));
            }
            
            throw new SessionExpiredError();
          }
        } catch (parseError) {
          // If we can't parse the response, assume it's a generic auth error
          if (parseError instanceof SessionExpiredError) {
            throw parseError;
          }
        }
      }
      
      // For other error status codes, check if we should retry
      if (!response.ok && retriesLeft > 0) {
        // Wait with exponential backoff
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchWithRetry(retriesLeft - 1);
      }
      
      return response;
    } catch (error) {
      // Network errors or other fetch failures
      if (error instanceof SessionExpiredError) {
        throw error;
      }
      
      if (retriesLeft > 0) {
        // Wait with exponential backoff
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchWithRetry(retriesLeft - 1);
      }
      
      throw error;
    }
  };
  
  return fetchWithRetry(retries);
}

/**
 * React hook for using guardedFetch with feature flag awareness
 */
export function useGuardedFetch() {
  const isExpiredAuthFlowEnabled = useFeatureFlag('feature_expired_auth_flow', false);
  
  return async (url: string, options?: GuardedFetchOptions): Promise<Response> => {
    if (isExpiredAuthFlowEnabled) {
      return guardedFetch(url, options);
    } else {
      // Fall back to regular fetch if feature is disabled
      return fetch(url, options);
    }
  };
}

