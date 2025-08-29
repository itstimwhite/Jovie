import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { RedirectTracker } from '@/components/analytics/RedirectTracker';
import { getDashboardData } from '../actions';

export default async function OverviewPage() {
  const { userId } = await auth();

  // Handle unauthenticated users
  if (!userId) {
    redirect('/sign-in?redirect_url=/dashboard/overview');
  }

  try {
    // Fetch dashboard data server-side
    const dashboardData = await getDashboardData();

    // Handle redirects for users who need onboarding
    if (dashboardData.needsOnboarding) {
      redirect('/onboarding');
    }

    // Pass server-fetched data to client component
    return (
      <>
        <RedirectTracker />
        <DashboardOverview initialData={dashboardData} />
      </>
    );
  } catch (error) {
    // Check if this is a Next.js redirect error (which is expected)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      // Re-throw redirect errors so they work properly
      throw error;
    }

    console.error('Error loading overview:', error);

    // On actual error, show a simple error page
    return (
      <div className="min-h-screen bg-white dark:bg-[#0D0E12] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 dark:text-white/70 mb-4">
            Failed to load overview data. Please refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
}
