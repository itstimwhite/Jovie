import { cookies } from 'next/headers';
import { LISTEN_COOKIE } from '@/constants/app';

export function getListenPreference(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get(LISTEN_COOKIE)?.value;
}

export function setListenPreference(value: string) {
  const cookieStore = cookies();
  cookieStore.set(LISTEN_COOKIE, value, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}