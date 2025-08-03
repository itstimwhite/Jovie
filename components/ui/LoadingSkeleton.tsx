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
          'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
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
            'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
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
      <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function ButtonSkeleton() {
  return (
    <div className="h-12 w-full max-w-sm bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
  );
}

export function SocialBarSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
        />
      ))}
    </div>
  );
}
