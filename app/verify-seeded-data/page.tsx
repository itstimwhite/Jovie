import React from 'react';
import { createBrowserClient } from '@/lib/supabase';
import { env } from '@/lib/env';

interface VerificationResult {
  test: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export default function VerifySeededDataPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Seeded Artist Data Verification
          </h1>

          <div className="space-y-6">
            <EnvironmentCheck />
            <DatabaseTests />
          </div>
        </div>
      </div>
    </div>
  );
}

function EnvironmentCheck() {
  const envChecks = [
    { name: 'NEXT_PUBLIC_SUPABASE_URL', value: env.NEXT_PUBLIC_SUPABASE_URL },
    {
      name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      value: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
    {
      name: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
      value: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    },
  ];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        🔍 Environment Configuration
      </h2>
      <div className="space-y-3">
        {envChecks.map((check) => (
          <div key={check.name} className="flex items-center space-x-3">
            <div
              className={`w-4 h-4 rounded-full ${check.value ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
              {check.name}
            </span>
            <span
              className={`text-sm ${check.value ? 'text-green-600' : 'text-red-600'}`}
            >
              {check.value ? '✅ Configured' : '❌ Missing'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DatabaseTests() {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        🗄️ Database Connectivity Tests
      </h2>
      <div className="space-y-4">
        <ArtistDataTest />
        <SocialLinksTest />
        <ProfileQueryTest />
      </div>
    </div>
  );
}

function ArtistDataTest() {
  const [result, setResult] = React.useState<VerificationResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  const testArtistData = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      if (!supabase) {
        setResult({
          test: 'Artist Data Query',
          status: 'error',
          message: 'Supabase client could not be created',
        });
        return;
      }

      const { data, error, count } = await supabase
        .from('artists')
        .select('handle, name, published, image_url', { count: 'exact' })
        .eq('published', true);

      if (error) {
        setResult({
          test: 'Artist Data Query',
          status: 'error',
          message: error.message,
          details: error,
        });
        return;
      }

      setResult({
        test: 'Artist Data Query',
        status: 'success',
        message: `Found ${count} published artists`,
        details: data?.slice(0, 3), // Show first 3 artists
      });
    } catch (error: any) {
      setResult({
        test: 'Artist Data Query',
        status: 'error',
        message: error.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    testArtistData();
  }, []);

  return (
    <TestResult
      result={result}
      loading={loading}
      onRetry={testArtistData}
      title="Published Artists Query"
    />
  );
}

function SocialLinksTest() {
  const [result, setResult] = React.useState<VerificationResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  const testSocialLinks = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      if (!supabase) {
        setResult({
          test: 'Social Links Query',
          status: 'error',
          message: 'Supabase client could not be created',
        });
        return;
      }

      // First get an artist
      const { data: artists } = await supabase
        .from('artists')
        .select('id, handle, name')
        .eq('published', true)
        .limit(1);

      if (!artists || artists.length === 0) {
        setResult({
          test: 'Social Links Query',
          status: 'warning',
          message: 'No published artists found to test social links',
        });
        return;
      }

      const artist = artists[0] as any;

      // Test social links query
      const { data, error, count } = await supabase
        .from('social_links')
        .select('platform, url', { count: 'exact' })
        .eq('artist_id', artist.id);

      if (error) {
        setResult({
          test: 'Social Links Query',
          status: 'error',
          message: error.message,
          details: error,
        });
        return;
      }

      setResult({
        test: 'Social Links Query',
        status: 'success',
        message: `Found ${count} social links for ${artist.name}`,
        details: { artist: artist.name, links: data },
      });
    } catch (error: any) {
      setResult({
        test: 'Social Links Query',
        status: 'error',
        message: error.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    testSocialLinks();
  }, []);

  return (
    <TestResult
      result={result}
      loading={loading}
      onRetry={testSocialLinks}
      title="Social Links RLS Test"
    />
  );
}

function ProfileQueryTest() {
  const [result, setResult] = React.useState<VerificationResult | null>(null);
  const [loading, setLoading] = React.useState(false);

  const testProfileQuery = async () => {
    setLoading(true);
    try {
      const supabase = createBrowserClient();
      if (!supabase) {
        setResult({
          test: 'Profile Query',
          status: 'error',
          message: 'Supabase client could not be created',
        });
        return;
      }

      // Get a published artist handle
      const { data: artists } = await supabase
        .from('artists')
        .select('handle')
        .eq('published', true)
        .limit(1);

      if (!artists || artists.length === 0) {
        setResult({
          test: 'Profile Query',
          status: 'warning',
          message: 'No published artists found for profile test',
        });
        return;
      }

      const testHandle = (artists[0] as any).handle;

      // Test the exact query pattern used in profile pages
      const { data, error } = await supabase
        .from('artists')
        .select('*, social_links(*)')
        .eq('handle', testHandle)
        .eq('published', true)
        .single();

      if (error) {
        setResult({
          test: 'Profile Query',
          status: 'error',
          message: error.message,
          details: error,
        });
        return;
      }

      const dataAny = data as any;
      const socialLinksCount = dataAny.social_links?.length || 0;
      const hasImage = !!dataAny.image_url;

      setResult({
        test: 'Profile Query',
        status: 'success',
        message: `Profile query successful for @${testHandle}`,
        details: {
          artist: dataAny.name,
          handle: testHandle,
          hasImage,
          socialLinksCount,
          platforms: dataAny.social_links?.map((link: any) => link.platform),
        },
      });
    } catch (error: any) {
      setResult({
        test: 'Profile Query',
        status: 'error',
        message: error.message || 'Unknown error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    testProfileQuery();
  }, []);

  return (
    <TestResult
      result={result}
      loading={loading}
      onRetry={testProfileQuery}
      title="Profile Page Query Pattern"
    />
  );
}

function TestResult({
  result,
  loading,
  onRetry,
  title,
}: {
  result: VerificationResult | null;
  loading: boolean;
  onRetry: () => void;
  title: string;
}) {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <button
          onClick={onRetry}
          disabled={loading}
          className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
        >
          {loading ? '⏳ Testing...' : '🔄 Retry'}
        </button>
      </div>

      {loading ? (
        <div className="text-sm text-gray-600">Running test...</div>
      ) : result ? (
        <div className={`p-3 rounded border ${getStatusColor(result.status)}`}>
          <div className="flex items-center space-x-2 mb-2">
            <span>{getStatusIcon(result.status)}</span>
            <span className="font-medium">{result.message}</span>
          </div>

          {result.details && (
            <div className="mt-2 text-sm">
              <details className="cursor-pointer">
                <summary>View Details</summary>
                <pre className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
