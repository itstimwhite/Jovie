import { OnboardingForm } from '@/components/dashboard';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { motion } from 'framer-motion';

export default async function OnboardingPage() {
  const { userId } = await auth();
  if (!userId) {
    // Require auth for onboarding; preserve destination
    redirect('/sign-in?redirect_url=/onboarding');
  }
  // Read prefilled handle from query or cookie/session fallback later in the form
  // We cannot access searchParams directly here without defining them in the component signature,
  // so the client form will read from URL and sessionStorage.
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 px-6 py-12 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_70%)]" />
      <div className="relative z-10 w-full max-w-sm">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3 text-center text-4xl font-bold"
        >
          Claim your name.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 text-center text-lg text-gray-400"
        >
          Launch your artist profile in seconds.
        </motion.p>
        <OnboardingForm />
      </div>
    </div>
  );
}
