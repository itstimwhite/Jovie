import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Suspense } from 'react';
import { ProgressiveArtistPage } from '@/components/profile/ProgressiveArtistPage';
import { DesktopQrOverlay } from '@/components/profile/DesktopQrOverlay';
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton';
import {
  LegacySocialLink,
  CreatorProfile,
  convertCreatorProfileToArtist,
} from '@/types/db';
import { PAGE_SUBTITLES } from '@/constants/app';
import { getOptimizedProfileWithSocialLinksAnonymous } from '@/lib/supabase-optimized';

// Optimized cached function to get profile with social links in a single query
const getProfileWithSocialLinks = cache(
  async (username: string): Promise<{
    profile: CreatorProfile | null;
    socialLinks: LegacySocialLink[];
  }> => {
    // Use the optimized query that fetches profile + social links in a single database call
    const result = await getOptimizedProfileWithSocialLinksAnonymous(username);
    
    if (!result.profile) {
      return { profile: null, socialLinks: [] };
    }

    // Add fallback for missing fields that might not exist in the database yet
    const profile: CreatorProfile = {
      ...result.profile,
      is_featured: result.profile.is_featured ?? false,
      marketing_opt_out: result.profile.marketing_opt_out ?? false,
    };

    return { profile, socialLinks: result.socialLinks };
  }
);

interface Props {
  params: {
    username: string;
  };
  searchParams?: {
    mode?: 'profile' | 'listen' | 'tip';
  };
}

export default async function ArtistPage({ params, searchParams }: Props) {
  const { username } = await params;
  const resolvedSearchParams = await searchParams;
  const { mode = 'profile' } = resolvedSearchParams || {};

  // Single optimized query fetching profile + social links
  const { profile, socialLinks } = await getProfileWithSocialLinks(username);

  if (!profile) {
    notFound();
  }

  // Convert our profile data to the Artist type expected by components
  const artist = convertCreatorProfileToArtist(profile);

  // Determine subtitle based on mode
  const getSubtitle = (mode: string) => {
    switch (mode) {
      case 'listen':
        return PAGE_SUBTITLES.listen;
      case 'tip':
        return PAGE_SUBTITLES.tip;
      default:
        return PAGE_SUBTITLES.profile;
    }
  };

  // Show tip button when not in tip mode and artist has venmo
  const hasVenmoLink = socialLinks.some((link) => link.platform === 'venmo');
  const showTipButton = mode !== 'tip' && hasVenmoLink;
  const showBackButton = mode !== 'profile';

  return (
    <>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProgressiveArtistPage
          mode={mode}
          artist={artist}
          socialLinks={socialLinks}
          subtitle={getSubtitle(mode)}
          showTipButton={showTipButton}
          showBackButton={showBackButton}
        />
      </Suspense>
      <Suspense fallback={null}>
        <DesktopQrOverlay handle={artist.handle} />
      </Suspense>
    </>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const { profile } = await getProfileWithSocialLinks(username);

  if (!profile) {
    return {
      title: 'Profile Not Found',
      description: 'The requested profile could not be found.',
    };
  }

  const title = `${profile.display_name || profile.username} - Artist Profile`;
  const description = profile.bio
    ? `${profile.bio.slice(0, 160)}${profile.bio.length > 160 ? '...' : ''}`
    : `Check out ${profile.display_name || profile.username}'s artist profile on Jovie.`;

  return {
    title,
    description,
    // OpenGraph with optimized image
    openGraph: {
      title,
      description,
      images: profile.avatar_url
        ? [
            {
              url: profile.avatar_url,
              width: 400,
              height: 400,
              alt: `${profile.display_name || profile.username} profile picture`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: profile.avatar_url ? [profile.avatar_url] : undefined,
    },
  };
}

// Note: generateStaticParams removed to allow edge runtime
// Edge runtime provides better performance for dynamic profile pages

// Enable ISR with 5 minute revalidation for fresher content (optimized)
export const revalidate = 300;

// Temporarily disable edge runtime for debugging
// export const runtime = 'edge';
