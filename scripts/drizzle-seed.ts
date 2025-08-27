#!/usr/bin/env -S tsx

/**
 * Drizzle Database Seed Script
 * Seeds the database with demo data using Drizzle ORM and Neon
 */

import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { creatorProfiles, socialLinks, users } from '@/lib/db/schema';

const DEMO_USERS = [
  {
    clerkId: 'user_demo_1',
    email: 'tim@example.com',
    isPro: true,
  },
  {
    clerkId: 'user_demo_2',
    email: 'sarah@example.com',
    isPro: false,
  },
  {
    clerkId: 'user_demo_3',
    email: 'mike@example.com',
    isPro: true,
  },
];

const DEMO_PROFILES = [
  {
    username: 'tim-white',
    displayName: 'Tim White',
    bio: 'Indie folk artist from Nashville. Creating music that tells stories.',
    creatorType: 'artist' as const,
    spotifyUrl: 'https://open.spotify.com/artist/example1',
    appleMusicUrl: 'https://music.apple.com/artist/example1',
    youtubeUrl: 'https://youtube.com/@timwhite',
    isPublic: true,
    isVerified: true,
    isFeatured: true,
  },
  {
    username: 'sarah-jones',
    displayName: 'Sarah Jones',
    bio: 'Podcast host discussing life, creativity, and everything in between.',
    creatorType: 'podcaster' as const,
    spotifyUrl: 'https://open.spotify.com/show/example2',
    youtubeUrl: 'https://youtube.com/@sarahjones',
    isPublic: true,
    isVerified: false,
    isFeatured: false,
  },
  {
    username: 'mike-thompson',
    displayName: 'Mike Thompson',
    bio: 'Content creator sharing travel stories and photography tips.',
    creatorType: 'creator' as const,
    youtubeUrl: 'https://youtube.com/@mikethompson',
    isPublic: true,
    isVerified: false,
    isFeatured: false,
  },
];

const DEMO_SOCIAL_LINKS = [
  // Tim White's links
  {
    platform: 'Instagram',
    platformType: 'social',
    url: 'https://instagram.com/timwhite',
    displayText: '@timwhite',
    sortOrder: 1,
  },
  {
    platform: 'Twitter',
    platformType: 'social',
    url: 'https://twitter.com/timwhite',
    displayText: '@timwhite',
    sortOrder: 2,
  },
  {
    platform: 'TikTok',
    platformType: 'social',
    url: 'https://tiktok.com/@timwhite',
    displayText: '@timwhite',
    sortOrder: 3,
  },

  // Sarah Jones's links
  {
    platform: 'Instagram',
    platformType: 'social',
    url: 'https://instagram.com/sarahjones',
    displayText: '@sarahjones',
    sortOrder: 1,
  },
  {
    platform: 'Twitter',
    platformType: 'social',
    url: 'https://twitter.com/sarahjones',
    displayText: '@sarahjones',
    sortOrder: 2,
  },

  // Mike Thompson's links
  {
    platform: 'Instagram',
    platformType: 'social',
    url: 'https://instagram.com/mikethompson',
    displayText: '@mikethompson',
    sortOrder: 1,
  },
  {
    platform: 'YouTube',
    platformType: 'social',
    url: 'https://youtube.com/@mikethompson',
    displayText: 'YouTube Channel',
    sortOrder: 2,
  },
];

async function seedDatabase() {
  console.log('🌱 Starting Drizzle database seeding...\n');

  try {
    // 1. Seed users
    console.log('👥 Seeding users...');
    const createdUsers = [];
    for (const userData of DEMO_USERS) {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, userData.clerkId))
        .limit(1);

      if (existingUser.length === 0) {
        const [user] = await db.insert(users).values(userData).returning();
        createdUsers.push(user);
        console.log(`  ✅ Created user: ${user.email} (${user.clerkId})`);
      } else {
        createdUsers.push(existingUser[0]);
        console.log(`  📍 User already exists: ${existingUser[0].email}`);
      }
    }

    // 2. Seed creator profiles
    console.log('\n🎭 Seeding creator profiles...');
    const createdProfiles = [];
    for (let i = 0; i < DEMO_PROFILES.length; i++) {
      const profileData = DEMO_PROFILES[i];
      const user = createdUsers[i];

      const existingProfile = await db
        .select()
        .from(creatorProfiles)
        .where(eq(creatorProfiles.username, profileData.username))
        .limit(1);

      if (existingProfile.length === 0) {
        const [profile] = await db
          .insert(creatorProfiles)
          .values({
            ...profileData,
            userId: user.id,
            usernameNormalized: profileData.username.toLowerCase(),
          })
          .returning();
        createdProfiles.push(profile);
        console.log(
          `  ✅ Created profile: ${profile.displayName} (@${profile.username})`
        );
      } else {
        createdProfiles.push(existingProfile[0]);
        console.log(
          `  📍 Profile already exists: @${existingProfile[0].username}`
        );
      }
    }

    // 3. Seed social links
    console.log('\n🔗 Seeding social links...');
    let linkIndex = 0;
    for (let i = 0; i < createdProfiles.length; i++) {
      const profile = createdProfiles[i];
      const profileLinks = [];

      // Assign different number of links per profile
      const linksPerProfile = i === 0 ? 3 : 2; // Tim gets 3 links, others get 2

      for (let j = 0; j < linksPerProfile; j++) {
        if (linkIndex < DEMO_SOCIAL_LINKS.length) {
          const linkData = DEMO_SOCIAL_LINKS[linkIndex];
          const [link] = await db
            .insert(socialLinks)
            .values({
              ...linkData,
              creatorProfileId: profile.id,
            })
            .returning();
          profileLinks.push(link);
          linkIndex++;
        }
      }

      console.log(
        `  ✅ Created ${profileLinks.length} social links for @${profile.username}`
      );
      profileLinks.forEach(link => {
        console.log(`    - ${link.platform}: ${link.displayText}`);
      });
    }

    console.log('\n🎉 Database seeding completed successfully!');

    // Verify the data
    console.log('\n🔍 Verification:');
    const userCount = await db.select().from(users);
    const profileCount = await db.select().from(creatorProfiles);
    const linkCount = await db.select().from(socialLinks);

    console.log(`  • Users: ${userCount.length}`);
    console.log(`  • Creator Profiles: ${profileCount.length}`);
    console.log(`  • Social Links: ${linkCount.length}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

async function main() {
  const branch =
    process.env.VERCEL_GIT_COMMIT_REF || process.env.GIT_BRANCH || 'local';
  console.log(`🔀 Detected branch: ${branch}`);

  if (branch === 'production') {
    console.log('⚠️  Skipping: will not seed production database');
    return;
  }

  await seedDatabase();
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

export { seedDatabase };
