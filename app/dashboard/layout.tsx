import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { getDashboardData } from './actions';
import { Logo } from '@/components/ui/Logo';
import { UserButton } from '@/components/molecules/UserButton';
import { EnhancedThemeToggle } from '@/components/dashboard/molecules/EnhancedThemeToggle';
import { PendingClaimRunner } from '@/components/bridge/PendingClaimRunner';
import { PendingClaimHandler } from '@/components/dashboard/PendingClaimHandler';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

    return (
      <>
        <PendingClaimRunner />
        <PendingClaimHandler />

        <div className="min-h-screen bg-base transition-colors relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-50 grid-bg dark:grid-bg-dark pointer-events-none" />
          {/* Gradient orbs for visual depth */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:z-50">
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-surface-0 backdrop-blur-sm px-6 pb-4 border-r border-subtle">
                <div className="flex h-16 shrink-0 items-center">
                  <a href="/dashboard/overview" className="focus-visible:outline-none focus-visible:ring-2 ring-accent focus-visible:ring-offset-2 rounded-md">
                    <Logo size="md" />
                  </a>
                </div>
                <nav className="flex flex-1 flex-col">
                  <DashboardNav />
                </nav>
              </div>
            </div>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Top navigation */}
              <header className="w-full">
                <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-subtle bg-surface-0/80 backdrop-blur-sm">
                  <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-1">
                      {/* Mobile menu button */}
                      <div className="flex items-center lg:hidden">
                        <button
                          type="button"
                          className="text-secondary-token hover:text-primary-token focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <span className="sr-only">Open sidebar</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="ml-2 flex items-center space-x-4">
                      <EnhancedThemeToggle />
                      <UserButton />
                    </div>
                  </div>
                </div>
              </header>

              {/* Main content area */}
              <main className="flex-1 overflow-y-auto">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </>
    );
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
          <a
            href="/dashboard"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Refresh Page
          </a>
        </div>
      </div>
    );
  }
}

