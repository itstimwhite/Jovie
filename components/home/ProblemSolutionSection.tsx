'use client';

import Link from 'next/link';
import { track } from '@/lib/analytics';

export function ProblemSolutionSection() {
  const handleClick = () => {
    track('claim_handle_click', { section: 'solution' });
  };

  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="relative border-t border-white/10"
    >
      <div className="mx-auto max-w-5xl px-4 py-16 text-center">
        <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-wide text-white/60">
          Problem
        </span>
        <h2
          id="problem-heading"
          className="mt-4 text-4xl md:text-6xl font-bold tracking-tight text-balance"
        >
          Your bio link is a speed bump.
        </h2>
        <p className="mt-4 text-white/70 max-w-3xl mx-auto leading-relaxed">
          Every extra tap taxes attention. “Cute” layouts bleed streams,
          follows, and ticket sales.
        </p>

        <div className="mt-16 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <span className="mt-16 inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-wide text-white/60">
          Solution
        </span>
        <h3
          id="solution-heading"
          className="mt-4 text-3xl md:text-5xl font-bold tracking-tight"
        >
          Stop designing. Start converting.
        </h3>
        <p className="mt-4 text-white/70 max-w-3xl mx-auto leading-relaxed">
          Jovie ships a locked, elite artist page in seconds—built for streams
          and sales, not vibes. One link. One funnel. More plays, more pay.{' '}
          <span className="opacity-70">(Tour cues beta.)</span>
        </p>

        <div className="mt-10">
          <Link
            href="/onboarding"
            onClick={handleClick}
            className="btn btn-primary"
          >
            Claim your handle → Go live in 60s
          </Link>
        </div>
      </div>
    </section>
  );
}
