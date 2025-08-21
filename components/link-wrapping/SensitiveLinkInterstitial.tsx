'use client';

/**
 * Sensitive Link Interstitial Component
 * Provides human gesture verification before revealing target URL
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface SensitiveLinkInterstitialProps {
  linkId: string;
  domain: string;
  creatorUsername: string;
}

export default function SensitiveLinkInterstitial({
  linkId,
  domain,
  creatorUsername
}: SensitiveLinkInterstitialProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleContinue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch signed URL from API
      const response = await fetch(`/api/link/${linkId}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to get redirect URL');
      }
      
      const data = await response.json();
      
      if (!data.url) {
        throw new Error('Invalid response from server');
      }
      
      // Use location.replace to avoid browser history
      window.location.replace(data.url);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  }, [linkId]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 space-y-6">
        {/* Warning Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-600 dark:text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>
        
        {/* Content */}
        <div className="text-center space-y-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            External Link Warning
          </h1>
          
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              You are about to visit an external website:
            </p>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-gray-900 dark:text-gray-100">
              {domain}
            </p>
            <p>
              Shared by <span className="font-medium">@{creatorUsername}</span>
            </p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              ⚠️ This link leads to content that may not be suitable for all audiences.
              Jovie is not responsible for external content.
            </p>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-700 dark:text-red-400">
              {error}
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="w-4 h-4 mr-2" />
                Loading...
              </>
            ) : (
              'Continue to External Site'
            )}
          </Button>
          
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full"
            disabled={isLoading}
          >
            Go Back
          </Button>
        </div>
        
        {/* Footer */}
        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Protected by Jovie Anti-Scrape System
          </p>
        </div>
      </Card>
    </div>
  );
}