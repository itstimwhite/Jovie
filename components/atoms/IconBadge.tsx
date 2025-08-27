import React from 'react';

interface IconBadgeProps {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  colorVar: string;
  className?: string;
}

export function IconBadge({ Icon, colorVar, className = '' }: IconBadgeProps) {
  return (
    <div
      className={`relative flex h-8 w-8 items-center justify-center rounded-full ${className}`}
      style={{
        backgroundColor: `color-mix(in srgb, var(${colorVar}) 12%, transparent)`,
      }}
    >
      <Icon
        className='h-[18px] w-[18px]'
        style={{
          color: `var(${colorVar})`,
        }}
        role='img'
        aria-hidden='true'
      />
    </div>
  );
}
