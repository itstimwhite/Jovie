// import { OnboardingForm } from '@/components/dashboard'; // Kept for fallback

import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { OnboardingFormWrapper } from '@/components/dashboard/organisms/OnboardingFormWrapper';
import { Container } from '@/components/site/Container';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { APP_NAME } from '@/constants/app';
import { getFeatureFlags } from '@/lib/feature-flags';

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    // Require auth for onboarding; preserve destination
    redirect('/sign-in?redirect_url=/onboarding');
  }

  // Get feature flags to determine which onboarding flow to use
  const featureFlags = await getFeatureFlags();

  // Enable Apple-style design based on feature flag (default to true)
  const useAppleStyle = featureFlags.appleStyleOnboardingEnabled ?? true;

  // Enable minimalist design based on feature flag (as fallback)
  const useMinimalistDesign = featureFlags.minimalistOnboardingEnabled ?? true;

  // If using Apple-style design, render a clean full-screen layout
  if (useAppleStyle) {
    return (
      <div className='min-h-screen bg-white dark:bg-black transition-colors'>
        {/* Theme Toggle */}
        <div className='absolute top-4 right-4 z-20'>
          <ThemeToggle />
        </div>

        {/* Full-screen form without container or card */}
        <OnboardingFormWrapper
          useProgressiveForm={featureFlags.progressiveOnboardingEnabled}
          useMinimalistDesign={useMinimalistDesign}
          useAppleStyle={useAppleStyle}
        />
      </div>
    );
  }

  // Read prefilled handle from query or cookie/session fallback later in the form
  // We cannot access searchParams directly here without defining them in the component signature,
  // so the client form will read from URL and sessionStorage.
  return (
    <div className='min-h-screen bg-white dark:bg-black transition-colors'>
      {/* Clean background - no patterns for minimalist design */}
      {!useMinimalistDesign && (
        <>
          {/* Subtle grid background pattern - only shown in non-minimalist mode */}
          <div className='absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]' />

          {/* Gradient orbs - only shown in non-minimalist mode */}
          <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl' />
          <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl' />
        </>
      )}

      {/* Theme Toggle */}
      <div className='absolute top-4 right-4 z-20'>
        <ThemeToggle />
      </div>

      <Container className='relative z-10 flex min-h-screen items-center justify-center py-8'>
        <div className='w-full max-w-md'>
          {/* Header - simplified for minimalist design */}
          <div className='text-center mb-6'>
            <h1
              className={`text-3xl font-medium text-black dark:text-white mb-1 transition-colors ${useMinimalistDesign ? 'font-normal' : 'font-semibold'}`}
            >
              {useMinimalistDesign
                ? 'Create Your Profile'
                : `Welcome to ${APP_NAME}`}
            </h1>
            {!useMinimalistDesign && (
              <p className='text-gray-600 dark:text-white/70 transition-colors'>
                Claim your handle to launch your artist profile
              </p>
            )}
          </div>

          {/* Form Card - simplified for minimalist design */}
          <div
            className={`${
              useMinimalistDesign
                ? 'bg-white dark:bg-black border-gray-100 dark:border-gray-900'
                : 'bg-white/80 dark:bg-white/5 backdrop-blur-sm border-gray-200/50 dark:border-white/10 shadow-xl'
            } border rounded-xl p-6 transition-colors`}
          >
            <OnboardingFormWrapper
              useProgressiveForm={featureFlags.progressiveOnboardingEnabled}
              useMinimalistDesign={useMinimalistDesign}
              useAppleStyle={false} // Disable Apple style for the card-based layout
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
