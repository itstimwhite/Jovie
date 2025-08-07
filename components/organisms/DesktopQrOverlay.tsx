'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { XMarkIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { FEATURE_FLAGS } from '@/constants/app';
import { track } from '@/lib/analytics';

interface DesktopQrOverlayProps {
  handle: string;
}

const HIDE_KEY = 'jovie_hide_qr';
const HIDE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function DesktopQrOverlay({ handle }: DesktopQrOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [QRCode, setQRCode] = useState<React.ComponentType<{
    value: string;
    size: number;
  }> | null>(null);
  const hasShownRef = useRef(false);
  const qrUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('src', 'qr_desktop');
    return url.toString();
  }, []);
  const qrSize =
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width:1024px)').matches
      ? 120
      : 96;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!FEATURE_FLAGS.desktopQr) return;

    const hiddenUntil = Number(localStorage.getItem(HIDE_KEY) || 0);
    if (hiddenUntil) {
      if (Date.now() < hiddenUntil) return;
      localStorage.removeItem(HIDE_KEY);
    }

    // Do not show on mobile or when reduced motion / print
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const isPrint = window.matchMedia('print').matches;
    if (!isDesktop || prefersReduced || isPrint) return;

    let touched = false;
    const touchHandler = () => {
      touched = true;
    };
    window.addEventListener('touchstart', touchHandler, { passive: true });

    const show = () => {
      if (touched || hasShownRef.current) return;
      hasShownRef.current = true;
      setVisible(true);
      import('qrcode.react').then((mod) => setQRCode(() => mod.default));
      track('desktop_qr_shown', { profile: handle });
    };

    const scrollHandler = () => {
      if (window.scrollY > window.innerHeight * 0.5) {
        show();
        window.removeEventListener('scroll', scrollHandler);
      }
    };

    let timer: number;
    if (window.requestIdleCallback) {
      timer = window.requestIdleCallback(show);
    } else {
      timer = window.setTimeout(show, 1500);
    }
    window.addEventListener('scroll', scrollHandler);

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(timer);
      } else {
        clearTimeout(timer);
      }
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('touchstart', touchHandler);
    };
  }, [handle]);

  const dismiss = () => {
    setVisible(false);
    setShowIcon(true);
    localStorage.setItem(HIDE_KEY, String(Date.now() + HIDE_DURATION));
  };

  const reopen = () => {
    localStorage.removeItem(HIDE_KEY);
    setShowIcon(false);
    setVisible(true);
    if (!QRCode) {
      import('qrcode.react').then((mod) => setQRCode(() => mod.default));
    }
    track('desktop_qr_shown', { profile: handle });
  };

  if (!visible && !showIcon) return null;

  return (
    <>
      {visible && QRCode && (
        <div className="fixed bottom-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 flex flex-col items-center gap-2 transition-opacity">
          <button
            aria-label="Dismiss"
            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
            onClick={dismiss}
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          <QRCode
            value={qrUrl}
            size={qrSize}
            aria-label="Scan to view on mobile"
          />
          <p className="text-xs text-gray-700 dark:text-gray-200">
            View on mobile
          </p>
        </div>
      )}
      {showIcon && (
        <button
          aria-label="Show QR"
          onClick={reopen}
          className="fixed bottom-4 right-4 z-40 p-2 rounded-full shadow-lg backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200"
        >
          <DevicePhoneMobileIcon className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
