import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

interface LogoLinkProps {
  href?: string;
  className?: string;
  logoSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function LogoLink({
  href = '/',
  className,
  logoSize = 'sm',
}: LogoLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center space-x-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500 rounded-sm transition-all ${className || ''}`}
      aria-label="Jovie homepage"
    >
      <Logo size={logoSize} />
    </Link>
  );
}
