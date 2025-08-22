import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getDashboardData } from './actions';

// Dashboard skeleton component
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0E12] transition-colors">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2 w-64" />
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-80" />
        </div>
        
        <div className="mb-8">
          <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
        
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-xl p-6 shadow-xl">
          <div className="flex space-x-8 mb-6 border-b border-gray-200/50 dark:border-white/10">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-20 mb-3" />
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Dynamic import of DashboardClient for code splitting
const DashboardClient = dynamic(
  () => import('@/components/dashboard/DashboardClient').then(mod => ({ default: mod.DashboardClient })),
  {
    loading: () => <DashboardSkeleton />,
    ssr: false,
  }
);

export default async function DashboardPage() {
  const { userId } = await auth();

  // Handle unauthenticated users
  if (!userId) {
    redirect('/sign-in?redirect_url=/dashboard');
  }

  try {
    // Fetch dashboard data server-side
    const dashboardData = await getDashboardData();

    // Handle redirects for users who need onboarding
    if (dashboardData.needsOnboarding) {
      redirect('/onboarding');
    }

    // Pass server-fetched data to client component
    return <DashboardClient initialData={dashboardData} />;
  } catch (error) {
    // Check if this is a Next.js redirect error (which is expected)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      // Re-throw redirect errors so they work properly
      throw error;
    }

    console.error('Error loading dashboard:', error);

    // On actual error, show a simple error page
    return (
      <div className="min-h-screen bg-white dark:bg-[#0D0E12] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-white/70 mb-4">
            Failed to load dashboard data. Please refresh the page.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Refresh Page
          </Link>
        </div>
      </div>
    );
  }
}
