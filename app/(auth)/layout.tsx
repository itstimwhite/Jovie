import { ClerkAnalytics } from '@/components/ClerkAnalytics';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ClerkAnalytics />
    </>
  );
}
