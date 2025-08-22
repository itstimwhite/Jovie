# Jovie

Jovie is a Next.js 14 application with Clerk authentication and Supabase database integration.

## Getting Started

### Prerequisites

- Node.js >= 20.17
- npm >= 10.0.0 (or pnpm/yarn)
- Supabase account (for database)
- Clerk account (for authentication)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Copy the environment variables:

```bash
cp .env.example .env.local
```

4. Update the environment variables with your Supabase and Clerk credentials

5. Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

## Database Management

### Migrations

To run database migrations:

```bash
npm run db:migrate
# or
pnpm db:migrate
# or
yarn db:migrate
```

### Data Seeding

The project includes several data seeding scripts for different purposes:

#### Basic Preview Data Seed

Seeds minimal data for MVP flows in the Preview environment:

```bash
npm run db:seed
# or
pnpm db:seed
# or
yarn db:seed
```

This script:

- Only runs on the `preview` branch or in local development
- Creates one creator profile with Venmo link and social/DSP links
- Seeds an unclaimed artist profile
- Is idempotent (can be run multiple times without duplicating data)
- Respects environment guards (won't run in production)

#### Enhanced Profiles Seed

Seeds more comprehensive data for testing:

```bash
npm run db:seed-enhanced
# or
pnpm db:seed-enhanced
# or
yarn db:seed-enhanced
```

#### Tim User Seed

Seeds a specific user profile for development:

```bash
npm run db:seed-tim
# or
pnpm db:seed-tim
# or
yarn db:seed-tim
```

### Resetting Seed Data

To reset seed data in your local Supabase instance:

1. Truncate the tables you want to reset:

```sql
TRUNCATE TABLE creator_profiles CASCADE;
TRUNCATE TABLE app_users CASCADE;
TRUNCATE TABLE social_links CASCADE;
```

2. Run the seed script again:

```bash
npm run db:seed
```

## Testing

### Unit Tests

```bash
npm run test
# or
npm run test:watch
```

### E2E Tests

```bash
npm run test:e2e
```

## Deployment

The application is deployed on Vercel with the following branches:

- `main`: Production environment
- `preview`: Preview/staging environment
- `develop`: Development environment

## License

[MIT](LICENSE)
