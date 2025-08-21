import { cn } from '@/lib/utils';

interface BackgroundPatternProps {
  variant?: 'grid' | 'dots' | 'gradient';
  className?: string;
}

export function BackgroundPattern({ variant = 'grid', className }: BackgroundPatternProps) {
  const patterns = {
    grid: 'bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]',
    dots: 'bg-[radial-gradient(rgba(0,0,0,0.1)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]',
    gradient: 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900',
  };

  return (
    <div 
      className={cn(
        'absolute inset-0',
        patterns[variant],
        className
      )}
      aria-hidden="true"
    />
  );
}