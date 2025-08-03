import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'public-anon-key';

export async function createServerClient() {
  // For public pages, just return anonymous client
  // This allows static generation to work
  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function createAuthenticatedServerClient() {
  // This would be used in server actions/API routes that need auth
  // But we'll import auth there directly to avoid static generation issues
  const { auth } = await import('@clerk/nextjs/server');

  try {
    const { getToken } = await auth();
    const token = await getToken({ template: 'supabase' });

    if (token) {
      return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });
    }
  } catch {
    // Fall back to anonymous client
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
