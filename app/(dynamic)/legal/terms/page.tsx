import { LegalContent } from '@/components/legal/LegalContent';

export default function TermsPage() {
  return (
    <LegalContent
      endpoint="/api/legal/terms"
      fallbackHtml="<p>Failed to load terms of service.</p>"
    />
  );
}
