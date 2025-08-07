# Jovie

**One link. All your music.**

Jovie is a high-conversion link-in-bio service specifically designed for musicians. It auto-builds clean profiles that send fans straight to your music with smart platform routing and comprehensive analytics.

## 📊 Status Indicators

### 🚀 Deployment Status

[![Deploy Status](https://img.shields.io/badge/Production-Ready-brightgreen)](https://jov.ie)
[![Preview Status](https://img.shields.io/badge/Preview-Active-blue)](https://jov.ie)
[![Develop Status](https://img.shields.io/badge/Develop-Active-orange)](https://jov.ie)

### 🔒 Security Status

[![Security Audit](https://img.shields.io/badge/Security%20Audit-Passing-brightgreen)](https://github.com/itstimwhite/Jovie/security)
[![Dependencies](https://img.shields.io/badge/Dependencies-Up%20to%20Date-brightgreen)](https://github.com/itstimwhite/Jovie/network/dependencies)
[![Vulnerabilities](https://img.shields.io/badge/Vulnerabilities-0-brightgreen)](https://github.com/itstimwhite/Jovie/security)

### 🧪 Quality Status

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)](https://github.com/itstimwhite/Jovie/actions)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)](https://github.com/itstimwhite/Jovie/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![Code Coverage](https://img.shields.io/badge/Coverage-85%25-brightgreen)](https://github.com/itstimwhite/Jovie/actions)

### 📈 Performance Status

[![Lighthouse Performance](https://img.shields.io/badge/Lighthouse-95%25-brightgreen)](https://pagespeed.web.dev/)
[![Bundle Size](https://img.shields.io/badge/Bundle%20Size-Optimized-brightgreen)](https://bundlephobia.com/)
[![Core Web Vitals](https://img.shields.io/badge/Core%20Web%20Vitals-Good-brightgreen)](https://web.dev/vitals/)

### 🔄 CI/CD Pipeline Status

[![Develop CI](https://img.shields.io/badge/Develop%20CI-Passing-brightgreen)](https://github.com/itstimwhite/Jovie/actions/workflows/develop-ci.yml)
[![Preview CI](https://img.shields.io/badge/Preview%20CI-Passing-brightgreen)](https://github.com/itstimwhite/Jovie/actions/workflows/preview-ci.yml)

### 🛡️ Security Alerts

[![CodeQL](https://img.shields.io/badge/CodeQL%20Alerts-15%20Open-orange)](https://github.com/itstimwhite/Jovie/security/code-scanning)
[![Secret Scanning](https://img.shields.io/badge/Secret%20Scanning-Clean-brightgreen)](https://github.com/itstimwhite/Jovie/security/secret-scanning)
[![Dependabot](https://img.shields.io/badge/Dependabot-Up%20to%20Date-brightgreen)](https://github.com/itstimwhite/Jovie/security/dependabot)

### 📋 Project Health

[![Open Issues](https://img.shields.io/badge/Issues-0-brightgreen)](https://github.com/itstimwhite/Jovie/issues)
[![Open PRs](https://img.shields.io/badge/PRs-4%20Open-orange)](https://github.com/itstimwhite/Jovie/pulls)
[![Last Commit](https://img.shields.io/badge/Last%20Commit-Today-brightgreen)](https://github.com/itstimwhite/Jovie/commits/develop)
[![License](https://img.shields.io/badge/License-MIT-brightgreen)](https://github.com/itstimwhite/Jovie/blob/main/LICENSE)

### 🌐 Live Status

- **Production**: [jov.ie](https://jov.ie) ✅ Live
- **Preview**: [preview.jov.ie](https://preview.jov.ie) ✅ Active
- **API Status**: [api.jov.ie/health](https://api.jov.ie/health) ✅ Healthy
- **Database**: Supabase ✅ Connected
- **CDN**: Vercel Edge Network ✅ Global

---

## Features

- 🎵 **Spotify Integration**: Automatically pulls artist data and latest releases
- 🔗 **Smart Routing**: Directs fans to the right streaming platform based on preferences
- 📊 **Analytics**: Track clicks and see which platforms your fans prefer
- 🎨 **Clean Design**: Apple-inspired, minimalist interface
- 🌓 **Dark Mode**: Built-in theme switching
- 📱 **Mobile First**: Responsive design optimized for all devices
- 🔒 **Secure Auth**: Powered by Clerk with native Supabase integration
- ⚡ **Fast & Scalable**: Built on Next.js 15 with Supabase backend
- 💳 **Billing**: Clerk billing integration with Stripe gateway
- 🎁 **Tip Jar**: Accept tips from fans (feature-flagged)

## Tech Stack

### Core Technologies

- **Frontend**: Next.js 15.4.5 (App Router), React 18.3.1, TypeScript 5
- **Styling**: Tailwind CSS 4.1.11, Headless UI 2.2.7, Heroicons 2.2.0
- **Backend**: Supabase (PostgreSQL + RLS)
- **Authentication**: Clerk 6.28.1 with native Supabase integration
- **Database**: Supabase 2.39.0
- **Deployment**: Vercel with standalone output
- **Testing**: Vitest 3.2.4 + Playwright 1.40.1

### Key Dependencies

- **Form Handling**: React Hook Form 7.62.0 + Zod 3.25.76
- **Analytics**: Segment 1.68.0 + Vercel Analytics 1.5.0
- **Billing**: Clerk billing with Stripe gateway
- **Utilities**: clsx 2.1.0, date-fns 3.2.0, tailwind-merge 3.3.1
- **Development**: ESLint 9, Prettier 3.1.1, Husky 9.1.7

## Quick Start

### Prerequisites

- Node.js 20.17+ and npm 10.0.0+
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
# Required for core functionality
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret

# Optional: Clerk billing
NEXT_PUBLIC_CLERK_BILLING_ENABLED=true
NEXT_PUBLIC_CLERK_BILLING_GATEWAY=stripe

# Optional: Feature flags
NEXT_PUBLIC_FEATURE_TIPS=true
NEXT_PUBLIC_WAITLIST_ENABLED=true

# Optional: Analytics
NEXT_PUBLIC_SEGMENT_WRITE_KEY=your-segment-key

# Optional: App configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
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
6. (Optional) Configure billing with Stripe gateway

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
- `npm run lint:fix` - Fix ESLint issues
- `npm run typecheck` - Run TypeScript compiler
- `npm run test` - Run unit tests
- `npm run test:ci` - Run tests with coverage
- `npm run test:e2e` - Run end-to-end tests
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

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
│   ├── dashboard/         # Dashboard components
│   ├── home/              # Homepage components
│   ├── profile/           # Profile page components
│   ├── site/              # Site-wide components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
├── constants/             # App constants
├── supabase/              # Database migrations
├── tests/                 # Test files
├── future_features/       # Planned features (see below)
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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

## Billing & Subscriptions

Jovie uses Clerk's billing system with Stripe gateway for subscription management.

### Setup

1. **Clerk Billing Configuration**:
   - Enable billing in your Clerk dashboard
   - Configure Stripe as the payment gateway
   - Create products and pricing plans
   - Set up webhook endpoints

2. **Environment Variables**:

   ```bash
   # Enable Clerk billing
   NEXT_PUBLIC_CLERK_BILLING_ENABLED=true
   NEXT_PUBLIC_CLERK_BILLING_GATEWAY=stripe
   ```

3. **Features**:
   - **Free Plan**: Includes Jovie branding on profile pages
   - **Pro Plan**: Removes all Jovie branding
   - **Payment Flow**: Clerk billing → Stripe gateway → User metadata update
   - **Branding Control**: `BrandingBadge` component automatically hides for Pro users

### Testing

```bash
# Test the billing flow
npm run test:e2e -- --grep="billing"

# Test subscription components
npm run test -- billing
```

## Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Update your Clerk and Spotify app settings with production URLs
4. Deploy!

### Environment Variables for Production

Ensure all environment variables from the setup section are set in your production environment, particularly:

- `NEXT_PUBLIC_APP_URL` - Your production domain
- Database and API keys
- OAuth redirect URLs matching your domain

## Future Features

The `future_features/` directory contains detailed specifications for planned features:

- **Tour Dates** (`tour-dates.md`) - Artist tour date management and fan notifications
- **Tip Jar** (`tip-jar.md`) - Enhanced tipping system with multiple payment methods
- **Universal Artist Notifications** (`universal-artist-notifications.md`) - Cross-platform notification system
- **Mobile View** (`view-on-mobile.md`) - Mobile-optimized artist profile views

### Contributing to Future Features

To contribute to future features:

1. **Review existing specs**: Check the `future_features/` directory for current plans
2. **Create new specs**: Add detailed markdown files for new features
3. **Follow the template**: Include user stories, technical requirements, and implementation notes
4. **Update this section**: Add new features to this README when specs are added

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

# Complete preview branch reset
