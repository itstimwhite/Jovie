import { CheckBadgeIcon } from '@heroicons/react/24/solid';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function VerifiedBadge({
  size = 'md',
  className = '',
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-blue-500 text-white ${className}`}
      title="Verified Artist"
      role="img"
      aria-label="Verified Artist"
    >
      <CheckBadgeIcon className={sizeClasses[size]} />
    </div>
  );
}
