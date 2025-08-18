import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    time: new Date().toISOString(),
    env: process.env.VERCEL_ENV || 'local',
    branch: process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || null,
    commit: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || null,
  });
}
