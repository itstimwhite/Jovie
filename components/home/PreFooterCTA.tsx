import React from 'react';
import Link from 'next/link';

export function PreFooterCTA() {
  return (
    <section className="w-full bg-black py-24 sm:py-32 px-4 my-24 sm:my-32">
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
          className="inline-flex items-center justify-center rounded-full bg-white text-black border-2 border-pink-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 px-8 py-3 text-lg font-semibold transition-all duration-200 shadow-xs"
        >
          Get Your jov.ie Link
        </Link>
      </div>
    </section>
  );
}
