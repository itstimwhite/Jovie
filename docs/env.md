# Environment Variables

This document describes the environment variables used in the Jovie application.

## Database Configuration

### `DATABASE_URL`

Connection string for the PostgreSQL database. This can be either a standard PostgreSQL connection string or a Neon serverless connection string.

- **Format for standard PostgreSQL**: `postgresql://username:password@hostname:port/database`
- **Format for Neon serverless**: `postgresql+neon://username:password@hostname/database`

During the transition phase, this will point to the existing Supabase PostgreSQL database. In the future, it will be updated to point to Neon.

**Example:**

```
# For Supabase
DATABASE_URL=postgresql://postgres:password@db.project-id.supabase.co:5432/postgres

# For Neon (future)
DATABASE_URL=postgresql+neon://user:password@ep-cool-name-12345.us-east-1.aws.neon.tech/neondb
```

## Supabase Configuration

### `NEXT_PUBLIC_SUPABASE_URL`

The URL of your Supabase project.

**Example:** `https://your-project-id.supabase.co`

### `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The public/anon key for your Supabase project. This is used for client-side access.

## Clerk Authentication

### `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

The publishable key for Clerk authentication.

### `CLERK_SECRET_KEY`

The secret key for Clerk authentication.

## Application Configuration

### `NEXT_PUBLIC_APP_URL`

The public URL of your application.

**Default:** `https://jov.ie`

## Analytics

### `NEXT_PUBLIC_SEGMENT_WRITE_KEY`

The write key for Segment analytics.

### `NEXT_PUBLIC_POSTHOG_KEY`

The API key for PostHog analytics.

### `NEXT_PUBLIC_POSTHOG_HOST`

The host URL for PostHog analytics.

## Stripe Billing

### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

The publishable key for Stripe.

### `STRIPE_SECRET_KEY`

The secret key for Stripe.

### `STRIPE_WEBHOOK_SECRET`

The webhook secret for Stripe.

### `STRIPE_PRICE_INTRO_MONTHLY`

The price ID for the introductory monthly subscription.

### `STRIPE_PRICE_INTRO_YEARLY`

The price ID for the introductory yearly subscription.

### `STRIPE_PRICE_STANDARD_MONTHLY`

The price ID for the standard monthly subscription.

### `STRIPE_PRICE_STANDARD_YEARLY`

The price ID for the standard yearly subscription.

## Cloudinary Configuration

### `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

The cloud name for Cloudinary.

### `CLOUDINARY_API_KEY`

The API key for Cloudinary.

### `CLOUDINARY_API_SECRET`

The API secret for Cloudinary.

### `CLOUDINARY_UPLOAD_FOLDER`

The folder to upload files to in Cloudinary.

### `CLOUDINARY_UPLOAD_PRESET`

The upload preset for Cloudinary.

## Spotify Integration

### `SPOTIFY_CLIENT_ID`

The client ID for Spotify API.

### `SPOTIFY_CLIENT_SECRET`

The client secret for Spotify API.

## Feature Flags

### `NEXT_PUBLIC_FEATURE_TIPS`

Enable or disable the tips feature.

**Example:** `true`
