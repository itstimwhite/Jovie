import { QRCode } from '@/components/atoms/QRCode';

interface QRCodeCardProps {
  data: string;
  title?: string;
  description?: string;
  qrSize?: number;
  className?: string;
}

export function QRCodeCard({
  data,
  title = 'Scan QR Code',
  description,
  qrSize = 120,
  className = '',
}: QRCodeCardProps) {
  return (
    <div className={`text-center space-y-4 ${className}`}>
      <QRCode data={data} size={qrSize} label={title} className='mx-auto' />
      {title && (
        <h3 className='text-sm font-medium text-gray-900 dark:text-white'>
          {title}
        </h3>
      )}
      {description && (
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          {description}
        </p>
      )}
    </div>
  );
}
