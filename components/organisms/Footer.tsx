import { Copyright } from '@/components/atoms/Copyright';
import { FooterBranding } from '@/components/molecules/FooterBranding';
import { FooterNavigation } from '@/components/molecules/FooterNavigation';
import { ThemeToggle } from '@/components/site/ThemeToggle';

export interface FooterProps {
  variant?: 'marketing' | 'profile' | 'minimal';
  artistHandle?: string;
  hideBranding?: boolean;
  artistSettings?: {
    hide_branding?: boolean;
  };
  showThemeToggle?: boolean;
  className?: string;
  links?: Array<{
    href: string;
    label: string;
  }>;
}

export function Footer({
  variant = 'marketing',
  artistHandle,
  hideBranding = false,
  artistSettings,
  showThemeToggle = false,
  className = '',
  links,
}: FooterProps) {
  // Use user's setting if available, otherwise fall back to hideBranding prop
  const shouldHideBranding = artistSettings?.hide_branding ?? hideBranding;

  // Profile footer logic - hide if branding should be hidden
  if (variant === 'profile' && shouldHideBranding) {
    return null;
  }

  // Variant-specific configurations
  const variantConfigs = {
    marketing: {
      containerClass: 'bg-neutral-950 text-white dark:bg-black',
      contentClass:
        'mx-auto max-w-7xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3',
      colorVariant: 'dark' as const,
      showBranding: false,
      layout: 'horizontal' as const,
    },
    profile: {
      containerClass: 'relative mt-6 pt-4',
      contentClass: '',
      colorVariant: 'light' as const,
      showBranding: true,
      layout: 'vertical' as const,
    },
    minimal: {
      containerClass:
        'border-t border-gray-200/50 dark:border-white/10 bg-white dark:bg-gray-900',
      contentClass:
        'flex flex-col md:flex-row items-center justify-between gap-6 py-8 md:h-16 md:py-0 w-full',
      colorVariant: 'light' as const,
      showBranding: false,
      layout: 'horizontal' as const,
    },
  };

  const config = variantConfigs[variant];

  // Profile footer has special positioning for privacy link
  if (variant === 'profile') {
    return (
      <footer className={`${config.containerClass} ${className}`}>
        <div className='flex flex-col items-center justify-center space-y-1.5'>
          <FooterBranding
            artistHandle={artistHandle}
            variant={config.colorVariant}
          />

          {/* Mobile privacy link */}
          <div className='mt-3 pt-3 border-t border-black/5 dark:border-white/10 w-full'>
            <div className='text-center md:hidden'>
              <FooterNavigation
                variant={config.colorVariant}
                links={[{ href: '/legal/privacy', label: 'Privacy' }]}
              />
            </div>
          </div>
        </div>

        {/* Desktop privacy link - positioned in bottom left corner */}
        <div className='hidden md:block fixed bottom-4 left-4 z-10'>
          <FooterNavigation
            variant={config.colorVariant}
            links={[{ href: '/legal/privacy', label: 'Privacy' }]}
          />
        </div>
      </footer>
    );
  }

  // Horizontal layout for marketing and minimal variants
  return (
    <footer className={`${config.containerClass} ${className}`}>
      <div className={config.contentClass}>
        {config.layout === 'horizontal' && (
          <>
            <div className='flex flex-col items-center md:items-start space-y-2'>
              <Copyright variant={config.colorVariant} />
              {variant === 'minimal' && (
                <p className='text-xs text-gray-400 dark:text-gray-500'>
                  Made for musicians, by musicians
                </p>
              )}
            </div>

            <div className='flex items-center gap-4'>
              <FooterNavigation variant={config.colorVariant} links={links} />
              {showThemeToggle && (
                <div className='flex items-center'>
                  <ThemeToggle />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </footer>
  );
}
