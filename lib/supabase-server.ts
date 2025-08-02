import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createServerClient() {
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
  } catch (error) {
    // During static generation, auth context isn't available
    // Fall back to anonymous client for public data
  }

  // Return anonymous client for public data access
  return createClient(supabaseUrl, supabaseAnonKey);
}
