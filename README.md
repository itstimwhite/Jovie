# Jovie

**One link. All your music.**

Jovie is a high-conversion link-in-bio service specifically designed for musicians. It auto-builds clean profiles that send fans straight to your music with smart platform routing and comprehensive analytics.

## Features

- 🎵 **Spotify Integration**: Automatically pulls artist data and latest releases
- 🔗 **Smart Routing**: Directs fans to the right streaming platform based on preferences
- 📊 **Analytics**: Track clicks and see which platforms your fans prefer
- 🎨 **Clean Design**: Apple-inspired, minimalist interface
- 🌓 **Dark Mode**: Built-in theme switching
- 📱 **Mobile First**: Responsive design optimized for all devices
- 🔒 **Secure Auth**: Powered by Clerk with native Supabase integration
- ⚡ **Fast & Scalable**: Built on Next.js 14 with Supabase backend

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + RLS)
- **Auth**: Clerk with native Supabase integration
- **Analytics**: Segment integration
- **Deployment**: Vercel-ready
- **Testing**: Vitest + Playwright

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Supabase project
- Clerk application with Spotify social provider
- Spotify Developer App

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-org/jovie.git
cd jovie
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Fill in your actual values
```

4. Set up the database:

```bash
# Run the Supabase migrations
supabase db push
```

5. Start the development server:

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app in action.

### Environment Setup

#### Supabase

1. Create a new Supabase project
2. Run the migrations: `supabase db push`
3. Get your URL and anon key from the project settings
4. Configure Clerk as a third-party auth provider in Supabase dashboard

#### Clerk

1. Create a Clerk application
2. Enable Spotify as a social provider
3. Configure redirect URLs for your domain
4. Get your publishable and secret keys
5. Set up the Supabase integration in Clerk dashboard

#### Spotify

1. Create a Spotify Developer App
2. Add your domain to redirect URIs
3. Get your Client ID and Client Secret
4. Grant necessary scopes for artist data access

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run format` - Format code with Prettier

### Project Structure

```
jovie/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (marketing)/       # Public marketing pages
│   ├── [handle]/          # Artist profile pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── legal/             # Legal pages
├── components/            # React components
│   ├── auth/              # Auth-related components
│   ├── dashboard/         # Dashboard components
│   ├── profile/           # Profile page components
│   ├── site/              # Site-wide components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
├── constants/             # App constants
├── supabase/              # Database migrations
├── tests/                 # Test files
└── docs/                  # Legal documents
```

### Database Schema

The app uses Supabase with Row Level Security (RLS) enabled. Key tables:

- `users` - User accounts linked to Clerk IDs
- `artists` - Artist profiles with Spotify integration
- `social_links` - Social media links with click tracking
- `releases` - Music releases from Spotify
- `click_events` - Analytics and tracking data

### Authentication Flow

1. User signs in with Spotify via Clerk
2. First-time users go through onboarding to connect their Spotify artist profile
3. Artist data is ingested from Spotify API
4. User can customize their profile and add social links
5. Public profile is available at `/{handle}`

### Clerk-Supabase Integration

This project uses Clerk's native Supabase integration for secure authentication and data access:

#### Client-Side Integration

```typescript
import { useSession } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

function createClerkSupabaseClient() {
  const { session } = useSession();

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        return session?.getToken() ?? null;
      },
    }
  );
}
```

#### Server-Side Integration

```typescript
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

export function createServerSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      async accessToken() {
        return (await auth()).getToken();
      },
    }
  );
}
```

#### RLS Policies

```sql
-- Example RLS policy using auth.jwt()
create policy "User can view own data" on "users"
for select to authenticated using (
  auth.jwt()->>'sub' = user_id
);
```

For more details, see [CLERK_SUPABASE_INTEGRATION.md](CLERK_SUPABASE_INTEGRATION.md).

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Update your Clerk and Spotify app settings with production URLs
4. Deploy!

### Environment Variables for Production

Ensure all environment variables from `.env.example` are set in your production environment, particularly:

- `NEXT_PUBLIC_APP_URL` - Your production domain
- Database and API keys
- OAuth redirect URLs matching your domain

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Run the test suite: `npm run test && npm run test:e2e`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Style

- Follow the existing ESLint and Prettier configuration
- Use TypeScript for all new code
- Write tests for new features
- Follow the established component and naming patterns
- Use the native Clerk-Supabase integration (see `.cursorrules` for guidelines)

## AI Development Guidelines

This project includes comprehensive guidelines for AI coding tools:

- **CLAUDE.md** - Guidelines for Claude Code
- **.cursorrules** - Guidelines for Cursor and other AI tools
- **CLERK_SUPABASE_INTEGRATION.md** - Detailed integration documentation

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Open an issue on GitHub
- Check the documentation
- Contact us at support@jov.ie

---

Built with ❤️ for musicians everywhere.
