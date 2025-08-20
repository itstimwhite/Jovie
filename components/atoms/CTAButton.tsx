'use client';

import Link from 'next/link';

export interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  external?: boolean;
}

export function CTAButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  external = false,
}: CTAButtonProps) {
  const baseClassName =
    'inline-flex items-center font-medium focus:outline-none focus-visible:ring transition-all duration-200';

  const variantClasses = {
    primary:
      'bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90',
    secondary:
      'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl',
    outline:
      'border border-current text-current hover:bg-current hover:text-white dark:hover:text-black',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-xl',
    lg: 'px-8 py-3 text-lg rounded-lg',
  };

  const finalClassName = `${baseClassName} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={finalClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={finalClassName}>
      {children}
    </Link>
  );
}
