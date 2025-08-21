export interface StatusBadgeProps {
  /** Badge text content */
  children: React.ReactNode;
  /** Color variant for the badge */
  variant?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  /** Optional icon to display before text */
  icon?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

export function StatusBadge({
  children,
  variant = 'blue',
  icon,
  size = 'md',
  className = '',
}: StatusBadgeProps) {
  const variantClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
    gray: 'bg-gray-500/10 border-gray-500/20 text-gray-400',
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full border font-medium
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
