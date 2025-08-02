import type { Metadata } from 'next';
import { ClientProviders } from '@/components/providers/ClientProviders';
import { APP_NAME, APP_URL } from '@/constants/app';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: 'One link. All your music.',
  keywords: ['music', 'link in bio', 'artist profile', 'streaming'],
  authors: [
    {
      name: APP_NAME,
      url: APP_URL,
    },
  ],
  creator: APP_NAME,
  metadataBase: new URL(APP_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: APP_NAME,
    description: 'One link. All your music.',
    siteName: APP_NAME,
    images: [
      {
        url: '/og/default.png',
        width: 1200,
        height: 630,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: 'One link. All your music.',
    images: ['/og/default.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
