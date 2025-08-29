/**
 * QR code utility functions for client-side generation and download
 */

import QRCode from 'qrcode-svg';

/**
 * Generate an SVG QR code string
 * @param url The URL to encode in the QR code
 * @param options Options for the QR code
 * @returns SVG string
 */
export function generateQRCodeSvg(
  url: string,
  options: {
    size?: number;
    padding?: number;
    color?: string;
    background?: string;
    ecl?: 'L' | 'M' | 'Q' | 'H';
  } = {}
): string {
  const {
    size = 256,
    padding = 4,
    color = '#000000',
    background = '#ffffff',
    ecl = 'M',
  } = options;

  const qrcode = new QRCode({
    content: url,
    width: size,
    height: size,
    padding: padding,
    color: color,
    background: background,
    ecl: ecl,
  });

  return qrcode.svg();
}

/**
 * Convert SVG string to a data URL
 * @param svg SVG string
 * @returns Data URL for the SVG
 */
export function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Convert SVG to PNG data URL
 * @param svg SVG string
 * @param size Size of the PNG image
 * @returns Promise that resolves to a data URL for the PNG
 */
export async function svgToPngDataUrl(
  svg: string,
  size: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Fill with white background to ensure proper rendering
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      ctx.drawImage(img, 0, 0, size, size);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load SVG'));
    img.src = svgToDataUrl(svg);
  });
}

/**
 * Generate a filename for the QR code download
 * @param handle User handle
 * @param format File format ('svg' or 'png')
 * @returns Formatted filename
 */
export function generateQRFilename(
  handle: string,
  format: 'svg' | 'png'
): string {
  // Remove @ symbol if present and sanitize handle
  const sanitizedHandle = handle
    .replace(/^@/, '')
    .replace(/[^a-zA-Z0-9-_]/g, '');
  return `jovie-tip-${sanitizedHandle}.${format}`;
}

/**
 * Trigger a download of the QR code
 * @param dataUrl Data URL of the image
 * @param filename Filename for the download
 */
export function downloadQRCode(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
