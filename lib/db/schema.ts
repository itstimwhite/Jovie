import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

// Enums
export const creatorTypeEnum = pgEnum('creator_type', [
  'artist',
  'podcaster',
  'influencer',
  'creator',
]);
export const linkTypeEnum = pgEnum('link_type', [
  'listen',
  'social',
  'tip',
  'other',
]);
export const subscriptionPlanEnum = pgEnum('subscription_plan', [
  'free',
  'basic',
  'premium',
  'pro',
]);
export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'inactive',
  'cancelled',
  'past_due',
  'trialing',
  'incomplete',
  'incomplete_expired',
  'unpaid',
]);

export const currencyCodeEnum = pgEnum('currency_code', [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY',
  'CHF',
  'SEK',
  'NOK',
  'DKK',
]);

// Tables
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').unique().notNull(),
  email: text('email').unique(),
  isPro: boolean('is_pro').default(false),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  billingUpdatedAt: timestamp('billing_updated_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const creatorProfiles = pgTable('creator_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  creatorType: creatorTypeEnum('creator_type').notNull(),
  username: text('username').notNull(),
  usernameNormalized: text('username_normalized').notNull(),
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  spotifyUrl: text('spotify_url'),
  appleMusicUrl: text('apple_music_url'),
  youtubeUrl: text('youtube_url'),
  spotifyId: text('spotify_id'),
  isPublic: boolean('is_public').default(true),
  isVerified: boolean('is_verified').default(false),
  isFeatured: boolean('is_featured').default(false),
  marketingOptOut: boolean('marketing_opt_out').default(false),
  isClaimed: boolean('is_claimed').default(false),
  claimToken: text('claim_token'),
  claimedAt: timestamp('claimed_at'),
  lastLoginAt: timestamp('last_login_at'),
  profileViews: integer('profile_views').default(0),
  onboardingCompletedAt: timestamp('onboarding_completed_at'),
  settings: jsonb('settings').$type<Record<string, unknown>>().default({}),
  theme: jsonb('theme').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const socialLinks = pgTable('social_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  creatorProfileId: uuid('creator_profile_id')
    .notNull()
    .references(() => creatorProfiles.id, { onDelete: 'cascade' }),
  platform: text('platform').notNull(),
  platformType: text('platform_type').notNull(),
  url: text('url').notNull(),
  displayText: text('display_text'),
  sortOrder: integer('sort_order').default(0),
  clicks: integer('clicks').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const clickEvents = pgTable('click_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  creatorProfileId: uuid('creator_profile_id')
    .notNull()
    .references(() => creatorProfiles.id, { onDelete: 'cascade' }),
  linkId: uuid('link_id').references(() => socialLinks.id, {
    onDelete: 'set null',
  }),
  linkType: linkTypeEnum('link_type').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  country: text('country'),
  city: text('city'),
  deviceType: text('device_type'),
  os: text('os'),
  browser: text('browser'),
  isBot: boolean('is_bot').default(false),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const tips = pgTable('tips', {
  id: uuid('id').primaryKey().defaultRandom(),
  creatorProfileId: uuid('creator_profile_id')
    .notNull()
    .references(() => creatorProfiles.id, { onDelete: 'cascade' }),
  amountCents: integer('amount_cents').notNull(),
  currency: currencyCodeEnum('currency').notNull().default('USD'),
  paymentIntentId: text('payment_intent_id').notNull(),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  message: text('message'),
  isAnonymous: boolean('is_anonymous').default(false),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const signedLinkAccess = pgTable('signed_link_access', {
  id: uuid('id').primaryKey().defaultRandom(),
  linkId: text('link_id').notNull(),
  signedToken: text('signed_token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  isUsed: boolean('is_used').default(false),
  usedAt: timestamp('used_at'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const wrappedLinks = pgTable('wrapped_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  shortId: text('short_id').notNull().unique(),
  encryptedUrl: text('encrypted_url').notNull(),
  kind: text('kind').notNull(), // 'normal' | 'sensitive'
  domain: text('domain').notNull(),
  category: text('category'),
  titleAlias: text('title_alias'),
  clickCount: integer('click_count').default(0),
  createdBy: text('created_by'), // Clerk user ID
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Schema validations
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertCreatorProfileSchema = createInsertSchema(creatorProfiles);

export const selectCreatorProfileSchema = createSelectSchema(creatorProfiles);

export const insertSocialLinkSchema = createInsertSchema(socialLinks);
export const selectSocialLinkSchema = createSelectSchema(socialLinks);

export const insertClickEventSchema = createInsertSchema(clickEvents);

export const selectClickEventSchema = createSelectSchema(clickEvents);

export const insertTipSchema = createInsertSchema(tips);

export const selectTipSchema = createSelectSchema(tips);

export const insertSignedLinkAccessSchema =
  createInsertSchema(signedLinkAccess);
export const selectSignedLinkAccessSchema =
  createSelectSchema(signedLinkAccess);

export const insertWrappedLinkSchema = createInsertSchema(wrappedLinks);
export const selectWrappedLinkSchema = createSelectSchema(wrappedLinks);

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type CreatorProfile = typeof creatorProfiles.$inferSelect;
export type NewCreatorProfile = typeof creatorProfiles.$inferInsert;

export type SocialLink = typeof socialLinks.$inferSelect;
export type NewSocialLink = typeof socialLinks.$inferInsert;

export type ClickEvent = typeof clickEvents.$inferSelect;
export type NewClickEvent = typeof clickEvents.$inferInsert;

export type Tip = typeof tips.$inferSelect;
export type NewTip = typeof tips.$inferInsert;

export type SignedLinkAccess = typeof signedLinkAccess.$inferSelect;
export type NewSignedLinkAccess = typeof signedLinkAccess.$inferInsert;

export type WrappedLink = typeof wrappedLinks.$inferSelect;
export type NewWrappedLink = typeof wrappedLinks.$inferInsert;
