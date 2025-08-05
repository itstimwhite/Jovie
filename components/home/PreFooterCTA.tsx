import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function PreFooterCTA() {
  return (
    <section className="relative py-24 sm:py-32">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Ready to Start
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
            Ready to turn fans
            <br />
            <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text">
              into streams?
            </span>
          </h2>

          <p className="mt-8 text-xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
            Create your professional music profile in 60 seconds.
            <br />
            <span className="text-white/50">Start converting fans today.</span>
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              as={Link}
              href="/onboarding"
              size="lg"
              variant="primary"
              className="text-lg px-8 py-4"
            >
              Create Your Profile
            </Button>

            <div className="flex items-center gap-2 text-white/60">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>60-second setup</span>
            </div>
          </div>

          <div className="mt-8 text-sm text-white/50">
            <p>Join 10,000+ artists already using Jovie</p>
          </div>
        </div>
      </div>
    </section>
  );
}
