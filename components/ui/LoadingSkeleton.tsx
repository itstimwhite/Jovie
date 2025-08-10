import clsx from 'clsx';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
}

export function LoadingSkeleton({
  className,
  lines = 1,
  height = 'h-4',
  width = 'w-full',
}: LoadingSkeletonProps) {
  if (lines === 1) {
    return (
      <div
        className={clsx(
          'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-sm',
          height,
          width,
          className
        )}
      />
    );
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            'animate-pulse bg-gray-200 dark:bg-gray-700 rounded-sm',
            height,
            index === lines - 1 ? 'w-3/4' : width,
            className
          )}
        />
      ))}
    </div>
  );
}

// Specific skeleton components for common use cases
export function ProfileSkeleton() {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div
        className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
        aria-label="Loading artist profile image"
        role="img"
      />
      <div className="space-y-2">
        <div
          className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse"
          aria-label="Loading artist name"
          role="text"
        />
        <div
          className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse"
          aria-label="Loading artist tagline"
          role="text"
        />
      </div>
    </div>
  );
}

export function ButtonSkeleton() {
  return (
    <div
      className="h-12 w-full max-w-sm bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
      aria-label="Loading action button"
      role="button"
    />
  );
}

export function SocialBarSkeleton() {
  return (
    <div
      className="flex flex-wrap justify-center gap-4"
      aria-label="Loading social media links"
      role="navigation"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
          aria-label={`Loading social link ${index + 1}`}
          role="button"
        />
      ))}
    </div>
  );
}
