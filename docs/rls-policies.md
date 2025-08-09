# Row Level Security (RLS) Documentation

## Overview

This document describes the Row Level Security (RLS) policies implemented for the Jovie application's database tables, specifically focusing on public read access to published artist data.

## RLS Policies

### Artists Table

#### Policy: `artists_public_read`

- **Description**: Allows public read access to published artists
- **Scope**: `SELECT` operations
- **Users**: `anon`, `authenticated`
- **Condition**: `published = true`

#### Policy: `Public can read published artists`

- **Description**: Additional policy ensuring public access to published artists (idempotent)
- **Scope**: `SELECT` operations
- **Users**: `anon`, `authenticated`
- **Condition**: `published IS TRUE`

#### Policy: `artists_owner_rw`

- **Description**: Full access for artist owners
- **Scope**: All operations (`INSERT`, `SELECT`, `UPDATE`, `DELETE`)
- **Users**: `authenticated` (owners only)
- **Condition**: User must be the owner of the artist record

### Social Links Table

#### Policy: `social_links_public_read`

- **Description**: Public read access to social links for published artists only
- **Scope**: `SELECT` operations
- **Users**: `anon`, `authenticated`
- **Condition**: `artist_id` must reference a published artist (`published = true`)

#### Policy: `social_links_by_artist_owner`

- **Description**: Full access for artist owners to their social links
- **Scope**: All operations (`INSERT`, `SELECT`, `UPDATE`, `DELETE`)
- **Users**: `authenticated` (owners only)
- **Condition**: User must own the artist associated with the social link

## Security Guarantees

### ✅ What is Allowed (Unauthenticated Users)

1. **Read published artists**: Anonymous users can query and retrieve all data for artists where `published = true`
2. **Read social links for published artists**: Anonymous users can access social media links and URLs for published artists
3. **Query operations**: Standard `SELECT` queries with filters, joins, and ordering

### ❌ What is Blocked (Unauthenticated Users)

1. **Read unpublished artists**: No access to artists where `published = false` or `NULL`
2. **Read social links for unpublished artists**: No access to social links associated with unpublished artists
3. **Write operations**: All `INSERT`, `UPDATE`, and `DELETE` operations are blocked
4. **Schema modifications**: No ability to alter table structure or policies

### 🔒 Authenticated User Access

- **Own artists**: Full CRUD access to their own artist records
- **Own social links**: Full CRUD access to social links for their artists
- **Other artists**: Same read-only access as anonymous users (published only)

## Implementation Details

### Database Grants

```sql
-- Schema visibility and read privileges
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Future tables default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon, authenticated;
```

### RLS Enablement

```sql
-- Enable RLS on all tables
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
```

## Testing

The RLS policies are tested in `tests/lib/rls-policies.test.ts` with the following coverage:

- ✅ Public read access to published artists
- ✅ Blocked access to unpublished artists
- ✅ Public read access to social links for published artists
- ✅ Blocked access to social links for unpublished artists
- ✅ Blocked write operations for unauthenticated users
- ✅ Proper error codes for security violations

## Migration Files

The RLS policies are implemented in the following migration files:

1. `20250805185558_initial_schema_and_seed_data.sql` - Initial RLS setup
2. `20250808133313_public_grants_and_artists_rls.sql` - Additional grants and policy refinements

## Error Handling

When RLS policies block access, the following error patterns are expected:

- **No rows returned**: Empty result sets for queries that would return unpublished data
- **RLS violations**: Error code `42501` for write operations by unauthorized users
- **Empty results**: Error code `PGRST116` when single record queries find no matches due to RLS

## Verification

To verify RLS is working correctly:

```bash
# Run RLS-specific tests
npm test tests/lib/rls-policies.test.ts

# Run all tests to ensure no regressions
npm test
```

The policies ensure that:

1. Public users can discover and view published artists and their social links
2. Unpublished artist data remains completely private
3. Write operations require proper authentication and ownership
4. The application can safely expose published artist data through public APIs
