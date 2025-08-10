import { cn } from '@/lib/utils';
import { Container } from '@/components/site/Container';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  containerClassName?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
  withGridBg?: boolean;
  withBorder?: boolean;
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any; // For additional props like id, aria-*, etc.
}

const paddingVariants = {
  none: '',
  sm: 'py-12 sm:py-16',
  md: 'py-16 sm:py-20',
  lg: 'py-20 sm:py-24',
  xl: 'py-24 sm:py-32',
};

export function Section({
  children,
  className,
  containerSize = 'lg',
  containerClassName,
  padding = 'lg',
  withGridBg = false,
  withBorder = false,
  as: Component = 'section',
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        'relative',
        paddingVariants[padding],
        withBorder && 'border-t border-gray-200 dark:border-white/10',
        className
      )}
      {...props}
    >
      {withGridBg && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      )}
      <Container
        size={containerSize}
        className={cn('relative', containerClassName)}
      >
        {children}
      </Container>
    </Component>
  );
}
