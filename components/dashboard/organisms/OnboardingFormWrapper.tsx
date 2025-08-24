'use client';

import { OnboardingForm } from './OnboardingForm';
import { ProgressiveOnboardingForm } from './ProgressiveOnboardingForm';
import { MinimalistOnboardingForm } from './MinimalistOnboardingForm';

interface OnboardingFormWrapperProps {
  useProgressiveForm: boolean;
  useMinimalistDesign?: boolean;
}

export function OnboardingFormWrapper({
  useProgressiveForm,
  useMinimalistDesign = false,
}: OnboardingFormWrapperProps) {
  // If minimalist design is enabled, use it regardless of progressive form setting
  if (useMinimalistDesign) {
    return <MinimalistOnboardingForm />;
  }

  // Otherwise use the existing logic
  if (useProgressiveForm) {
    return <ProgressiveOnboardingForm />;
  }

  return <OnboardingForm />;
}
