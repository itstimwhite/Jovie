# Supabase Database Setup

This directory contains the database schema migrations and seed data for the Jovie application.

## Quick Start

```bash
# Start local Supabase services
supabase start

# Apply all migrations and seed data
supabase db reset
```

## Files Structure

```
supabase/
├── config.toml              # Supabase configuration
├── migrations/              # Database migrations
├── seed.sql                 # Main seed file (used by config)
├── seed_artists.sql         # Individual artist seed data
├── seed_social_links.sql    # Individual social links seed data
├── seed_releases.sql        # Individual releases seed data
└── README.md               # This file
```

## Seed Data

The `seed.sql` file contains comprehensive test data for local development:

### Artists (10 total, all published)

- **Lady Gaga** - `/ladygaga`
- **David Guetta** - `/davidguetta`
- **Billie Eilish** - `/billieeilish`
- **Marshmello** - `/marshmello`
- **Rihanna** - `/rihanna`
- **Calvin Harris** - `/calvinharris`
- **Sabrina Carpenter** - `/sabrinacarpenter`
- **The Chainsmokers** - `/thechainsmokers`
- **Dua Lipa** - `/dualipa`
- **Tim White** - `/tim` (verified artist)

### Social Links

Each artist has multiple social platforms:

- Spotify (real artist pages)
- Apple Music (real artist pages)
- Instagram, Twitter, TikTok (demo URLs)
- Tim White includes additional: YouTube, Website

### Sample Data

- Music releases for each artist
- Sample click events for analytics

## Running Seeds

### Automatic (Recommended)

```bash
# This runs migrations + seeds automatically
supabase db reset
```

### Manual

```bash
# Run only migrations
supabase db push

# Then run seeds manually
psql -h localhost -p 54322 -U postgres -d postgres -f seed.sql
```

### Individual Seed Files

If you want to run specific parts:

```bash
# Artists only
psql -h localhost -p 54322 -U postgres -d postgres -f seed_artists.sql

# Social links only
psql -h localhost -p 54322 -U postgres -d postgres -f seed_social_links.sql

# Releases only
psql -h localhost -p 54322 -U postgres -d postgres -f seed_releases.sql
```

## Configuration

The `config.toml` file is configured to:

- Enable seeding: `[db.seed] enabled = true`
- Use `seed.sql` as the main seed file: `sql_paths = ["./seed.sql"]`

## Testing

After seeding, test these URLs:

- http://localhost:3000/tim - Verified artist with all social links
- http://localhost:3000/ladygaga - Popular artist profile
- http://localhost:3000/billieeilish - Another complete profile

## Troubleshooting

### Seeds not running?

1. Check `config.toml` has seeding enabled
2. Ensure `seed.sql` exists
3. Run `supabase db reset` instead of `supabase db push`

### Database connection issues?

```bash
# Check if Supabase is running
supabase status

# Start if not running
supabase start
```

### Want to start fresh?

```bash
# Stop, reset, and restart everything
supabase stop
supabase db reset
```
