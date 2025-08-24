'use client';

import { useCallback } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useFeatureFlag } from '@/lib/analytics';

// Custom error class for session expiry
export class SessionExpiredError extends Error {
  constructor(message = 'Your session has expired') {
    super(message);
    this.name = 'SessionExpiredError';
  }
}

// Options for guarded fetch
interface GuardedFetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

/**
 * Hook that returns a fetch function with authentication handling
 * This will automatically handle session expiry and trigger the SessionWatch component
 */
export function useGuardedFetch() {
  const { getToken } = useAuth();
  const isExpiredAuthFlowEnabled = useFeatureFlag('feature_expired_auth_flow', false);
  
  const guardedFetch = useCallback(
    async (url: string, options: GuardedFetchOptions = {}) => {
      const { retries = 2, retryDelay = 500, ...fetchOptions } = options;
      
      // Helper function for exponential backoff retry
      const fetchWithRetry = async (retriesLeft: number): Promise<Response> => {
        try {
          // Get a fresh token for each request when enhanced auth flow is enabled
          // Important: Do NOT use the deprecated template parameter
          const token = isExpiredAuthFlowEnabled
            ? await getToken({ skipCache: true })
            : await getToken();
          
          // Add authorization header if token is available
          const headers = new Headers(fetchOptions.headers);
          if (token) {
            headers.set('Authorization', `Bearer ${token}`);
          }
          
          // Make the request
          const response = await fetch(url, {
            ...fetchOptions,
            headers,
          });
          
          // Check for session expiry
          if (response.status === 401) {
            const data = await response.json().catch(() => ({}));
            
            if (data?.error === 'SESSION_EXPIRED') {
              // Dispatch custom event for SessionWatch to handle
              if (isExpiredAuthFlowEnabled && typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('auth:session-expired'));
              }
              
              throw new SessionExpiredError();
            }
          }
          
          return response;
        } catch (error) {
          // Don't retry on session expiry
          if (error instanceof SessionExpiredError) {
            throw error;
          }
          
          // Retry on network errors if retries left
          if (retriesLeft > 0) {
            await new Promise(resolve => 
              setTimeout(resolve, retryDelay * (2 ** (options.retries! - retriesLeft)))
            );
            return fetchWithRetry(retriesLeft - 1);
          }
          
          throw error;
        }
      };
      
      return fetchWithRetry(retries);
    },
    [getToken, isExpiredAuthFlowEnabled]
  );
  
  return guardedFetch;
}

