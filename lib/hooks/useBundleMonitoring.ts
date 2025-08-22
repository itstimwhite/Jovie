'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPagePerformance, trackBundleLoad } from '@/lib/analytics';

export function useBundleMonitoring() {
  const pathname = usePathname();

  useEffect(() => {
    // Track Core Web Vitals
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      const vitalsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const entryName = entry.name || entry.entryType;
          
          // Track different performance metrics
          if (entryName === 'largest-contentful-paint') {
            trackPagePerformance(pathname, { lcp: entry.startTime });
          }
          
          if (entryName === 'first-input-delay') {
            trackPagePerformance(pathname, { fid: entry.processingStart - entry.startTime });
          }
          
          if (entryName === 'cumulative-layout-shift') {
            trackPagePerformance(pathname, { cls: (entry as any).value });
          }
        }
      });

      try {
        vitalsObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported for some entry types:', error);
      }

      // Track navigation timing
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0];
        const ttfb = navigation.responseStart - navigation.fetchStart;
        trackPagePerformance(pathname, { ttfb });
      }

      // Track resource loading times for chunks
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          
          // Track Next.js chunks specifically
          if (resource.name.includes('/_next/static/chunks/') && resource.name.endsWith('.js')) {
            const chunkName = resource.name.split('/').pop()?.replace('.js', '') || 'unknown';
            const loadTime = resource.responseEnd - resource.fetchStart;
            
            trackBundleLoad(chunkName, loadTime, pathname);
          }
        }
      });

      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
      } catch (error) {
        console.warn('PerformanceObserver not supported for resource timing:', error);
      }

      return () => {
        vitalsObserver.disconnect();
        resourceObserver.disconnect();
      };
    }
  }, [pathname]);
}