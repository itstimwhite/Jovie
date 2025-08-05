import { SiteHeader } from '@/components/organisms/SiteHeader.client';

// Force dynamic rendering for all legal pages
export const dynamic = 'force-dynamic';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
