import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Container } from '@/components/site/Container';

// Create an anonymous Supabase client for public data
function createAnonSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient(supabaseUrl, supabaseKey);
}

interface ArtistProfile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
}

async function getArtistProfile(
  username: string
): Promise<ArtistProfile | null> {
  const supabase = createAnonSupabase();

  const { data, error } = await supabase
    .from('artist_profiles')
    .select('id, username, display_name, bio, avatar_url, is_public')
    .eq('username', username.toLowerCase())
    .eq('is_public', true) // Only fetch public profiles
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

interface Props {
  params: Promise<{
    username: string;
  }>;
}

export default async function ArtistPage({ params }: Props) {
  const { username } = await params;
  const profile = await getArtistProfile(username);

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0E12] transition-colors">
      <Container className="py-16">
        <div className="max-w-2xl mx-auto">
          {/* Artist Header */}
          <div className="text-center mb-12">
            {profile.avatar_url && (
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                <Image
                  src={profile.avatar_url}
                  alt={profile.display_name || profile.username}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {profile.display_name || profile.username}
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-400">
              @{profile.username}
            </p>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mb-12">
              <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 rounded-xl p-8">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </div>
            </div>
          )}

          {/* Coming Soon Section */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                More content coming soon
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.display_name || profile.username} is setting up their
                profile. Check back soon for updates!
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const profile = await getArtistProfile(username);

  if (!profile) {
    return {
      title: 'Artist Not Found',
      description: 'The requested artist profile could not be found.',
    };
  }

  return {
    title: `${profile.display_name || profile.username} - Artist Profile`,
    description: profile.bio
      ? `${profile.bio.slice(0, 160)}${profile.bio.length > 160 ? '...' : ''}`
      : `Check out ${profile.display_name || profile.username}'s artist profile on Jovie.`,
  };
}
