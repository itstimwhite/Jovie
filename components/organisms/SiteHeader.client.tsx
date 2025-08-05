'use client';

import { usePathname } from 'next/navigation';
import { Container } from '@/components/site/Container';
import { LogoLink } from '@/components/atoms/LogoLink';
import { AuthActions } from '@/components/molecules/AuthActions';
import { ThemeToggle } from '@/components/site/ThemeToggle';
import { useSectionTheme } from '@/hooks/useSectionTheme';
import { useTheme } from '@/context/ThemeContext';
import { isLandingPage } from '@/lib/pageMetadata';
import { useEffect, useState } from 'react';

/**
 * Adaptive sticky header that:
 * - On landing pages: automatically switches theme based on visible section
 * - On other pages: respects global user theme choice
 * - Defaults to dark theme
 * - Maintains 4.5:1 contrast ratio
 * - SSR-friendly with no CLS
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { theme: globalTheme } = useTheme();
  const sectionTheme = useSectionTheme('dark');
  const [mounted, setMounted] = useState(false);

  // Determine if this is a landing page
  const isLanding = isLandingPage(pathname);

  // Use section theme for landing pages, global theme for others
  const effectiveTheme = isLanding ? sectionTheme : globalTheme;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/10 dark:border-white/10 bg-neutral-900 text-white backdrop-blur-sm">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <LogoLink />
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <AuthActions />
            </div>
          </div>
        </Container>
      </header>
    );
  }

  // Theme-based styles
  const isDark = effectiveTheme === 'dark';
  const headerStyles = isDark
    ? 'bg-neutral-900 text-white border-white/10'
    : 'bg-white text-neutral-900 border-gray-200 shadow-md';

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-sm transition-all duration-200 ease-in-out ${headerStyles}`}
      data-theme={effectiveTheme}
      role="banner"
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <LogoLink />
          </div>

          <div className="flex items-center space-x-4">
            {/* Only show theme toggle on non-landing pages */}
            {!isLanding && <ThemeToggle />}
            <AuthActions />
          </div>
        </div>
      </Container>
    </header>
  );
}
