# Contributing to Jovie

## ⚠️ CRITICAL: BRANCH PROTECTION RULES

### **NEVER PUSH TO PREVIEW OR MAIN**

- **ONLY push to `develop` branch**
- **NEVER push directly to `preview` or `main` branches**
- The CI/CD pipeline handles all promotions automatically
- If pipeline is stuck, fix issues on `develop` and let CI handle the rest
- Direct pushes to protected branches will be rejected and can break the pipeline

### **Branch Protection**

- `preview` and `main` are protected branches
- All changes must go through the CI/CD pipeline
- Auto-promote workflows handle `develop → preview → main` progression
- Manual intervention should only be done on `develop` branch

## Development Workflow

### Before Making Changes

1. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```
2. Make sure your local develop branch is up to date:
   ```bash
   git checkout develop
   git pull upstream develop
   ```

### Making Changes

1. Make your changes following our coding standards (see below)
2. Add tests for new functionality
3. Ensure all tests pass:
   ```bash
   npm run test
   npm run test:e2e
   ```
4. Run linting and type checking:
   ```bash
   npm run lint
   npm run typecheck
   ```
5. Format your code:
   ```bash
   npm run format
   ```

### Submitting Changes

1. Commit your changes with a descriptive message:
   ```bash
   git add .
   git commit -m "feat: add new artist profile customization options"
   ```
2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Create a Pull Request on GitHub targeting the `develop` branch

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use proper generics where applicable

### React/Next.js

- Use functional components with hooks
- Follow the established component structure
- Use proper prop types
- Implement proper error boundaries where needed

### CSS/Styling

- Use Tailwind CSS classes
- Follow the established design system
- Ensure responsive design

### Clerk-Supabase Integration

**CRITICAL**: This project uses Clerk's native Supabase integration. Follow these guidelines:

#### ✅ DO Use Native Integration

```typescript
// Client-side integration
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

```typescript
// Server-side integration
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

#### ❌ DON'T Use JWT Templates (Deprecated)

```typescript
// ❌ DO NOT use JWT templates
const token = await getToken({ template: 'supabase' });
```

#### RLS Policies

Always use `auth.jwt()` for user identification in RLS policies:

```sql
-- ✅ CORRECT: Use auth.jwt() for RLS
create policy "User can view own data" on "users"
for select to authenticated using (
  auth.jwt()->>'sub' = user_id
);
```

### Database Operations

- Always enable RLS on user data tables
- Use proper RLS policies for data isolation
- Test with multiple users to verify data isolation
- Use migrations for database schema changes

### Error Handling

- Always handle Supabase errors gracefully
- Provide meaningful error messages to users
- Log errors appropriately for debugging
- Use proper loading states

## AI Development Guidelines

This project includes comprehensive guidelines for AI coding tools:

### For Claude Code (claude.ai/code)

- See [CLAUDE.md](CLAUDE.md) for detailed guidelines
- Follow the Clerk-Supabase integration patterns
- Use the established component structure

### For Cursor and Other AI Tools

- See [.cursorrules](.cursorrules) for guidelines
- Follow the native integration approach
- Maintain security best practices

### For All AI Tools

- Reference [CLERK_SUPABASE_INTEGRATION.md](CLERK_SUPABASE_INTEGRATION.md) for detailed integration documentation
- Use the latest patterns from Clerk's official documentation
- Avoid deprecated approaches (JWT templates, etc.)

## Testing Guidelines

### Unit Tests

- Use Vitest for component testing
- Test both success and error scenarios
- Mock Supabase calls appropriately
- Test RLS policy compliance

### E2E Tests

- Use Playwright for end-to-end testing
- Test authentication flows
- Verify data isolation between users
- Test responsive design

### Database Tests

- Test RLS policies with multiple users
- Verify data access controls
- Test migration scripts
- Validate foreign key relationships

## Security Guidelines

1. **Never expose sensitive data** in client-side code
2. **Always use RLS policies** for user data
3. **Validate user permissions** before database operations
4. **Use environment variables** for all secrets
5. **Test authentication flows** thoroughly
6. **Verify data isolation** between users

## Commit Message Guidelines

Use conventional commit messages:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:

```
feat: add artist profile customization options
fix: resolve authentication token refresh issue
docs: update Clerk-Supabase integration guide
```

## Pull Request Guidelines

### Before Submitting

1. **Test thoroughly** with multiple users
2. **Verify RLS policies** work correctly
3. **Check authentication flow** end-to-end
4. **Run all tests** and ensure they pass
5. **Update documentation** if needed

### PR Labels

- **`full-ci`**: Add this label to run the full CI suite (including tests and build)
- **`ci:skip`**: Add this label to skip non-policy CI checks (useful for documentation-only changes or when CI is not needed)
  - Note: Policy checks (`pr-policy` and `up-to-date-with-preview`) will still run even with this label
  - This is useful for minor changes, documentation updates, or emergency fixes where CI is not necessary

### PR Description

Include:

- Description of changes
- Testing performed
- Screenshots if UI changes
- Any breaking changes
- Migration steps if database changes

### Review Process

- All PRs require review
- Tests must pass
- Code must follow established patterns
- Security implications must be considered

## Environment Setup

### Required Environment Variables

```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key

# Spotify
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
```

### Local Development

1. Set up Supabase project
2. Configure Clerk application
3. Set up Spotify Developer App
4. Run database migrations
5. Start development server

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Clerk configuration
   - Verify Supabase integration setup
   - Test with fresh browser session

2. **Database access denied**
   - Verify RLS policies are correct
   - Check user authentication status
   - Test with different users

3. **Environment variables missing**
   - Check `.env.local` file
   - Verify all required variables are set
   - Restart development server

### Getting Help

- Check existing documentation
- Review AI guidelines for patterns
- Open an issue on GitHub
- Contact the maintainers

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Follow the established patterns
- Contribute to documentation
- Report bugs and security issues

Thank you for contributing to Jovie! 🎵
