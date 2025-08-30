'use client';

import type { ReactNode } from 'react';

export interface TooltipProps {
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
}

// Minimal, accessible fallback tooltip using the native title attribute.
// Replace with a richer implementation if/when needed.
export function Tooltip({ content, children }: TooltipProps) {
  const title = typeof content === 'string' ? content : undefined;
  return <span title={title}>{children}</span>;
}
