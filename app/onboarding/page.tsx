import { OnboardingForm } from '@/components/dashboard';
import { Container } from '@/components/site/Container';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { APP_NAME } from '@/constants/app';

export default async function OnboardingPage() {
  // Read prefilled handle from query or cookie/session fallback later in the form
  // We cannot access searchParams directly here without defining them in the component signature,
  // so the client form will read from URL and sessionStorage.
  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0E12] transition-colors">
      {/* Subtle grid background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Gradient orbs - more subtle like Linear */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <Container className="relative z-10 flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors">
              Welcome to {APP_NAME}
            </h1>
            <p className="text-gray-600 dark:text-white/70 text-lg transition-colors">
              Claim your jov.ie handle to launch your artist profile
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-xl p-6 shadow-xl transition-colors">
            <OnboardingForm />
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-white/50 transition-colors">
              Your profile will be live at jov.ie/yourhandle
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
