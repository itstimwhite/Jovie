'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@clerk/nextjs';
import { useFeatureFlag } from '@/lib/analytics';

// Create a Supabase client with Clerk authentication
// This should be used in a React component or custom hook
export function useAuthenticatedClient() {
  const { getToken } = useAuth();
  
  const createClient = async () => {
    // Get Supabase URL and anon key from environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
      return null;
    }
    
    try {
      // Create a browser client
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
      
      // Get Clerk token for Supabase
      const token = await getToken({ template: 'supabase' });
      
      if (!token) {
        console.error('Failed to get Clerk token for Supabase');
        return null;
      }
      
      // Set the auth token in the Supabase client
      const { error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
      
      if (error) {
        console.error('Error setting Supabase session:', error);
        return null;
      }
      
      return supabase;
    } catch (error) {
      console.error('Error creating authenticated Supabase client:', error);
      return null;
    }
  };
  
  return { createClient };
}

// Legacy function for backward compatibility
export const createAuthenticatedClient = async () => {
  console.warn('createAuthenticatedClient is deprecated, use useAuthenticatedClient hook instead');
  return null;
};

// Legacy function for backward compatibility
export const queryWithRetry = async <T>(queryFn: () => Promise<T>): Promise<T> => {
  console.warn('queryWithRetry is deprecated, implement retry logic directly');
  return queryFn();
};

// Legacy function for backward compatibility
export const createAnonymousClient = () => {
  console.warn('createAnonymousClient is deprecated');
  return null;
};

// Legacy function for backward compatibility
export const batchQueries = async () => {
  console.warn('batchQueries is deprecated');
  return null;
};

// React hook for using authenticated Supabase client
export function useSupabase() {
  const { getToken } = useAuth();
  const isExpiredAuthFlowEnabled = useFeatureFlag('feature_expired_auth_flow', false);
  
  // Create a browser client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    return null;
  }
  
  // Create a browser client with custom auth
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    global: {
      fetch: async (url, options = {}) => {
        try {
          // Only inject token for Supabase API requests
          if (url.toString().includes(supabaseUrl)) {
            // Get fresh token on each request when enhanced auth flow is enabled
            const token = isExpiredAuthFlowEnabled
              ? await getToken({ template: 'supabase', skipCache: true })
              : await getToken({ template: 'supabase' });
            
            // Add token to request headers
            if (token) {
              options.headers = {
                ...options.headers,
                Authorization: `Bearer ${token}`,
              };
            }
          }
          
          return fetch(url, options);
        } catch (error) {
          console.error('Error in Supabase fetch wrapper:', error);
          
          // If we can't get a token, proceed with the request anyway
          // The server will return 401 if authentication is required
          return fetch(url, options);
        }
      },
    },
  });
  
  return supabase;
}

