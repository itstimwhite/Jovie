import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  BoltIcon,
  SparklesIcon,
  MagnifyingGlassCircleIcon,
  LinkIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

export type Feature = {
  slug: string;
  title: string;
  blurb: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorVar: string; // e.g., '--accent-conv'
};

export const FEATURES: Feature[] = [
  {
    slug: 'smart-conversions',
    title: 'Smart Conversions',
    blurb: 'AI-optimized CTAs and layouts that adapt automatically.',
    href: '/features/smart-conversions',
    Icon: ArrowTrendingUpIcon,
    colorVar: '--accent-conv',
  },
  {
    slug: 'real-time-analytics',
    title: 'Real-Time Analytics',
    blurb: 'Instant, reliable insights aligned with your ad platforms.',
    href: '/features/analytics',
    Icon: ChartBarIcon,
    colorVar: '--accent-analytics',
  },
  {
    slug: 'blazing-fast',
    title: 'Blazing Fast',
    blurb: 'Sub-100ms loads and 99.99% uptime—fans never wait.',
    href: '/features/performance',
    Icon: BoltIcon,
    colorVar: '--accent-speed',
  },
  {
    slug: 'always-beautiful',
    title: 'Always Beautiful',
    blurb: "Instantly polished profiles; you can't make it ugly.",
    href: '/features/design',
    Icon: SparklesIcon,
    colorVar: '--accent-beauty',
  },
  {
    slug: 'seo-boost',
    title: 'SEO Boost',
    blurb: 'Structured, fast, and discoverable by default.',
    href: '/features/seo',
    Icon: MagnifyingGlassCircleIcon,
    colorVar: '--accent-seo',
  },
  {
    slug: 'deep-links',
    title: 'Deep Links',
    blurb: 'Send fans straight to /listen, /tip, or /subscribe.',
    href: '/features/deep-links',
    Icon: LinkIcon,
    colorVar: '--accent-links',
  },
  {
    slug: 'pro-growth-tools',
    title: 'Pro Growth Tools',
    blurb: 'Pixels, remarketing, and integrations when you scale.',
    href: '/features/pro',
    Icon: RocketLaunchIcon,
    colorVar: '--accent-pro',
  },
];
