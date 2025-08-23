'use client';

import { useState, useCallback } from 'react';
import { useGuardedFetch, SessionExpiredError } from '@/lib/auth/guarded-fetch';
import { useSessionMonitor } from '@/lib/auth/session-watch';
import { useFeatureFlag } from '@/lib/analytics';

interface ApiResponse {
  user?: Record<string, unknown>;
  error?: string;
  success?: boolean;
}

// Example component that demonstrates using guardedFetch
export function GuardedApiExample() {
  const guardedFetch = useGuardedFetch();
  const { handleSessionExpiry } = useSessionMonitor();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiResponse | null>(null);
  const isExpiredAuthFlowEnabled = useFeatureFlag('feature_expired_auth_flow', false);

  // Example function to fetch protected data
  const fetchProtectedData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use guardedFetch instead of regular fetch
      const response = await guardedFetch('/api/protected/user');
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const result = await response.json() as ApiResponse;
      setData(result);
    } catch (err) {
      console.error('Error fetching protected data:', err);
      
      // Handle session expired error
      if (err instanceof SessionExpiredError) {
        // This will be handled by the SessionWatch component
        // but we can also handle it here if needed
        setError('Your session has expired. Please sign in again.');
        
        // If feature flag is disabled, manually handle expiry
        if (!isExpiredAuthFlowEnabled) {
          handleSessionExpiry();
        }
      } else {
        setError('An error occurred while fetching data.');
      }
    } finally {
      setLoading(false);
    }
  }, [guardedFetch, handleSessionExpiry, isExpiredAuthFlowEnabled]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Protected API Example</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded">
          {error}
        </div>
      )}
      
      {data && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded">
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
      
      <button
        onClick={fetchProtectedData}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Fetch Protected Data'}
      </button>
      
      {isExpiredAuthFlowEnabled && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Using enhanced auth expiry handling
        </p>
      )}
    </div>
  );
}

