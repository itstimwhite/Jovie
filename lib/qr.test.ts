import { describe, expect, it } from 'vitest';
import { generateQRFilename } from './qr';

describe('QR Code Utilities', () => {
  describe('generateQRFilename', () => {
    it('should generate correct filename for SVG format', () => {
      expect(generateQRFilename('artist', 'svg')).toBe('jovie-tip-artist.svg');
    });

    it('should generate correct filename for PNG format', () => {
      expect(generateQRFilename('artist', 'png')).toBe('jovie-tip-artist.png');
    });

    it('should remove @ symbol from handle', () => {
      expect(generateQRFilename('@artist', 'svg')).toBe('jovie-tip-artist.svg');
    });

    it('should sanitize handle by removing special characters', () => {
      expect(generateQRFilename('artist.name!', 'svg')).toBe(
        'jovie-tip-artistname.svg'
      );
    });

    it('should allow alphanumeric characters and hyphens in handle', () => {
      expect(generateQRFilename('artist-name_123', 'svg')).toBe(
        'jovie-tip-artist-name_123.svg'
      );
    });
  });
});
