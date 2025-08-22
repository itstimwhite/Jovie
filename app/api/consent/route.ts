import { NextResponse } from 'next/server';
import { readConsent } from '@/lib/cookies/consent';

export async function GET() {
  try {
    const consent = await readConsent();
    return NextResponse.json(
      consent || { essential: true, analytics: false, marketing: false }
    );
  } catch (error) {
    console.error('Error reading consent:', error);
    return NextResponse.json(
      { essential: true, analytics: false, marketing: false },
      { status: 500 }
    );
  }
}
