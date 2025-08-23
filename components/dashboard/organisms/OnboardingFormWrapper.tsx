'use client';

import { OnboardingForm } from './OnboardingForm';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';

interface OnboardingFormWrapperProps {
  /**
   * Whether the form is in a loading state
   */
  isLoading?: boolean;
}

/**
 * A wrapper component for the OnboardingForm that handles loading states
 * and provides a consistent UI container
 */
export function OnboardingFormWrapper({
  isLoading = false,
}: OnboardingFormWrapperProps) {
  return (
    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-xl p-6 shadow-xl transition-colors">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading onboarding form...
          </p>
        </div>
      ) : (
        <OnboardingForm />
      )}
    </div>
  );
}
