import { getCopyrightText } from '@/constants/app';

interface CopyrightProps {
  className?: string;
  variant?: 'light' | 'dark';
}

export function Copyright({
  className = '',
  variant = 'dark',
}: CopyrightProps) {
  const baseStyles = 'text-sm';
  const variantStyles = {
    light: 'text-gray-500 dark:text-gray-400',
    dark: 'text-white/70',
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {getCopyrightText()}
    </div>
  );
}
