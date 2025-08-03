import { MetadataRoute } from 'next';
import { createServerClient } from '@/lib/supabase-server';
import { APP_URL } from '@/constants/app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerClient();

  // Get all published artists
  const { data: artists } = await supabase
    .from('artists')
    .select('handle, updated_at')
    .eq('published', true);

  const baseUrl = APP_URL;

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  // Artist profile pages
  const artistPages =
    artists?.map((artist) => ({
      url: `${baseUrl}/${artist.handle}`,
      lastModified: artist.updated_at
        ? new Date(artist.updated_at)
        : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || [];

  return [...staticPages, ...artistPages];
}
