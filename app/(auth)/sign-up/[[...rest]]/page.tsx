'use client';

import { ClerkLoaded, ClerkLoading, SignUp } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect_url') || '/dashboard';

  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0D0E12] transition-colors px-4">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <Logo size="lg" className="mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Create your account
          </h1>
          <p className="text-gray-600 dark:text-white/70">
            You’ll be redirected to continue setup.
          </p>
        </div>
        <ClerkLoading>
          <div className="text-center text-gray-600 dark:text-white/70">
            Loading account form...
          </div>
        </ClerkLoading>
        <ClerkLoaded>
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            redirectUrl={redirect}
            afterSignUpUrl={redirect}
          />
        </ClerkLoaded>
      </div>
    </div>
  );
}
