import { clsx } from 'clsx';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  height?: string;
  width?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export function LoadingSkeleton({
  className,
  lines = 1,
  height = 'h-4',
  width = 'w-full',
  rounded = 'sm',
}: LoadingSkeletonProps) {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  if (lines === 1) {
    return (
      <div
        className={clsx(
          'animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]',
          'bg-gray-200 dark:bg-gray-700',
          roundedClasses[rounded],
          height,
          width,
          className
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            'animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]',
            'bg-gray-200 dark:bg-gray-700',
            roundedClasses[rounded],
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
        className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]"
        aria-label="Loading artist profile image"
        role="img"
      />
      <div className="space-y-2">
        <div
          className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]"
          aria-label="Loading artist name"
          role="text"
        />
        <div
          className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]"
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
      className="h-12 w-full max-w-sm bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]"
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
          className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]"
          aria-label={`Loading social link ${index + 1}`}
          role="button"
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]" />
          <div className="space-y-1 flex-1">
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]" />
            <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
        </div>
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]" />
        <div className="flex justify-between">
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]" />
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4" aria-label="Loading list items" role="list">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md"
        >
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]" />
          <div className="space-y-1 flex-1">
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]" />
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 5,
  columns = 3,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
      {/* Header */}
      <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={`header-${index}`} className="flex-1 p-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 p-3">
              <div
                className={clsx(
                  'h-4 bg-gray-200 dark:bg-gray-700 rounded-sm animate-pulse motion-reduce:animate-[pulse_2s_ease-in-out_infinite]',
                  colIndex === 0 ? 'w-3/4' : 'w-full'
                )}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
