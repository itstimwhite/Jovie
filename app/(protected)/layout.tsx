import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SessionWatch } from '@/lib/auth/session-watch';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // If not authenticated, redirect to sign-in with returnTo
  if (!userId) {
    const currentPath = new URL(
      // @ts-expect-error - headers() is available in server components
      new Headers(headers()).get('x-url') || '/',
      'http://localhost'
    ).pathname;
    
    redirect(`/sign-in?returnTo=${encodeURIComponent(currentPath)}`);
  }

  return (
    <>
      {/* Client-side session watcher */}
      <SessionWatch />
      {children}
    </>
  );
}

