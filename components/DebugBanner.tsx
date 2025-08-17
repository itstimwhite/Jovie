'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useSession } from '@clerk/nextjs';
import { useFeatureFlags } from '@/components/providers/FeatureFlagsProvider';
import { env, flags as envFlags } from '@/lib/env';

interface DebugInfo {
  supabaseUrl: string | undefined;
  supabaseAnonKey: string | undefined;
  clerkPublishableKey: string | undefined;
  // Clerk Billing (replaces direct Stripe integration)
  clerkBillingEnabled: boolean;
  clerkBillingGateway: 'development' | 'stripe' | 'not-configured';
  environment: string;
  githubEnvironment: string;
  connectionStatus: 'checking' | 'connected' | 'error' | 'not-configured';
  connectionError?: string;
  clerkAuthStatus: 'checking' | 'authenticated' | 'unauthenticated' | 'error';
  clerkAuthError?: string;
  nativeIntegrationStatus: 'checking' | 'working' | 'error' | 'not-tested';
  nativeIntegrationError?: string;
  clerkSessionStatus: 'checking' | 'available' | 'unavailable' | 'error';
  clerkSessionError?: string;
  clerkTokenStatus: 'checking' | 'available' | 'unavailable' | 'error';
  clerkTokenError?: string;
  // Feature flags from Edge Config
  featureFlags: {
    artistSearchEnabled: boolean;
    debugBannerEnabled: boolean;
    tipPromoEnabled: boolean;
  };
}

export function DebugBanner() {
  const { session, isLoaded } = useSession();
  const { flags: featureFlags } = useFeatureFlags();
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    clerkPublishableKey: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    clerkBillingEnabled: envFlags.clerkBillingEnabled,
    clerkBillingGateway:
      envFlags.clerkBillingGateway === 'development' ||
      envFlags.clerkBillingGateway === 'stripe'
        ? envFlags.clerkBillingGateway
        : 'not-configured',
    environment: 'detecting',
    githubEnvironment: 'detecting',
    connectionStatus: 'checking',
    clerkAuthStatus: 'checking',
    nativeIntegrationStatus: 'checking',
    clerkSessionStatus: 'checking',
    clerkTokenStatus: 'checking',
    featureFlags: {
      artistSearchEnabled: true,
      debugBannerEnabled: process.env.NODE_ENV === 'development',
      tipPromoEnabled: true,
    },
  });

  // Reuse a single Supabase client to avoid multiple GoTrueClient instances warning
  const supabaseClient = useMemo(() => {
    if (!debugInfo.supabaseUrl || !debugInfo.supabaseAnonKey) return null;

    const auth = {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: session ? 'jovie-debug-native' : 'jovie-debug-conn',
    } as const;

    return createClient(debugInfo.supabaseUrl, debugInfo.supabaseAnonKey, {
      auth,
      // Provide token function only when we have a session
      ...(session && {
        accessToken: async () => (await session.getToken()) ?? null,
      }),
    });
  }, [debugInfo.supabaseUrl, debugInfo.supabaseAnonKey, session]);

  // Check if debug banner should be shown based on feature flags
  const shouldShowDebugBanner = featureFlags.debugBannerEnabled;

  // No noisy console logs in production

  // Log debug information to console instead of showing visual banner
  useEffect(() => {
    if (shouldShowDebugBanner) {
      const debugData = {
        environment: debugInfo.environment,
        githubEnvironment: debugInfo.githubEnvironment,
        connectionStatus: debugInfo.connectionStatus,
        connectionError: debugInfo.connectionError,
        clerkAuthStatus: debugInfo.clerkAuthStatus,
        clerkAuthError: debugInfo.clerkAuthError,
        nativeIntegrationStatus: debugInfo.nativeIntegrationStatus,
        nativeIntegrationError: debugInfo.nativeIntegrationError,
        clerkSessionStatus: debugInfo.clerkSessionStatus,
        clerkSessionError: debugInfo.clerkSessionError,
        clerkTokenStatus: debugInfo.clerkTokenStatus,
        clerkTokenError: debugInfo.clerkTokenError,
        clerkBillingEnabled: debugInfo.clerkBillingEnabled,
        clerkBillingGateway: debugInfo.clerkBillingGateway,
        featureFlags: debugInfo.featureFlags,
        environmentVariables: {
          supabaseUrl: debugInfo.supabaseUrl ? 'SET' : 'NOT SET',
          supabaseAnonKey: debugInfo.supabaseAnonKey ? 'SET' : 'NOT SET',
          clerkPublishableKey: debugInfo.clerkPublishableKey
            ? 'SET'
            : 'NOT SET',
        },
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'server',
      };

      console.group('🔧 DEBUG INFO');
      console.table(debugData);
      console.groupEnd();
    }
  }, [shouldShowDebugBanner, debugInfo]);

  // Update feature flags in debug info
  useEffect(() => {
    setDebugInfo((prev) => ({
      ...prev,
      featureFlags,
    }));
  }, [featureFlags]);

  useEffect(() => {
    // Update Clerk auth status when session changes
    if (isLoaded) {
      if (session) {
        setDebugInfo((prev) => ({
          ...prev,
          clerkAuthStatus: 'authenticated',
        }));
      } else {
        setDebugInfo((prev) => ({
          ...prev,
          clerkAuthStatus: 'unauthenticated',
        }));
      }
    }
  }, [session, isLoaded]);

  // Check Clerk session and token functionality
  useEffect(() => {
    const checkClerkMethods = async () => {
      try {
        // Check if Clerk environment variables are set
        if (!debugInfo.clerkPublishableKey) {
          setDebugInfo((prev) => ({
            ...prev,
            clerkSessionStatus: 'unavailable',
            clerkSessionError: 'Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
            clerkTokenStatus: 'unavailable',
            clerkTokenError: 'Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
          }));
          return;
        }

        // Check session availability
        if (isLoaded) {
          if (session) {
            setDebugInfo((prev) => ({
              ...prev,
              clerkSessionStatus: 'available',
            }));

            // Test token functionality
            try {
              const token = await session.getToken();
              if (token) {
                setDebugInfo((prev) => ({
                  ...prev,
                  clerkTokenStatus: 'available',
                }));
              } else {
                setDebugInfo((prev) => ({
                  ...prev,
                  clerkTokenStatus: 'unavailable',
                  clerkTokenError:
                    'Session exists but getToken() returned null',
                }));
              }
            } catch (error) {
              setDebugInfo((prev) => ({
                ...prev,
                clerkTokenStatus: 'error',
                clerkTokenError:
                  error instanceof Error
                    ? error.message
                    : 'Unknown token error',
              }));
            }
          } else {
            setDebugInfo((prev) => ({
              ...prev,
              clerkSessionStatus: 'unavailable',
              clerkSessionError: 'No active session',
              clerkTokenStatus: 'unavailable',
              clerkTokenError: 'No session available for token',
            }));
          }
        } else {
          setDebugInfo((prev) => ({
            ...prev,
            clerkSessionStatus: 'checking',
            clerkTokenStatus: 'checking',
          }));
        }
      } catch (error) {
        setDebugInfo((prev) => ({
          ...prev,
          clerkSessionStatus: 'error',
          clerkSessionError:
            error instanceof Error ? error.message : 'Unknown session error',
          clerkTokenStatus: 'error',
          clerkTokenError:
            error instanceof Error ? error.message : 'Unknown token error',
        }));
      }
    };

    checkClerkMethods();
  }, [session, isLoaded, debugInfo.clerkPublishableKey]);

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

        // Test Supabase connection using the memoized client
        const supabase = supabaseClient;
        if (!supabase) {
          setDebugInfo((prev) => ({
            ...prev,
            connectionStatus: 'error',
            connectionError: 'Supabase client not initialized',
          }));
          return;
        }

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

    const testNativeIntegration = async () => {
      try {
        if (!session || !debugInfo.supabaseUrl || !debugInfo.supabaseAnonKey) {
          setDebugInfo((prev) => ({
            ...prev,
            nativeIntegrationStatus: 'not-tested',
            nativeIntegrationError: 'No session or missing Supabase config',
          }));
          return;
        }

        // Test the native integration using the memoized authenticated client
        const supabase = supabaseClient;
        if (!supabase) {
          setDebugInfo((prev) => ({
            ...prev,
            nativeIntegrationStatus: 'error',
            nativeIntegrationError: 'Supabase client not initialized',
          }));
          return;
        }

        // Try to access user-specific data to test authentication
        const { error } = await supabase
          .from('users')
          .select('id')
          .limit(1)
          .maybeSingle();

        if (error) {
          setDebugInfo((prev) => ({
            ...prev,
            nativeIntegrationStatus: 'error',
            nativeIntegrationError: error.message,
          }));
        } else {
          setDebugInfo((prev) => ({
            ...prev,
            nativeIntegrationStatus: 'working',
          }));
        }
      } catch (error) {
        setDebugInfo((prev) => ({
          ...prev,
          nativeIntegrationStatus: 'error',
          nativeIntegrationError:
            error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    checkConnection();
    testNativeIntegration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debugInfo.supabaseUrl, debugInfo.supabaseAnonKey, session]);

  // Update Clerk billing status
  useEffect(() => {
    const isBillingConfigured = envFlags.clerkBillingEnabled;
    const hasGateway = envFlags.clerkBillingGateway !== 'not-configured';
    const gateway =
      isBillingConfigured && hasGateway
        ? envFlags.clerkBillingGateway
        : 'not-configured';

    setDebugInfo((prev) => ({
      ...prev,
      clerkBillingEnabled: envFlags.clerkBillingEnabled,
      clerkBillingGateway: gateway,
    }));
  }, []);

  // No visual banner - debug info is logged to console instead
  return null;
}
