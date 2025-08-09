import { NextResponse } from 'next/server';
import { getProviderData } from 'flags/next';
import * as flags from '@/lib/flags';

// Vercel Flags v4 discovery endpoint
// Returns versioned flag definitions so the Toolbar/Flags Explorer can detect the SDK
export async function GET() {
  const providerData = getProviderData(flags);

  const response = {
    version: 4, // Required for v4 compatibility
    ...providerData,
    metadata: {
      app: 'jovie',
      framework: 'next',
      source: 'flags-sdk-v4',
    },
  };

  return NextResponse.json(response, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
