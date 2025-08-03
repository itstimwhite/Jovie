import React from 'react';
import Link from 'next/link';

export function PreFooterCTA() {
  return (
    <section className="relative py-32 bg-[#0D0E12] border-t border-white/5">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-purple-500/5" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Glass morphism container */}
        <div className="relative">
          {/* Glow effect behind the card */}
          <div className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-30" />

          {/* Main CTA card */}
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 sm:p-16">
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white/80">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Join 10,000+ artists</span>
              </div>

              {/* Headline with Linear typography */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-tight">
                Ready to connect
                <br />
                <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text">
                  your music?
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-xl text-white/70 font-light leading-relaxed max-w-2xl mx-auto">
                Create your professional music profile in under 90 seconds.
                <br />
                <span className="text-white/50">
                  No design skills required.
                </span>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-white/20"
                >
                  <span>Get Your jov.ie Link</span>
                  <svg
                    className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                <Link
                  href="/tim"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
                >
                  View Example
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center justify-center space-x-8 pt-8 text-sm text-white/40">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Free forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>90-second setup</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No credit card</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
