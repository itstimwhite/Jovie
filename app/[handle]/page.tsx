import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ListenNow } from '@/components/profile/ListenNow';
import { SocialBar } from '@/components/profile/SocialBar';
import { ProfileFooter } from '@/components/profile/ProfileFooter';
import { Container } from '@/components/site/Container';
import { Artist, SocialLink } from '@/types/db';
import { APP_NAME } from '@/constants/app';

interface ProfilePageProps {
  params: {
    handle: string;
  };
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const supabase = await createServerClient();
  
  const { data: artist } = await supabase
    .from('artists')
    .select('*')
    .eq('handle', params.handle)
    .eq('published', true)
    .single();

  if (!artist) {
    return {
      title: 'Artist Not Found',
    };
  }

  return {
    title: `${artist.name} | ${APP_NAME}`,
    description: artist.tagline || `Listen to ${artist.name}'s music`,
    openGraph: {
      title: artist.name,
      description: artist.tagline || `Listen to ${artist.name}'s music`,
      images: artist.image_url ? [artist.image_url] : [],
    },
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = await createServerClient();
  
  const [artistResult, socialLinksResult] = await Promise.all([
    supabase
      .from('artists')
      .select('*')
      .eq('handle', params.handle)
      .eq('published', true)
      .single(),
    supabase
      .from('social_links')
      .select('*')
      .eq('artist_id', (await supabase
        .from('artists')
        .select('id')
        .eq('handle', params.handle)
        .single())?.data?.id)
      .order('clicks', { ascending: false })
  ]);

  if (artistResult.error || !artistResult.data) {
    notFound();
  }

  const artist = artistResult.data as Artist;
  const socialLinks = (socialLinksResult.data || []) as SocialLink[];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Container>
        <div className="flex min-h-screen flex-col items-center justify-center py-12">
          <div className="w-full max-w-md space-y-8">
            <ProfileHeader artist={artist} />
            
            <div className="flex justify-center">
              <ListenNow handle={artist.handle} artistName={artist.name} />
            </div>

            <SocialBar
              handle={artist.handle}
              artistName={artist.name}
              socialLinks={socialLinks}
            />

            <ProfileFooter artist={artist} />
          </div>
        </div>
      </Container>
    </div>
  );
}