export interface SectionHeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
}

export function SectionHeading({
  level = 2,
  children,
  className = '',
  align = 'center',
  size = 'lg',
  id,
}: SectionHeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const sizeClasses = {
    sm: 'text-lg md:text-xl',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl',
    xl: 'text-3xl md:text-4xl sm:text-5xl',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <Tag
      id={id}
      className={`font-bold tracking-tight text-gray-900 dark:text-white ${sizeClasses[size]} ${alignClasses[align]} ${className}`}
    >
      {children}
    </Tag>
  );
}
