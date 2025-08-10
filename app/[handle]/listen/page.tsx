import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase-server';
import { Artist, SocialLink } from '@/types/db';
import { getAvailableDSPs } from '@/lib/dsp';
import { ArtistPageShell } from '@/components/profile/ArtistPageShell';
import ListenDSPButtons from '@/components/listen/ListenDSPButtons';
import { LISTEN_COOKIE, PAGE_SUBTITLES } from '@/constants/app';

export const dynamic = 'force-dynamic';

export default async function ListenPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const supabase = await createServerClient();
  if (!supabase) {
    notFound();
  }

  // Fetch artist + social links
  const { data, error } = await supabase
    .from('artists')
    .select('*, social_links(*)')
    .eq('handle', handle)
    .eq('published', true)
    .single();

  if (error || !data) {
    notFound();
  }

  const { social_links: socialLinks = [], ...artist } = data as Artist & {
    social_links: SocialLink[];
  };

  // Fetch releases for this artist (newest first)
  const { data: releases } = await supabase
    .from('releases')
    .select('*')
    .eq('artist_id', artist.id)
    .order('release_date', { ascending: false });

  const dsps = getAvailableDSPs(artist, releases || []);

  // Resolve preferred url from cookie if any
  const cookieStore = await cookies();
  const preference = cookieStore.get(LISTEN_COOKIE)?.value;
  const preferredUrl = preference
    ? (dsps.find((d) => d.key === preference)?.url ?? null)
    : null;

  return (
    <ArtistPageShell
      artist={artist}
      socialLinks={socialLinks}
      subtitle={PAGE_SUBTITLES.listen}
    >
      {dsps.length === 0 ? (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            No platforms available
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Check back soon!
          </p>
        </div>
      ) : (
        <ListenDSPButtons
          handle={artist.handle}
          dsps={dsps}
          initialPreferredUrl={preferredUrl}
        />
      )}
    </ArtistPageShell>
  );
}
