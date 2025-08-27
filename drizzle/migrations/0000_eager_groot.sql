CREATE TYPE "public"."creator_type" AS ENUM('artist', 'podcaster', 'influencer', 'creator');--> statement-breakpoint
CREATE TYPE "public"."link_type" AS ENUM('listen', 'social', 'tip', 'other');--> statement-breakpoint
CREATE TABLE "creator_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"creator_type" "creator_type" NOT NULL,
	"username" text NOT NULL,
	"username_normalized" text NOT NULL,
	"display_name" text,
	"bio" text,
	"avatar_url" text,
	"spotify_url" text,
	"apple_music_url" text,
	"youtube_url" text,
	"spotify_id" text,
	"is_public" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"is_featured" boolean DEFAULT false,
	"marketing_opt_out" boolean DEFAULT false,
	"is_claimed" boolean DEFAULT false,
	"claim_token" text,
	"claimed_at" timestamp,
	"last_login_at" timestamp,
	"profile_views" integer DEFAULT 0,
	"onboarding_completed_at" timestamp,
	"settings" jsonb,
	"theme" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"creator_profile_id" uuid NOT NULL,
	"platform" text NOT NULL,
	"platform_type" text NOT NULL,
	"url" text NOT NULL,
	"display_text" text,
	"sort_order" integer DEFAULT 0,
	"clicks" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clerk_id" text NOT NULL,
	"email" text,
	"is_pro" boolean DEFAULT false,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"billing_updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "users_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
ALTER TABLE "creator_profiles" ADD CONSTRAINT "creator_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_links" ADD CONSTRAINT "social_links_creator_profile_id_creator_profiles_id_fk" FOREIGN KEY ("creator_profile_id") REFERENCES "public"."creator_profiles"("id") ON DELETE cascade ON UPDATE no action;