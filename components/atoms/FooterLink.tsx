import Link from 'next/link';

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  variant?: 'light' | 'dark';
  className?: string;
}

export function FooterLink({
  href,
  children,
  variant = 'dark',
  className = '',
}: FooterLinkProps) {
  const baseStyles = 'transition-colors';
  const variantStyles = {
    light:
      'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
    dark: 'text-white/60 hover:text-white',
  };

  return (
    <Link
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
