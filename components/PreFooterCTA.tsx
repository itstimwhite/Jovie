import React from 'react';
import Link from 'next/link';

export function PreFooterCTA() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="border-t border-white/10 dark:border-white/10 bg-white dark:bg-black"
    >
      <div className="mx-auto max-w-7xl px-4 py-10 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <p
          id="cta-heading"
          className="text-neutral-700 dark:text-white/80 text-lg md:text-xl font-semibold"
        >
          Launch your artist page in minutes. Convert visitors into fans.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex items-center rounded-xl px-4 py-2 font-medium bg-neutral-900 text-white dark:bg-white dark:text-black focus:outline-none focus-visible:ring"
          >
            Claim your handle →
          </Link>
        </div>
      </div>
    </section>
  );
}
