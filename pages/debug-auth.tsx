import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';

interface DebugInfo {
  auth: {
    userId: string | null;
    sessionId: string | null;
    hasToken: boolean;
    tokenPreview: string | null;
  };
  environment: {
    NODE_ENV?: string;
    VERCEL_ENV?: string;
    hasClerkPublishableKey?: boolean;
    hasClerkSecretKey?: boolean;
    clerkPublishableKeyPrefix?: string;
    hasE2ECredentials?: boolean;
    e2eUsername?: string | null;
  };
  request: {
    userAgent?: string;
    ip?: string;
    method?: string;
    url?: string;
    headers?: {
      'x-clerk-session-id'?: string;
      cookie?: string;
    };
  };
  botDetection: {
    suspiciousPatterns: Array<{ pattern: string; matches: boolean }>;
    isSuspicious: boolean;
  };
  recommendations: string[];
}

/**
 * Development-only page to debug authentication differences
 * Compare E2E test environment vs manual browser environment
 */
export default function DebugAuthPage() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const [serverInfo, setServerInfo] = useState<DebugInfo | null>(null);
  const [tokenInfo, setTokenInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDebugInfo() {
      try {
        setError(null);
        // Get server-side auth status
        const serverResponse = await fetch('/api/debug/auth-status');

        if (!serverResponse.ok) {
          throw new Error(
            `API responded with status: ${serverResponse.status}`
          );
        }

        const serverData = await serverResponse.json();

        if (serverData.error) {
          throw new Error(
            `API error: ${serverData.message || serverData.error}`
          );
        }

        setServerInfo(serverData);

        // Get client-side token
        if (isSignedIn && getToken) {
          try {
            const token = await getToken();
            setTokenInfo(token ? `${token.substring(0, 50)}...` : null);
          } catch (tokenError) {
            console.error('Token error:', tokenError);
            setTokenInfo('ERROR: ' + (tokenError as Error).message);
          }
        }
      } catch (error) {
        console.error('Debug fetch error:', error);
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoading(false);
      }
    }

    if (isLoaded) {
      fetchDebugInfo();
    }
  }, [isLoaded, isSignedIn, getToken]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return <div>Not available in production</div>;
  }

  if (loading) {
    return <div className="p-8">Loading debug information...</div>;
  }

  if (error) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-red-600">
          Debug Tool Error
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-semibold">
            Error loading debug information:
          </p>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Authentication Debug Dashboard
      </h1>
      <p className="text-gray-600 mb-8">
        This page helps diagnose differences between E2E test authentication and
        manual browser authentication.
      </p>

      {/* Client-Side Authentication Status */}
      <div className="mb-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          🌐 Client-Side Authentication (useAuth hook)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Is Loaded:</strong> {isLoaded ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>Is Signed In:</strong> {isSignedIn ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>User ID:</strong> {userId || 'None'}
          </div>
          <div>
            <strong>Session ID:</strong> {sessionId || 'None'}
          </div>
          <div className="col-span-2">
            <strong>User Email:</strong>{' '}
            {user?.primaryEmailAddress?.emailAddress || 'None'}
          </div>
          <div className="col-span-2">
            <strong>Client Token Preview:</strong>
            <code className="text-xs bg-gray-200 p-1 rounded ml-2">
              {tokenInfo || 'None'}
            </code>
          </div>
        </div>
      </div>

      {/* Server-Side Authentication Status */}
      {serverInfo && (
        <div className="mb-8 bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            🖥️ Server-Side Authentication (auth() function)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>User ID:</strong> {serverInfo.auth.userId || 'None'}
            </div>
            <div>
              <strong>Session ID:</strong> {serverInfo.auth.sessionId || 'None'}
            </div>
            <div>
              <strong>Has Token:</strong>{' '}
              {serverInfo.auth.hasToken ? '✅ Yes' : '❌ No'}
            </div>
            <div>
              <strong>Server Token Preview:</strong>
              <code className="text-xs bg-gray-200 p-1 rounded">
                {serverInfo.auth.tokenPreview || 'None'}
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Environment Status */}
      {serverInfo && (
        <div className="mb-8 bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            ⚙️ Environment Configuration
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>NODE_ENV:</strong>{' '}
              {String(serverInfo.environment.NODE_ENV || 'unknown')}
            </div>
            <div>
              <strong>VERCEL_ENV:</strong>{' '}
              {String(serverInfo.environment.VERCEL_ENV || 'local')}
            </div>
            <div>
              <strong>Clerk Publishable Key:</strong>{' '}
              {serverInfo.environment.hasClerkPublishableKey
                ? '✅ Set'
                : '❌ Missing'}
            </div>
            <div>
              <strong>Clerk Secret Key:</strong>{' '}
              {serverInfo.environment.hasClerkSecretKey
                ? '✅ Set'
                : '❌ Missing'}
            </div>
            <div>
              <strong>E2E Test Credentials:</strong>{' '}
              {serverInfo.environment.hasE2ECredentials
                ? '✅ Set'
                : '❌ Missing'}
            </div>
            <div>
              <strong>E2E Username:</strong>{' '}
              {String(serverInfo.environment.e2eUsername || 'Not set')}
            </div>
            <div className="col-span-2">
              <strong>Publishable Key Prefix:</strong>
              <code className="text-xs bg-gray-200 p-1 rounded ml-2">
                {String(
                  serverInfo.environment.clerkPublishableKeyPrefix || 'unknown'
                )}
                ...
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Request Information */}
      {serverInfo && (
        <div className="mb-8 bg-purple-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📡 Request Information</h2>
          <div className="space-y-2">
            <div>
              <strong>User Agent:</strong>{' '}
              <code className="text-xs bg-gray-200 p-1 rounded">
                {serverInfo.request.userAgent}
              </code>
            </div>
            <div>
              <strong>IP Address:</strong> {serverInfo.request.ip}
            </div>
            <div>
              <strong>Cookies:</strong>{' '}
              {serverInfo.request.headers?.cookie === 'present'
                ? '✅ Present'
                : '❌ Missing'}
            </div>
            <div>
              <strong>Clerk Session Header:</strong>{' '}
              {serverInfo.request.headers?.['x-clerk-session-id'] || 'None'}
            </div>
          </div>
        </div>
      )}

      {/* Bot Detection Analysis */}
      {serverInfo?.botDetection && (
        <div className="mb-8 bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            🤖 Bot Detection Analysis
          </h2>
          <div>
            <strong>Is Suspicious:</strong>{' '}
            {serverInfo.botDetection.isSuspicious ? '⚠️ Yes' : '✅ No'}
          </div>
          <div className="mt-2">
            <strong>Pattern Checks:</strong>
            <ul className="list-disc list-inside mt-1">
              {serverInfo.botDetection.suspiciousPatterns.map(
                (pattern, index: number) => (
                  <li
                    key={index}
                    className={
                      pattern.matches ? 'text-red-600' : 'text-green-600'
                    }
                  >
                    {pattern.pattern}:{' '}
                    {pattern.matches ? '❌ Match' : '✅ No match'}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {serverInfo?.recommendations && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">💡 Recommendations</h2>
          <ul className="space-y-1">
            {serverInfo.recommendations.map((rec: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">🔧 Quick Actions</h2>
        <div className="space-y-2">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          >
            Refresh Debug Info
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                JSON.stringify(serverInfo, null, 2)
              );
              alert('Debug info copied to clipboard');
            }}
            className="bg-green-500 text-white px-4 py-2 rounded mr-4"
          >
            Copy Debug Info
          </button>
          <Link
            href="/sign-in"
            className="bg-purple-500 text-white px-4 py-2 rounded inline-block mr-4"
          >
            Go to Sign In
          </Link>
          <Link
            href="/dashboard"
            className="bg-orange-500 text-white px-4 py-2 rounded inline-block"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="mt-4 p-4 bg-white rounded border">
          <h3 className="font-semibold mb-2">E2E Test Comparison:</h3>
          <p className="text-sm text-gray-600 mb-2">
            E2E tests use <code>setupClerkTestingToken()</code> which bypasses
            security measures. Compare the values above with what you see during
            manual testing.
          </p>
          <p className="text-sm text-gray-600">
            Expected differences: E2E tests have special tokens, different user
            agents, and bypass bot detection.
          </p>
        </div>
      </div>
    </div>
  );
}
