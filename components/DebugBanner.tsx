'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

interface DebugInfo {
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
  clerkPublishableKey: string | undefined;
  clerkSecretKey: string | undefined;
  spotifyClientId: string | undefined;
  spotifyClientSecret: string | undefined;
  stripeSecretKey: string | undefined;
  stripePricePro: string | undefined;
  stripeWebhookSecret: string | undefined;
  environment: string;
  githubEnvironment: string;
  connectionStatus: 'checking' | 'connected' | 'error' | 'not-configured';
  connectionError?: string;
  stripeMode: 'test' | 'production' | 'not-configured';
}

export function DebugBanner() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    clerkSecretKey: process.env.CLERK_SECRET_KEY,
    spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
    spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripePricePro: process.env.STRIPE_PRICE_PRO,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    environment: 'detecting',
    githubEnvironment: 'detecting',
    connectionStatus: 'checking',
    stripeMode: 'not-configured',
  });

  // Check if debug banner should be shown
  const shouldShowDebugBanner = true; // Temporarily always show for debugging

  useEffect(() => {
    // Determine the actual environment more clearly
    const determineEnvironment = () => {
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        if (hostname === 'jov.ie') {
          return 'Production (jov.ie)';
        } else if (hostname === 'preview.jov.ie') {
          return 'Preview (preview.jov.ie)';
        } else if (hostname === 'jovie-dev.vercel.app') {
          return 'Develop (jovie-dev.vercel.app)';
        } else if (hostname.includes('vercel.app')) {
          return 'Vercel Preview';
        } else if (hostname === 'localhost' || hostname === '127.0.0.1') {
          return 'Local Development';
        } else {
          return 'Unknown';
        }
      }
      return 'Server';
    };

    // Determine which GitHub environment secrets are being used
    const determineGitHubEnvironment = (env: string) => {
      switch (env) {
        case 'Production (jov.ie)':
          return 'Production GitHub Env';
        case 'Preview (preview.jov.ie)':
          return 'Preview GitHub Env';
        case 'Develop (jovie-dev.vercel.app)':
          return 'Develop GitHub Env';
        case 'Local Development':
          return 'Local (.env.local)';
        case 'Vercel Preview':
          return 'Vercel Env Vars';
        default:
          return 'Unknown';
      }
    };

    const detectedEnvironment = determineEnvironment();
    const detectedGitHubEnv = determineGitHubEnvironment(detectedEnvironment);

    setDebugInfo((prev) => ({
      ...prev,
      environment: detectedEnvironment,
      githubEnvironment: detectedGitHubEnv,
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

  // Update Stripe mode when stripeSecretKey changes
  useEffect(() => {
    const determineStripeMode = (stripeKey: string | undefined) => {
      if (!stripeKey) return 'not-configured';
      if (stripeKey.startsWith('sk_test_')) return 'test';
      if (stripeKey.startsWith('sk_live_')) return 'production';
      return 'not-configured';
    };

    const detectedStripeMode = determineStripeMode(debugInfo.stripeSecretKey);

    setDebugInfo((prev) => ({
      ...prev,
      stripeMode: detectedStripeMode,
    }));
  }, [debugInfo.stripeSecretKey]);

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
      case 'Production (jov.ie)':
        return 'text-red-600';
      case 'Preview (preview.jov.ie)':
        return 'text-orange-600';
      case 'Develop (jovie-dev.vercel.app)':
        return 'text-green-600';
      case 'Vercel Preview':
        return 'text-purple-600';
      case 'Local Development':
        return 'text-blue-600';
      case 'Server':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStripeModeColor = (mode: DebugInfo['stripeMode']) => {
    switch (mode) {
      case 'test':
        return 'text-yellow-500';
      case 'production':
        return 'text-red-500';
      case 'not-configured':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStripeModeText = (mode: DebugInfo['stripeMode']) => {
    switch (mode) {
      case 'test':
        return 'TEST';
      case 'production':
        return 'PROD';
      case 'not-configured':
        return 'NOT SET';
      default:
        return 'UNKNOWN';
    }
  };

  // Generate debug JSON for copying
  const generateDebugJson = () => {
    return JSON.stringify(
      {
        environment: debugInfo.environment,
        githubEnvironment: debugInfo.githubEnvironment,
        connectionStatus: debugInfo.connectionStatus,
        connectionError: debugInfo.connectionError,
        stripeMode: debugInfo.stripeMode,
        environmentVariables: {
          supabaseUrl: debugInfo.supabaseUrl ? 'SET' : 'NOT SET',
          supabaseAnonKey: debugInfo.supabaseAnonKey ? 'SET' : 'NOT SET',
          clerkPublishableKey: debugInfo.clerkPublishableKey
            ? 'SET'
            : 'NOT SET',
          clerkSecretKey: debugInfo.clerkSecretKey ? 'SET' : 'NOT SET',
          spotifyClientId: debugInfo.spotifyClientId ? 'SET' : 'NOT SET',
          spotifyClientSecret: debugInfo.spotifyClientSecret
            ? 'SET'
            : 'NOT SET',
          stripeSecretKey: debugInfo.stripeSecretKey ? 'SET' : 'NOT SET',
          stripePricePro: debugInfo.stripePricePro ? 'SET' : 'NOT SET',
          stripeWebhookSecret: debugInfo.stripeWebhookSecret
            ? 'SET'
            : 'NOT SET',
        },
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'server',
      },
      null,
      2
    );
  };

  // Copy debug info to clipboard
  const copyDebugInfo = async () => {
    try {
      await navigator.clipboard.writeText(generateDebugJson());
      console.log('Debug info copied to clipboard');
    } catch (error) {
      console.error('Failed to copy debug info:', error);
    }
  };

  // Don't render if debug banner is disabled
  if (!shouldShowDebugBanner) {
    console.log('Debug banner disabled');
    return null;
  }

  console.log('Debug banner should show:', {
    shouldShowDebugBanner,
    environment: debugInfo.environment,
    connectionStatus: debugInfo.connectionStatus,
    supabaseUrl: debugInfo.supabaseUrl ? 'SET' : 'NOT SET',
    supabaseAnonKey: debugInfo.supabaseAnonKey ? 'SET' : 'NOT SET',
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white text-xs p-2 border-b border-gray-700 min-h-[40px]">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4 flex-wrap">
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

          {/* GitHub Environment */}
          <div className="flex items-center space-x-1">
            <span>SECRETS:</span>
            <span className="font-mono text-cyan-400">
              {debugInfo.githubEnvironment}
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

          {/* Stripe Mode */}
          <div className="flex items-center space-x-1">
            <span>STRIPE:</span>
            <span
              className={`font-mono px-1 rounded ${getStripeModeColor(
                debugInfo.stripeMode
              )}`}
            >
              {getStripeModeText(debugInfo.stripeMode)}
            </span>
          </div>

          {/* Environment Variables Status */}
          <div className="flex items-center space-x-2">
            <span>VARS:</span>
            <div className="flex space-x-1 flex-wrap">
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
              <span
                className={`px-1 rounded ${
                  debugInfo.clerkSecretKey ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={debugInfo.clerkSecretKey ? 'Set' : 'Not set'}
              >
                CLERK_SECRET
              </span>
              <span
                className={`px-1 rounded ${
                  debugInfo.spotifyClientId ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={debugInfo.spotifyClientId ? 'Set' : 'Not set'}
              >
                SPOTIFY_ID
              </span>
              <span
                className={`px-1 rounded ${
                  debugInfo.spotifyClientSecret ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={debugInfo.spotifyClientSecret ? 'Set' : 'Not set'}
              >
                SPOTIFY_SECRET
              </span>
              <span
                className={`px-1 rounded ${
                  debugInfo.stripeSecretKey ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={debugInfo.stripeSecretKey ? 'Set' : 'Not set'}
              >
                STRIPE_KEY
              </span>
              <span
                className={`px-1 rounded ${
                  debugInfo.stripePricePro ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={debugInfo.stripePricePro ? 'Set' : 'Not set'}
              >
                STRIPE_PRICE
              </span>
              <span
                className={`px-1 rounded ${
                  debugInfo.stripeWebhookSecret ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={debugInfo.stripeWebhookSecret ? 'Set' : 'Not set'}
              >
                STRIPE_WEBHOOK
              </span>
            </div>
          </div>
        </div>

        {/* Copy Button and Error Details */}
        <div className="flex items-center space-x-2">
          <button
            onClick={copyDebugInfo}
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs font-mono"
            title="Copy debug info to clipboard"
          >
            📋 COPY
          </button>

          {debugInfo.connectionError && (
            <div className="text-red-400 font-mono max-w-md truncate">
              Error: {debugInfo.connectionError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
