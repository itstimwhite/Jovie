'use client';
import Link from 'next/link';

export default function TipPromo() {
  if (process.env.NEXT_PUBLIC_FEATURE_TIPS !== 'true') return null;

  return (
    <section className="bg-zinc-900 text-white py-20">
      <div className="mx-auto max-w-4xl px-6 text-center space-y-8">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Tip, <span className="text-indigo-400">instantly.</span>
        </h2>
        <p className="text-lg sm:text-xl leading-relaxed">
          Fans tap once, you get paid. No sign-ups, no fees,{' '}
          <br className="hidden sm:inline" />
          just pure support—directly in Venmo.
        </p>
        <Link
          href="/tim/tip"
          className="inline-block rounded-lg bg-indigo-600 px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-indigo-700"
        >
          See it live
        </Link>
      </div>
    </section>
  );
}
