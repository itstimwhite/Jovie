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
  aiPowered?: boolean; // Flag for AI-powered tag
};

export const FEATURES: Feature[] = [
  {
    slug: 'smart-conversions',
    title: 'Smart Conversions',
    blurb: 'AI-optimized CTAs and layouts that adapt in real time.',
    href: '/features/smart-conversions',
    Icon: ArrowTrendingUpIcon,
    colorVar: '--accent-conv',
    aiPowered: true,
  },
  {
    slug: 'real-time-analytics',
    title: 'Real-Time Analytics',
    blurb: 'Instant insights, always aligned with your ad platforms.',
    href: '/features/analytics',
    Icon: ChartBarIcon,
    colorVar: '--accent-analytics',
  },
  {
    slug: 'blazing-fast',
    title: 'Blazing Fast',
    blurb: 'Sub-100ms loads. 99.99% uptime. Fans never wait.',
    href: '/features/performance',
    Icon: BoltIcon,
    colorVar: '--accent-speed',
  },
  {
    slug: 'pixel-perfect-by-default',
    title: 'Pixel-Perfect by Default',
    blurb: "Profiles auto-polished—you can't make them ugly.",
    href: '/features/design',
    Icon: SparklesIcon,
    colorVar: '--accent-beauty',
  },
  {
    slug: 'seo-boost',
    title: 'SEO Boost',
    blurb: 'Structured, discoverable, and lightning-fast by design.',
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
    slug: 'pixels-remarketing',
    title: 'Pixels & Remarketing',
    blurb: 'Growth integrations that scale with you.',
    href: '/features/pro',
    Icon: RocketLaunchIcon,
    colorVar: '--accent-pro',
  },
];
