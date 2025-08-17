import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary';
}

export function NavLink({
  href,
  children,
  className,
  variant = 'default',
}: NavLinkProps) {
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2';

  const variantClasses = {
    default:
      'text-sm text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors',
    primary:
      'bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-white/90 focus-visible:ring-gray-500 dark:focus-visible:ring-white/50 px-3 py-1.5 text-sm hover:scale-105',
  };

  return (
    <Link
      href={href}
      className={cn(
        variant === 'default'
          ? variantClasses.default
          : `${baseClasses} ${variantClasses.primary}`,
        className
      )}
    >
      {children}
    </Link>
  );
}
