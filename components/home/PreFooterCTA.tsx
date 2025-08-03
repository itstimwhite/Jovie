import React from 'react';
import Link from 'next/link';

export function PreFooterCTA() {
  return (
    <section className="w-full bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Stop losing fans to ugly link pages.
        </h2>
        <p className="text-xl text-white/90 mb-10 leading-relaxed">
          Jovie&apos;s standardized design converts 3× better than customizable
          alternatives. Connect your Spotify, claim your link, start converting.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center justify-center rounded-full bg-white text-blue-700 hover:bg-gray-50 focus:outline-hidden focus:ring-2 focus:ring-white/20 px-8 py-3 text-lg font-semibold transition-all duration-200 shadow-xs"
        >
          Get Your jov.ie Link
        </Link>
      </div>
    </section>
  );
}
