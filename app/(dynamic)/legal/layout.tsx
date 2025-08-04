// Force dynamic rendering for all legal pages
export const dynamic = 'force-dynamic';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
