import { LegalContent } from '@/components/legal/LegalContent';

export default function PrivacyPage() {
  return (
    <LegalContent
      endpoint="/api/legal/privacy"
      fallbackHtml="<p>Failed to load privacy policy.</p>"
    />
  );
}
