import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { RedirectTracker } from '@/components/analytics/RedirectTracker';
import { ErrorFallback } from '@/components/dashboard/ErrorFallback';
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

    // On actual error, show a client-side error component
    return <ErrorFallback />;
  }
}
