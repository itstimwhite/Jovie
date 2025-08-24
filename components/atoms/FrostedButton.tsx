import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * FrostedButton Component
 *
 * A button component with a frosted glass effect.
 * Follows standardized button styling guidelines:
 * - Uses the global focus-ring utility for consistent focus states
 * - Maintains consistent hover/active states across variants
 * - Ensures proper hit target sizes for accessibility
 * - Supports light/dark mode with appropriate contrast
 */
interface FrostedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'default' | 'circle' | 'square';
  children: React.ReactNode;
}

const sizeClasses = {
  sm: 'h-8 w-8 p-1.5',
  md: 'h-10 w-10 p-2',
  lg: 'h-12 w-12 p-3',
};

const variantClasses = {
  default:
    'bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20',
  ghost: 'bg-white/30 dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10',
  outline:
    'bg-transparent border border-gray-200/30 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/5',
};

const shapeClasses = {
  default: 'rounded-lg',
  circle: 'rounded-full',
  square: 'rounded-none',
};

export const FrostedButton = forwardRef<HTMLButtonElement, FrostedButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      shape = 'default',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          'backdrop-blur-sm border border-gray-200/30 dark:border-white/10 flex items-center justify-center transition-colors cursor-pointer focus-ring active:scale-[0.98]',
          sizeClasses[size],
          variantClasses[variant],
          shapeClasses[shape],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FrostedButton.displayName = 'FrostedButton';
