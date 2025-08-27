'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();

  // Check for redirect_url parameter (e.g., from protected pages like /onboarding)
  const redirectUrl = searchParams?.get('redirect_url') ?? null;

  // Check for artistId parameter (legacy flow)
  const artistId = searchParams?.get('artistId') ?? null;

  // Determine destination: prioritize redirect_url, then artistId flow, then default to dashboard
  const destination =
    redirectUrl ||
    (artistId ? `/dashboard?artistId=${artistId}` : '/dashboard');

  return (
    <div className='flex min-h-screen items-center justify-center bg-white dark:bg-[#0D0E12] transition-colors'>
      <SignIn
        redirectUrl={destination}
        afterSignInUrl={destination}
        afterSignUpUrl={destination}
      />
    </div>
  );
}
