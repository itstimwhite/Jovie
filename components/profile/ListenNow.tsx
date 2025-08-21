'use client';

import { ListenSection } from '@/components/organisms/ListenSection';
import { getAvailableDSPs } from '@/lib/dsp';
import type { Artist } from '@/types/db';

interface ListenNowProps {
  handle: string;
  artistName: string;
  artist?: Artist;
}

export function ListenNow({ handle, artist }: ListenNowProps) {
  // Generate DSPs from artist data if available, otherwise empty array
  const dsps = artist ? getAvailableDSPs(artist) : [];

  return <ListenSection handle={handle} dsps={dsps} className="" />;
}
