'use client';

import Link from 'next/link';
import { Container } from '@/components/site/Container';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Container>
        <div className="py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Start for free and upgrade when you&apos;re ready to remove
              branding
            </p>
          </div>

          <div className="mt-16 flow-root">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Free Plan */}
              <div className="relative rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="text-center">
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">
                    Free
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    Perfect for getting started
                  </p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-1">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      $0
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /month
                    </span>
                  </p>
                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                  >
                    <li className="flex gap-x-3">
                      <span className="text-green-600">✓</span>
                      Custom profile page
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-green-600">✓</span>
                      Link to all your music
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-green-600">✓</span>
                      Social media integration
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-green-600">✓</span>
                      Analytics tracking
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-green-600">✓</span>
                      <span className="text-gray-500">
                        Includes Jovie branding
                      </span>
                    </li>
                  </ul>
                  <div className="mt-8">
                    <Link
                      href="/sign-up"
                      className="block w-full rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                    >
                      Get started for free
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="relative rounded-2xl border border-indigo-200 bg-indigo-50 p-8 shadow-sm">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                    Most popular
                  </span>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold leading-8 text-indigo-600">
                    Pro
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    For serious artists
                  </p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-1">
                    <span className="text-5xl font-bold tracking-tight text-gray-900">
                      $5
                    </span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">
                      /month
                    </span>
                  </p>
                  <ul
                    role="list"
                    className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
                  >
                    <li className="flex gap-x-3">
                      <span className="text-green-600">✓</span>
                      Everything in Free
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-green-600">✓</span>
                      <strong>Remove Jovie branding</strong>
                    </li>
                    <li className="flex gap-x-3">
                      <span className="text-green-600">✓</span>
                      Priority support
                    </li>
                    <li className="flex gap-x-3 text-gray-400">
                      <span className="text-gray-400">🚀</span>
                      More features coming soon
                    </li>
                  </ul>
                  <div className="mt-8">
                    <button
                      onClick={() => {
                        fetch('/api/stripe/redirect', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ priceId: 'price_5BUCK_PRO' }),
                        })
                          .then((res) => res.json())
                          .then((data) => {
                            if (data.url) {
                              window.location.href = data.url;
                            }
                          })
                          .catch((err) => {
                            console.error('Checkout error:', err);
                          });
                      }}
                      className="block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Go Pro – $5/month
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm text-gray-500">
              All plans include unlimited updates and our 30-day money-back
              guarantee.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
