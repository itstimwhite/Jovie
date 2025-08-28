import { FooterLink } from '@/components/atoms/FooterLink';

interface FooterNavigationProps {
  variant?: 'light' | 'dark';
  className?: string;
  links?: Array<{
    href: string;
    label: string;
  }>;
}

const defaultLinks = [
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/terms', label: 'Terms' },
];

export function FooterNavigation({
  variant = 'dark',
  className = '',
  links = defaultLinks,
}: FooterNavigationProps) {
  const textSize = variant === 'light' ? 'text-sm' : 'text-xs';

  return (
    <nav className={`flex items-center gap-4 ${textSize} ${className}`}>
      {links.map((link, index) => (
        <FooterLink key={index} href={link.href} variant={variant}>
          {link.label}
        </FooterLink>
      ))}
    </nav>
  );
}
