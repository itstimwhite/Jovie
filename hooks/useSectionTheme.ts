'use client';

import { useEffect, useState, useCallback } from 'react';

/**
 * Custom hook to detect the theme of the currently visible section
 * Uses IntersectionObserver to track sections with data-theme attributes
 * Debounced to 50ms for smooth performance
 */
export function useSectionTheme(defaultTheme: 'light' | 'dark' = 'dark') {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(defaultTheme);

  // Debounce function
  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  }, []);

  // Debounced theme setter
  const debouncedSetTheme = useCallback(
    debounce((theme: 'light' | 'dark') => {
      setCurrentTheme(theme);
    }, 50),
    [debounce]
  );

  useEffect(() => {
    // Get all sections with data-theme attribute
    const sections = document.querySelectorAll('[data-theme]');
    
    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio that's actually visible
        const visibleEntry = entries
          .filter(entry => entry.isIntersecting && entry.intersectionRatio > 0)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          const theme = visibleEntry.target.getAttribute('data-theme') as 'light' | 'dark';
          if (theme && (theme === 'light' || theme === 'dark')) {
            debouncedSetTheme(theme);
          }
        }
      },
      {
        // Use viewport as root
        root: null,
        // Trigger when section tops the viewport
        rootMargin: '-50px 0px -50px 0px',
        // Multiple thresholds for better detection
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
      }
    );

    // Observe all sections
    sections.forEach(section => observer.observe(section));

    // Initial theme detection
    const firstVisibleSection = Array.from(sections).find(section => {
      const rect = section.getBoundingClientRect();
      return rect.top <= 100 && rect.bottom >= 0;
    });

    if (firstVisibleSection) {
      const theme = firstVisibleSection.getAttribute('data-theme') as 'light' | 'dark';
      if (theme && (theme === 'light' || theme === 'dark')) {
        setCurrentTheme(theme);
      }
    }

    return () => {
      observer.disconnect();
    };
  }, [debouncedSetTheme]);

  return currentTheme;
}