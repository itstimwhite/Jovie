'use client';

import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import {
  downloadQRCode,
  generateQRCodeSvg,
  generateQRFilename,
  svgToDataUrl,
  svgToPngDataUrl,
} from '@/lib/qr';

interface TipQrCardProps {
  tipUrl: string;
  handle: string;
  title?: string;
  description?: string;
  size?: number;
  className?: string;
}

export function TipQrCard({
  tipUrl,
  handle,
  title = 'Tip Artist',
  description,
  size = 200,
  className = '',
}: TipQrCardProps) {
  const [svgString, setSvgString] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  // Generate QR code on mount or when tipUrl changes
  useEffect(() => {
    if (tipUrl) {
      const svg = generateQRCodeSvg(tipUrl, {
        size,
        padding: 4,
        color: '#000000',
        background: '#ffffff',
        ecl: 'M',
      });
      setSvgString(svg);
    }
  }, [tipUrl, size]);

  // Download as SVG
  const downloadSvg = () => {
    if (!svgString || !handle) return;

    const dataUrl = svgToDataUrl(svgString);
    const filename = generateQRFilename(handle, 'svg');
    downloadQRCode(dataUrl, filename);
  };

  // Download as PNG
  const downloadPng = async () => {
    if (!svgString || !handle) return;

    setIsDownloading(true);
    try {
      const dataUrl = await svgToPngDataUrl(svgString, size);
      const filename = generateQRFilename(handle, 'png');
      downloadQRCode(dataUrl, filename);
    } catch (error) {
      console.error('Failed to download PNG:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className={`flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm ${className}`}
    >
      {/* QR Code */}
      <div
        className='mb-4 p-4 bg-white rounded-lg shadow-sm'
        dangerouslySetInnerHTML={{ __html: svgString }}
      />

      {/* Title and Description */}
      {title && (
        <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-1'>
          {title}
        </h3>
      )}
      {description && (
        <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 text-center'>
          {description}
        </p>
      )}

      {/* Download Buttons */}
      <div className='flex space-x-3 mt-2'>
        <button
          onClick={downloadSvg}
          className='flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors'
          disabled={isDownloading || !svgString}
        >
          <ArrowDownTrayIcon className='h-4 w-4 mr-1' />
          SVG
        </button>
        <button
          onClick={downloadPng}
          className='flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white transition-colors'
          disabled={isDownloading || !svgString}
        >
          <ArrowDownTrayIcon className='h-4 w-4 mr-1' />
          PNG
          {isDownloading && (
            <span className='ml-1 inline-block h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent' />
          )}
        </button>
      </div>
    </div>
  );
}
