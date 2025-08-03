import { ReactNode } from 'react';

export const runtime = 'edge';
export const dynamic = 'force-static';
export const revalidate = 3600;

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return children;
}
