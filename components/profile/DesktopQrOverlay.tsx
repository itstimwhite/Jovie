'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { QRCode } from '@/components/atoms/QRCode';

interface DesktopQrOverlayProps {
  handle: string;
}

export function DesktopQrOverlay({ handle }: DesktopQrOverlayProps) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    const hasDismissed =
      localStorage.getItem('viewOnMobileDismissed') === 'true';

    if (isDesktop && !hasDismissed) {
      setShow(true);
      setUrl(`${window.location.origin}/${handle}`);
    } else if (hasDismissed) {
      setDismissed(true);
    }
  }, [handle]);

  // React to viewport resizes: show on desktop if not dismissed, hide on mobile
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)');

    const onChange = (e: MediaQueryListEvent | MediaQueryList) => {
      const isDesktop =
        'matches' in e ? e.matches : (e as MediaQueryList).matches;
      if (isDesktop) {
        if (!dismissed) {
          setShow(true);
          setUrl(`${window.location.origin}/${handle}`);
        }
      } else {
        // Always hide on mobile viewport
        setShow(false);
      }
    };

    // Initial sync in case state drifted
    onChange(mql);

    // Add listener with both modern and legacy APIs (feature detection)
    type LegacyMQL = MediaQueryList & {
      addListener?: (
        listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
      ) => void;
      removeListener?: (
        listener: (this: MediaQueryList, ev: MediaQueryListEvent) => void
      ) => void;
    };
    const legacyMql = mql as LegacyMQL;

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange as EventListener);
    } else if (typeof legacyMql.addListener === 'function') {
      legacyMql.addListener(
        onChange as (this: MediaQueryList, ev: MediaQueryListEvent) => void
      );
    }

    return () => {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', onChange as EventListener);
      } else if (typeof legacyMql.removeListener === 'function') {
        legacyMql.removeListener(
          onChange as (this: MediaQueryList, ev: MediaQueryListEvent) => void
        );
      }
    };
  }, [dismissed, handle]);

  const close = () => {
    // Clear URL first so the <img> disappears immediately, even during exit animation
    setUrl('');
    setShow(false);
    setDismissed(true);
    localStorage.setItem('viewOnMobileDismissed', 'true');
  };

  const reopen = () => {
    setShow(true);
    setDismissed(false);
    try {
      setUrl(`${window.location.origin}/${handle}`);
    } catch {}
  };

  if (!show && !dismissed) return null;

  return (
    <>
      {show && (
        <motion.div
          key="qr"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="group fixed bottom-4 right-4 z-50 flex flex-col items-center rounded-xl p-4 ring-1 ring-black/10 dark:ring-white/10 shadow-xl bg-white/85 dark:bg-gray-900/80 backdrop-blur-md overflow-hidden"
        >
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.35),transparent_60%)]" />
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
          {url && (
            <QRCode data={url} size={120} label="Scan to view on mobile" />
          )}
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            View on mobile
          </p>
        </motion.div>
      )}

      {!show && dismissed && (
        <motion.button
          key="reopen"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          onClick={reopen}
          aria-label="View on mobile"
          className="group fixed bottom-4 right-4 z-50 p-2 rounded-full bg-white/90 dark:bg-gray-900/80 backdrop-blur-md ring-1 ring-black/10 dark:ring-white/10 shadow-md hover:shadow-lg transition"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.35),transparent_60%)]" />
          <DevicePhoneMobileIcon className="relative h-5 w-5 text-gray-700 dark:text-gray-300" />
        </motion.button>
      )}
    </>
  );
}

export default DesktopQrOverlay;
