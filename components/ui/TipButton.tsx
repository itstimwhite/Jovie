'use client';

import { useState } from 'react';
import { track } from '@/lib/analytics';

interface TipButtonProps {
  handle: string;
  artistName: string;
  className?: string;
}

export function TipButton({
  handle,
  artistName,
  className = '',
}: TipButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = async () => {
    setIsPressed(true);

    try {
      // Track the tip button click
      track('tip_button_click', {
        handle,
        artist: artistName,
        source: 'social_bar',
      });

      await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          handle,
          linkType: 'tip_button',
          target: 'tip_page',
        }),
      });

      // Navigate to tip page
      window.location.href = `/${handle}/tip`;
    } catch (error) {
      console.error('Failed to track tip button click:', error);
      // Still navigate even if tracking fails
      window.location.href = `/${handle}/tip`;
    } finally {
      // Reset pressed state after a short delay for visual feedback
      setTimeout(() => setIsPressed(false), 150);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium
        bg-gradient-to-b from-purple-500 to-purple-600 
        hover:from-purple-600 hover:to-purple-700
        active:from-purple-700 active:to-purple-800
        text-white rounded-full transition-all duration-200 ease-out
        shadow-sm hover:shadow-md active:shadow-sm
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
        dark:focus:ring-offset-gray-900
        transform hover:scale-105 active:scale-95
        ${isPressed ? 'scale-95' : ''}
        ${className}
      `}
      title={`Tip ${artistName}`}
      aria-label={`Send a tip to ${artistName}`}
    >
      <span className="relative z-10 flex items-center gap-1.5">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
          />
        </svg>
        Tip
      </span>

      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 ease-out" />
    </button>
  );
}
