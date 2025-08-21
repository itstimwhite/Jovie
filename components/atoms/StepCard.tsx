export interface StepCardProps {
  /** Step number (e.g., "01", "02", "03") */
  stepNumber: string;
  /** Step title */
  title: string;
  /** Step description */
  description: string;
  /** Icon element to display */
  icon: React.ReactNode;
  /** Whether to show connection line to next step */
  showConnectionLine?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show hover effects */
  interactive?: boolean;
}

export function StepCard({
  stepNumber,
  title,
  description,
  icon,
  showConnectionLine = false,
  className = '',
  interactive = true,
}: StepCardProps) {
  return (
    <div className={`relative ${interactive ? 'group' : ''} ${className}`}>
      {/* Connection line */}
      {showConnectionLine && (
        <div className="absolute left-1/2 top-8 hidden h-px w-full -translate-x-1/2 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-cyan-500/30 md:block" />
      )}

      <div className="relative">
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
          <div className="text-center">
            {/* Icon circle */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
              {icon}
            </div>
            
            <div className="mt-6">
              {/* Step number */}
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-500 dark:text-blue-400">
                Step {stepNumber}
              </div>
              
              {/* Title */}
              <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              
              {/* Description */}
              <p className="mt-3 text-gray-600 dark:text-white/70 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}