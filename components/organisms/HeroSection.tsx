'use client';

import type { ReactNode } from 'react';
import { Container } from '@/components/site/Container';
import { GradientText } from '@/components/atoms/GradientText';

export interface HeroSectionProps {
  /** Main headline text (will be large and prominent) */
  headline: ReactNode;
  /** Optional highlighted word(s) in the headline to apply gradient */
  highlightText?: string;
  /** Gradient variant for highlighted text */
  gradientVariant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'purple-cyan';
  /** Subtitle/description text */
  subtitle?: ReactNode;
  /** Optional emoji or icon to display above headline */
  icon?: ReactNode;
  /** Main content area (usually form or buttons) */
  children?: ReactNode;
  /** Supporting text below main content */
  supportingText?: ReactNode;
  /** Trust indicators or additional info */
  trustIndicators?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show background effects */
  showBackgroundEffects?: boolean;
}

export function HeroSection({
  headline,
  highlightText,
  gradientVariant = 'primary',
  subtitle,
  icon,
  children,
  supportingText,
  trustIndicators,
  className = '',
  showBackgroundEffects = true,
}: HeroSectionProps) {
  // Process headline to add gradient to highlighted text
  const processedHeadline =
    highlightText && typeof headline === 'string'
      ? headline.split(highlightText).reduce((acc, part, index, array) => {
          if (index === array.length - 1) {
            return [...acc, part];
          }
          return [
            ...acc,
            part,
            <GradientText key={index} variant={gradientVariant}>
              {highlightText}
            </GradientText>,
          ];
        }, [] as ReactNode[])
      : headline;

  return (
    <section
      className={`relative flex min-h-screen flex-col items-center justify-center px-6 py-20 md:py-24 ${className}`}
      role="banner"
      aria-labelledby="hero-headline"
    >
      <Container className="relative flex max-w-4xl flex-col items-center text-center">
        {/* Icon/Emoji */}
        {icon && (
          <div className="mb-8 text-6xl" role="img">
            {icon}
          </div>
        )}

        {/* Main headline */}
        <div className="mb-8 space-y-4">
          <h1
            id="hero-headline"
            className="text-4xl font-semibold tracking-[-0.03em] text-gray-900 dark:text-white sm:text-5xl lg:text-6xl leading-[1.1]"
            style={{ letterSpacing: '-0.03em' }}
          >
            {processedHeadline}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-white/70 font-normal leading-7 sm:text-xl sm:leading-8 lg:text-2xl lg:leading-9"
              role="doc-subtitle"
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Main content area */}
        {children && (
          <div className="w-full max-w-xl" role="main">
            <div className="relative group">
              {/* Background glow effect */}
              {showBackgroundEffects && (
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              )}

              {/* Content card */}
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 p-8">
                {children}
              </div>
            </div>

            {/* Supporting text under content */}
            {supportingText && (
              <div className="mt-8 text-sm text-gray-500 dark:text-white/50 text-center leading-6">
                {supportingText}
              </div>
            )}
          </div>
        )}

        {/* Trust indicators */}
        {trustIndicators && (
          <div className="mt-16 flex flex-col items-center space-y-4">
            {trustIndicators}
          </div>
        )}
      </Container>
    </section>
  );
}
