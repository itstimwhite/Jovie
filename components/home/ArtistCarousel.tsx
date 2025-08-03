'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui/OptimizedImage';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface Artist {
  id: string;
  handle: string;
  name: string;
  image_url: string | null;
  tagline: string | null;
}

interface ArtistCarouselProps {
  artists: Artist[];
}

export function ArtistCarousel({ artists }: ArtistCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % artists.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, artists.length]);

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % artists.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + artists.length) % artists.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!artists || artists.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Featured Artists
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Discover amazing music artists and their profiles
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative overflow-hidden rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel Track */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {artists.map((artist) => (
              <div key={artist.id} className="w-full flex-shrink-0 px-8 py-12">
                <Link
                  href={`/${artist.handle}`}
                  className="group block text-center transition-transform duration-300 hover:scale-105"
                >
                  <div className="mx-auto mb-6 h-32 w-32">
                    <OptimizedImage
                      src={artist.image_url}
                      alt={`${artist.name} - Music Artist`}
                      size="2xl"
                      shape="circle"
                      className="mx-auto"
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {artist.name}
                  </h3>

                  {artist.tagline && (
                    <p className="mt-2 text-gray-600 dark:text-gray-300 text-lg">
                      {artist.tagline}
                    </p>
                  )}

                  <div className="mt-4 inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium">
                    <span>View Profile</span>
                    <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Previous artist"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-gray-800 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Next artist"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {artists.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={clsx(
                  'h-2 w-2 rounded-full transition-all duration-300',
                  index === currentIndex
                    ? 'bg-indigo-600 dark:bg-indigo-400 w-6'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Indicator */}
          <div className="absolute top-4 right-4">
            <div
              className={clsx(
                'h-2 w-2 rounded-full transition-colors duration-300',
                isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              )}
            />
          </div>
        </div>

        {/* View All Artists Link */}
        <div className="mt-8 text-center">
          <Link
            href="/artists"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
          >
            <span>View All Artists</span>
            <ChevronRightIcon className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
