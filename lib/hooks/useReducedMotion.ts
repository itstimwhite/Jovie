'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * This is used to disable animations for users who have requested reduced motion
 * in their operating system settings.
 *
 * @returns {boolean} True if the user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  // Default to false (animations enabled) for SSR
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if the browser supports matchMedia
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    // Create a media query that matches if the user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Set the initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create a handler for changes to the media query
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add the event listener
    mediaQuery.addEventListener('change', handleChange);

    // Clean up the event listener
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}
