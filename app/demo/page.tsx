import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeHero } from '@/components/home/HomeHero';
import { APP_NAME, APP_URL } from '@/constants/app';

export const revalidate = 1800;

export async function generateMetadata(): Promise<Metadata> {
  const title = `${APP_NAME} Demo`;
  const description = `${APP_NAME} is a single link that turns followers into listeners. Built for music artists. This page showcases the current MVP.`;
  return {
    title,
    description,
    metadataBase: new URL(APP_URL),
    alternates: { canonical: `${APP_URL}/demo` },
    openGraph: {
      type: 'website',
      url: `${APP_URL}/demo`,
      title,
      description,
      images: [{ url: '/og/default.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og/default.png'],
    },
  };
}

export default function DemoPage() {
  return (
    <div className="relative min-h-screen bg-white text-gray-900 dark:bg-[#0D0E12] dark:text-white">
      {/* Keep the exact hero header; override subtitle to avoid redundant '60 seconds' copy */}
      <HomeHero subtitle="One link that turns followers into listeners." />

      {/* Mission */}
      <section className="py-20 border-t border-gray-200 dark:border-white/5">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-semibold mb-4">Our mission</h2>
          <p className="text-gray-600 dark:text-white/70 leading-relaxed">
            Turn attention into listening. One smart link built for music —
            routes fans to your tracks, socials, and merch without design or
            busywork.
          </p>
        </div>
      </section>

      {/* MVP: What works today */}
      <section className="py-20 border-t border-gray-200 dark:border-white/5">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-semibold mb-6">What you can do today</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-disc pl-5">
            <li className="text-gray-700 dark:text-white/80">
              Claim your @handle
            </li>
            <li className="text-gray-700 dark:text-white/80">
              Go live with an artist profile
            </li>
            <li className="text-gray-700 dark:text-white/80">
              Add streaming and social links
            </li>
            <li className="text-gray-700 dark:text-white/80">
              Basic pricing and waitlist
            </li>
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 border-t border-gray-200 dark:border-white/5">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-semibold mb-6">How it works</h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <li className="rounded-xl border border-gray-200 dark:border-white/10 p-6">
              <div className="text-sm text-gray-500 dark:text-white/50 mb-1">
                Step 1
              </div>
              <div className="font-medium mb-2">Claim your @handle</div>
              <p className="text-gray-600 dark:text-white/70">
                Choose the name fans know you by.
              </p>
            </li>
            <li className="rounded-xl border border-gray-200 dark:border-white/10 p-6">
              <div className="text-sm text-gray-500 dark:text-white/50 mb-1">
                Step 2
              </div>
              <div className="font-medium mb-2">Create your account</div>
              <p className="text-gray-600 dark:text-white/70">
                Save and manage your profile.
              </p>
            </li>
            <li className="rounded-xl border border-gray-200 dark:border-white/10 p-6">
              <div className="text-sm text-gray-500 dark:text-white/50 mb-1">
                Step 3
              </div>
              <div className="font-medium mb-2">Add links and publish</div>
              <p className="text-gray-600 dark:text-white/70">
                Share one link everywhere.
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* Live demo links — no CTA needed while dogfooding */}
      <section className="py-20 border-t border-gray-200 dark:border-white/5">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-semibold mb-6">See it live</h2>
          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-gray-600 dark:text-white/70">
              Example profile using today’s MVP:
            </p>
            <Link
              href="/tim"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              /tim →
            </Link>
          </div>
        </div>
      </section>

      {/* Roadmap teaser */}
      <section className="py-20 border-t border-gray-200 dark:border-white/5">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-2xl font-semibold mb-4">What’s next</h2>
          <p className="text-gray-600 dark:text-white/70 mb-4">
            Sharper performance. Smarter routing. Better promotion.
          </p>
          <p className="text-gray-600 dark:text-white/70">
            We’re dogfooding openly — feedback welcome.
          </p>
        </div>
      </section>
    </div>
  );
}
