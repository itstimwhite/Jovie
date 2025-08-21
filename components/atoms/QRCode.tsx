import Image from 'next/image';
import { cn } from '@/lib/utils';

interface QRCodeProps {
  data: string;
  size?: number;
  label?: string;
  className?: string;
}

export function QRCode({ data, size = 120, label = 'QR Code', className }: QRCodeProps) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;

  return (
    <Image
      src={qrUrl}
      alt={label}
      width={size}
      height={size}
      className={cn(`h-[${size}px] w-[${size}px]`, className)}
      unoptimized // QR codes are dynamically generated
    />
  );
}