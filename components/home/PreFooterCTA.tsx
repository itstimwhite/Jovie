import React from 'react';
import Link from 'next/link';

export function PreFooterCTA() {
  return (
    <section className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          <span className="text-indigo-100">#</span> Stop losing fans to ugly
          link pages.
        </h2>
        <p className="text-lg text-indigo-100 mb-8">
          Jovie&apos;s standardized design converts 3x better than customizable
          alternatives. Connect your Spotify, claim your link, start converting.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-indigo-700 hover:bg-indigo-50 focus:ring-indigo-500 px-8 py-4 text-lg font-semibold shadow-lg"
        >
          Get Your jov.ie Link Now
        </Link>
      </div>
    </section>
  );
}
