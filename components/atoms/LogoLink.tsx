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
      className={`flex items-center space-x-2 ${className || ''}`}
    >
      <Logo size={logoSize} />
    </Link>
  );
}
