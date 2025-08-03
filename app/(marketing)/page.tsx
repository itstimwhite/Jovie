import { Suspense } from 'react';
import { HomeHero } from '@/components/home/HomeHero';
import { FeaturedArtists } from '@/components/home/FeaturedArtists';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
      </div>

      {/* Hero Section */}
      <HomeHero />

      {/* Featured Artists Carousel */}
      <Suspense
        fallback={
          <div className="py-16 text-center text-white">
            Loading featured artists...
          </div>
        }
      >
        <FeaturedArtists />
      </Suspense>
    </div>
  );
}
