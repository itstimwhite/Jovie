'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FlyoutItem } from '@/components/molecules/FlyoutItem';
import { FEATURES } from '@/lib/features';

interface ProductFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  className?: string;
}

export function ProductFlyout({
  isOpen,
  onClose,
  triggerRef,
  className = '',
}: ProductFlyoutProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLAnchorElement>(null);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);
  const [showPanel, setShowPanel] = useState(false);

  // Handle panel visibility with slight delay for animations
  useEffect(() => {
    if (isOpen) {
      setShowPanel(true);
    } else {
      // Small delay before hiding to allow exit animation
      const timeout = setTimeout(() => setShowPanel(false), 10);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Split features into core (first 4) and more (remaining)
  const coreFeatures = FEATURES.slice(0, 4);
  const moreFeatures = FEATURES.slice(4);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const focusableItems = panelRef.current?.querySelectorAll(
        '[role="menuitem"]'
      ) as NodeListOf<HTMLElement>;

      if (!focusableItems?.length) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          triggerRef.current?.focus();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setCurrentFocusIndex((prev) =>
            prev < focusableItems.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setCurrentFocusIndex((prev) =>
            prev > 0 ? prev - 1 : focusableItems.length - 1
          );
          break;
        case 'Home':
          e.preventDefault();
          setCurrentFocusIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentFocusIndex(focusableItems.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, triggerRef]);

  // Focus management
  useEffect(() => {
    if (!isOpen) return;

    const focusableItems = panelRef.current?.querySelectorAll(
      '[role="menuitem"]'
    ) as NodeListOf<HTMLElement>;

    if (focusableItems?.[currentFocusIndex]) {
      focusableItems[currentFocusIndex].focus();
    }
  }, [currentFocusIndex, isOpen]);

  // Focus first item when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentFocusIndex(0);
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        firstItemRef.current?.focus();
      }, 10);
    }
  }, [isOpen]);

  // Click outside handler
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!showPanel) return null;

  return (
    <div
      ref={panelRef}
      role="menu"
      aria-labelledby="product-trigger"
      className={`absolute left-1/2 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-4xl min-w-80 -translate-x-1/2 transform rounded-lg border bg-[var(--panel)] shadow-lg ring-1 ring-[var(--border)] ${className}`}
      style={{
        opacity: isOpen ? 1 : 0,
        transform: isOpen
          ? 'translateX(-50%) translateY(0) scale(1)'
          : 'translateX(-50%) translateY(-4px) scale(0.99)',
        transition: 'opacity 100ms ease-out, transform 100ms ease-out',
      }}
    >
      {/* Desktop Layout */}
      <div className="hidden md:block">
        <div className="grid grid-cols-2 gap-8 p-6">
          {/* Core Features */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-[var(--fg)]">
              Core Features
            </h2>
            <div className="space-y-1">
              {coreFeatures.map((feature, index) => (
                <FlyoutItem
                  key={feature.slug}
                  feature={feature}
                  ref={index === 0 ? firstItemRef : undefined}
                  className="hover:bg-[var(--bg)] focus-visible:bg-[var(--bg)]"
                  style={
                    {
                      '--ring-color': `color-mix(in srgb, var(${feature.colorVar}) 25%, transparent)`,
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(-2px)',
                      transition: `opacity 120ms ease-out ${index * 10}ms, transform 120ms ease-out ${index * 10}ms`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          </div>

          {/* More Features */}
          <div>
            <h2 className="mb-4 text-sm font-semibold text-[var(--fg)]">
              More
            </h2>
            <div className="space-y-1">
              {moreFeatures.map((feature, index) => (
                <FlyoutItem
                  key={feature.slug}
                  feature={feature}
                  className="hover:bg-[var(--bg)] focus-visible:bg-[var(--bg)]"
                  style={
                    {
                      '--ring-color': `color-mix(in srgb, var(${feature.colorVar}) 25%, transparent)`,
                      opacity: isOpen ? 1 : 0,
                      transform: isOpen ? 'translateY(0)' : 'translateY(-2px)',
                      transition: `opacity 120ms ease-out ${(index + 4) * 10}ms, transform 120ms ease-out ${(index + 4) * 10}ms`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </div>
          </div>
        </div>

        {/* Changelog Banner */}
        <div className="border-t border-[var(--border)] px-6 py-3">
          <Link
            href="/changelog"
            className="group flex items-center justify-between rounded-lg p-2 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--fg)]"
            role="menuitem"
          >
            <span>View Changelog</span>
            <span className="text-xs opacity-75 group-hover:opacity-100">
              →
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="max-h-[80vh] overflow-y-auto p-4">
          <div className="space-y-1">
            {FEATURES.map((feature, index) => (
              <FlyoutItem
                key={feature.slug}
                feature={feature}
                ref={index === 0 ? firstItemRef : undefined}
                className="min-h-[44px] hover:bg-[var(--bg)] focus-visible:bg-[var(--bg)]"
                style={
                  {
                    '--ring-color': `color-mix(in srgb, var(${feature.colorVar}) 25%, transparent)`,
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? 'translateY(0)' : 'translateY(-2px)',
                    transition: `opacity 120ms ease-out ${index * 10}ms, transform 120ms ease-out ${index * 10}ms`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Mobile Changelog */}
          <div className="mt-4 border-t border-[var(--border)] pt-4">
            <Link
              href="/changelog"
              className="flex min-h-[44px] items-center justify-between rounded-lg p-3 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--bg)] hover:text-[var(--fg)]"
              role="menuitem"
            >
              <span>View Changelog</span>
              <span className="text-xs opacity-75">→</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
