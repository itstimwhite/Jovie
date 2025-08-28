import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const POSTHOG_HOST = 'https://us.posthog.com';

async function handler(req: NextRequest) {
  const { pathname, search } = new URL(req.url);
  const path = pathname.replace('/ingest', '');

  const url = `${POSTHOG_HOST}${path}${search}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': req.headers.get('content-type') || 'application/json',
        'User-Agent': req.headers.get('user-agent') || 'PostHog Proxy',
      },
      body: req.method !== 'GET' ? await req.text() : undefined,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type':
          response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('[PostHog Proxy] Error:', error);
    return new NextResponse('Proxy Error', { status: 500 });
  }
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const OPTIONS = handler;
