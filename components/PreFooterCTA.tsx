// Legacy component - use CTASection from organisms instead
import { CTASection } from '@/components/organisms/CTASection';

export function PreFooterCTA() {
  return (
    <CTASection
      title="Launch your artist page in minutes. Convert visitors into fans."
      buttonText="Claim your handle →"
      buttonHref="/sign-up"
      variant="primary"
    />
  );
}
