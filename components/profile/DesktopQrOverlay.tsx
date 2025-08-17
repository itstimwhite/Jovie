'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

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
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', onChange as EventListener);
    } else if (
      typeof (
        mql as MediaQueryList & {
          addListener?: (listener: (mql: MediaQueryList) => void) => void;
        }
      ).addListener === 'function'
    ) {
      (
        mql as MediaQueryList & {
          addListener: (listener: (mql: MediaQueryList) => void) => void;
        }
      ).addListener(onChange);
    }

    return () => {
      if (typeof mql.removeEventListener === 'function') {
        mql.removeEventListener('change', onChange as EventListener);
      } else if (
        typeof (
          mql as MediaQueryList & {
            removeListener?: (listener: (mql: MediaQueryList) => void) => void;
          }
        ).removeListener === 'function'
      ) {
        (
          mql as MediaQueryList & {
            removeListener: (listener: (mql: MediaQueryList) => void) => void;
          }
        ).removeListener(onChange);
      }
    };
  }, [dismissed, handle]);

  const close = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('viewOnMobileDismissed', 'true');
  };

  const reopen = () => {
    setShow(true);
    setDismissed(false);
  };

  if (!show && !dismissed) return null;

  return show ? (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-center bg-white dark:bg-gray-900 shadow-lg rounded-lg p-4">
      <button
        onClick={close}
        aria-label="Close"
        className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
            url
          )}`}
          alt="Scan to view on mobile"
          width={120}
          height={120}
          className="h-[120px] w-[120px]"
        />
      )}
      <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
        View on mobile
      </p>
    </div>
  ) : (
    <button
      onClick={reopen}
      aria-label="View on mobile"
      className="fixed bottom-4 right-4 z-50 p-2 bg-white dark:bg-gray-900 shadow-lg rounded-full"
    >
      <DevicePhoneMobileIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
    </button>
  );
}

export default DesktopQrOverlay;
