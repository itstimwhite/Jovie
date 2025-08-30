'use client';

import type { ReactNode } from 'react';

export interface TooltipProps {
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

// Minimal, accessible fallback tooltip using the native title attribute.
// Replace with a richer implementation if/when needed.
export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span title={content} aria-label={content}>
      {children}
    </span>
  );
}
