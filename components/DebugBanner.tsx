'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface DebugInfo {
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
  clerkPublishableKey: string | undefined;
  environment: string;
  connectionStatus: 'checking' | 'connected' | 'error' | 'not-configured';
  connectionError?: string;
}

export function DebugBanner() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    environment: 'detecting',
    connectionStatus: 'checking',
  });

  useEffect(() => {
    // Determine the actual environment more clearly
    const determineEnvironment = () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname.includes('vercel.app')) {
          return 'Vercel Preview';
        } else if (hostname.includes('jov.ie')) {
          return 'Production';
        } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return 'Local Development';
        } else {
          return 'Unknown';
        }
      }
      return 'Server';
    };

    setDebugInfo((prev) => ({
      ...prev,
      environment: determineEnvironment(),
    }));

    const checkConnection = async () => {
      try {
        // Check if environment variables are set
        if (!debugInfo.supabaseUrl || !debugInfo.supabaseAnonKey) {
          setDebugInfo((prev) => ({
            ...prev,
            connectionStatus: 'not-configured',
            connectionError: 'Missing Supabase environment variables',
          }));
          return;
        }

        // Test Supabase connection
        const supabase = createClient(
          debugInfo.supabaseUrl,
          debugInfo.supabaseAnonKey
        );

        // Try a simple query to test connection (query published artists which are publicly accessible)
        const { error } = await supabase
          .from('artists')
          .select('id')
          .eq('published', true)
          .limit(1)
          .maybeSingle();

        if (error) {
          setDebugInfo((prev) => ({
            ...prev,
            connectionStatus: 'error',
            connectionError: error.message,
          }));
        } else {
          setDebugInfo((prev) => ({
            ...prev,
            connectionStatus: 'connected',
          }));
        }
      } catch (error) {
        setDebugInfo((prev) => ({
          ...prev,
          connectionStatus: 'error',
          connectionError:
            error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    checkConnection();
  }, [debugInfo.supabaseUrl, debugInfo.supabaseAnonKey]);

  const getStatusColor = (status: DebugInfo['connectionStatus']) => {
    switch (status) {
      case 'connected':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'not-configured':
        return 'bg-yellow-500';
      case 'checking':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: DebugInfo['connectionStatus']) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      case 'not-configured':
        return 'Not Configured';
      case 'checking':
        return 'Checking...';
      default:
        return 'Unknown';
    }
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'Production':
        return 'text-red-600';
      case 'Vercel Preview':
        return 'text-orange-600';
      case 'Local Development':
        return 'text-green-600';
      case 'Server':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white text-xs p-2 border-b border-gray-700">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <span className="font-bold">🔧 DEBUG MODE</span>

          {/* Environment */}
          <div className="flex items-center space-x-1">
            <span>WHERE:</span>
            <span
              className={`font-mono ${getEnvironmentColor(
                debugInfo.environment
              )}`}
            >
              {debugInfo.environment}
            </span>
          </div>

          {/* Supabase URL */}
          <div className="flex items-center space-x-1">
            <span>DB:</span>
            <span className="font-mono text-blue-400">
              {debugInfo.supabaseUrl
                ? new URL(debugInfo.supabaseUrl).hostname
                : 'NOT SET'}
            </span>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-1">
            <span>STATUS:</span>
            <div
              className={`px-2 py-1 rounded text-white text-xs ${getStatusColor(
                debugInfo.connectionStatus
              )}`}
            >
              {getStatusText(debugInfo.connectionStatus)}
            </div>
          </div>

          {/* Environment Variables Status */}
          <div className="flex items-center space-x-2">
            <span>VARS:</span>
            <div className="flex space-x-1">
              <span
                className={`px-1 rounded ${
                  debugInfo.supabaseUrl ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={debugInfo.supabaseUrl || 'Not set'}
              >
                DB_URL
              </span>
              <span
                className={`px-1 rounded ${
                  debugInfo.supabaseAnonKey ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={debugInfo.supabaseAnonKey ? 'Set' : 'Not set'}
              >
                DB_KEY
              </span>
              <span
                className={`px-1 rounded ${
                  debugInfo.clerkPublishableKey ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={debugInfo.clerkPublishableKey ? 'Set' : 'Not set'}
              >
                CLERK
              </span>
            </div>
          </div>
        </div>

        {/* Error Details */}
        {debugInfo.connectionError && (
          <div className="text-red-400 font-mono max-w-md truncate">
            Error: {debugInfo.connectionError}
          </div>
        )}
      </div>
    </div>
  );
}
