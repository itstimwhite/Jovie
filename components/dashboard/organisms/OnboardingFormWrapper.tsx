'use client';

import { AppleStyleOnboardingForm } from './AppleStyleOnboardingForm';
import { MinimalistOnboardingForm } from './MinimalistOnboardingForm';
import { OnboardingForm } from './OnboardingForm';
import { ProgressiveOnboardingForm } from './ProgressiveOnboardingForm';

interface OnboardingFormWrapperProps {
  useProgressiveForm: boolean;
  useMinimalistDesign?: boolean;
  useAppleStyle?: boolean;
}

export function OnboardingFormWrapper({
  useProgressiveForm,
  useMinimalistDesign = false,
  useAppleStyle = true, // Default to true to enable the new Apple-style design
}: OnboardingFormWrapperProps) {
  // If Apple-style design is enabled, use it as the highest priority
  if (useAppleStyle) {
    return <AppleStyleOnboardingForm />;
  }

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
