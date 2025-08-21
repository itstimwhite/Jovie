export interface FeatureCardProps {
  /** Feature title */
  title: string;
  /** Feature description */
  description: string;
  /** Optional metric or badge text */
  metric?: string;
  /** Icon element to display */
  icon: React.ReactNode;
  /** Color accent for the icon */
  accent?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  /** Additional CSS classes */
  className?: string;
  /** Whether to show hover effects */
  interactive?: boolean;
}

export function FeatureCard({
  title,
  description,
  metric,
  icon,
  accent = 'blue',
  className = '',
  interactive = true,
}: FeatureCardProps) {
  const accentClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    gray: 'from-gray-500 to-gray-600',
  };

  return (
    <div className={`relative ${interactive ? 'group' : ''} ${className}`}>
      {/* Hover glow effect */}
      {interactive && (
        <div className="absolute -inset-4 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
      
      <div
        className={`
          relative bg-gray-50/80 dark:bg-white/5 backdrop-blur-sm 
          border border-gray-200 dark:border-white/10 rounded-2xl p-8 
          transition-all duration-300
          ${interactive ? 'hover:border-gray-300 dark:hover:border-white/20' : ''}
        `}
      >
        {/* Icon */}
        <div
          className={`
            inline-flex h-12 w-12 items-center justify-center rounded-xl 
            text-white shadow-lg bg-gradient-to-br ${accentClasses[accent]}
          `}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>

        {/* Metric badge */}
        {metric && (
          <div className="mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/80">
              {metric}
            </span>
          </div>
        )}

        {/* Description */}
        <p className="mt-4 text-gray-600 dark:text-white/70 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}