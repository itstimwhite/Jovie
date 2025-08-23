'use client';

import { OnboardingForm } from './OnboardingForm';
import { ProgressiveOnboardingForm } from './ProgressiveOnboardingForm';

interface OnboardingFormWrapperProps {
  useProgressiveForm: boolean;
}

export function OnboardingFormWrapper({
  useProgressiveForm,
}: OnboardingFormWrapperProps) {
  if (useProgressiveForm) {
    return <ProgressiveOnboardingForm />;
  }

  return <OnboardingForm />;
}
