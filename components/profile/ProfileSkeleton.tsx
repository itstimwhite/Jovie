export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Profile Shell Skeleton */}
        <div className="bg-white/60 dark:bg-white/5 backdrop-blur-lg border border-gray-200/30 dark:border-white/10 rounded-3xl p-8 shadow-xl shadow-black/5 animate-pulse">
          {/* Avatar */}
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
            {/* Name */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2 w-32 mx-auto"></div>
            {/* Bio */}
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mx-auto"></div>
          </div>

          {/* Action Button */}
          <div className="mb-6">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
