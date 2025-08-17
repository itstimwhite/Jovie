'use client';

import React from 'react';
import { clsx } from 'clsx';

type PrimaryCTAProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel: string;
  type?: 'button' | 'submit' | 'reset';
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  id?: string;
  dataTestId?: string;
};

export default function PrimaryCTA({
  children,
  onClick,
  ariaLabel,
  type = 'button',
  autoFocus = false,
  disabled,
  className,
  size = 'lg',
  fullWidth = true,
  id,
  dataTestId,
}: PrimaryCTAProps) {
  const base =
    'rounded-lg font-semibold shadow transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/50 focus-visible:ring-offset-2 cursor-pointer';
  const color = 'bg-black text-white hover:opacity-90 active:opacity-95';
  const sizing =
    size === 'lg' ? 'py-3 text-base sm:py-4 sm:text-lg' : 'py-2 text-sm';
  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      id={id}
      data-testid={dataTestId}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      autoFocus={autoFocus}
      disabled={disabled}
      className={clsx(base, color, sizing, width, className)}
    >
      {children}
    </button>
  );
}
