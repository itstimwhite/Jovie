# Seeded Artist Data Verification

This directory contains tools to verify that seeded artist data exists and is queryable in your Supabase instance.

## Tools Available

### 1. Command Line Script

**Location**: `scripts/verify-seeded-data.js`

**Usage**:
```bash
node scripts/verify-seeded-data.js
```

**What it verifies**:
- ✅ Environment configuration (Supabase URL, anon key)
- ✅ Public read access to `artists` table (RLS verification)
- ✅ Public read access to `social_links` table (RLS verification)
- ✅ Profile page query pattern (joined data test)
- ✅ Image accessibility from Spotify CDN

### 2. Interactive Web Page

**Location**: `/verify-seeded-data` page in the Next.js app

**Usage**:
1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/verify-seeded-data`
3. View real-time test results
4. Use retry buttons to re-run individual tests

**Features**:
- Real-time environment configuration display
- Live database connectivity tests
- Interactive retry functionality
- Detailed error reporting with expandable details

## Environment Requirements

Both tools require these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

## Expected Results

When properly configured with seeded data, you should see:
- ✅ Environment Configuration
- ✅ Public Artist Access (RLS)
- ✅ Public Social Links Access (RLS)
- ✅ Profile Page Query Pattern
- ✅ Image Accessibility

## Troubleshooting

### "No published artists found"
- Check that your `artists` table has entries with `published = true`
- Verify RLS policies allow public read access to published artists

### "Fetch failed" errors
- Verify your Supabase instance is running
- Check that environment variables are correctly set
- Ensure your Supabase project is accessible

### "Image not accessible"
- This is expected if using placeholder/test images
- Spotify CDN images require valid Spotify artist image URLs

## Database Setup

To seed your database with test data:
1. Apply migrations: `npx supabase db push`
2. Run seed files: 
   - `supabase/seed_artists.sql`
   - `supabase/seed_social_links.sql`

## RLS Policies

The verification tools test that your RLS policies allow:
- Public read access to `artists` table where `published = true`
- Public read access to `social_links` table for published artists

Example policies:
```sql
-- Artists table - public read for published
CREATE POLICY "Public read published artists" ON artists
FOR SELECT USING (published = true);

-- Social links table - public read for published artists
CREATE POLICY "Public read social links" ON social_links
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM artists 
    WHERE artists.id = social_links.artist_id 
    AND artists.published = true
  )
);
```