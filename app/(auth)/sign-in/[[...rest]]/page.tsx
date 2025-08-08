'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const artistId = searchParams.get('artistId');
  const destination = `/dashboard${artistId ? `?artistId=${artistId}` : ''}`;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0D0E12] transition-colors">
      <SignIn
        redirectUrl={destination}
        afterSignInUrl={destination}
        afterSignUpUrl={destination}
      />
    </div>
  );
}
