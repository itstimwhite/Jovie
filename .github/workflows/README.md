# GitHub Workflows

## Vercel Preview Deployments

### Consolidated Workflow

The `consolidated-vercel-preview.yml` workflow handles both Vercel preview deployments and aliasing in a single workflow. This consolidation was done to avoid duplicate PR comments from multiple workflows.

#### Features:

- Deploys to Vercel preview environment
- Creates custom aliases when `PREVIEW_ALIAS_DOMAIN` is configured
- Verifies that wildcard aliases resolve correctly
- Posts a single, comprehensive PR comment with both the Vercel URL and alias information
- Supports manual triggering via workflow_dispatch for specific PRs
- Maintains fork safety and concurrency controls

#### Triggers:

- Pull request events (opened, reopened, synchronize)
- Push events to non-production, non-preview branches
- Manual workflow dispatch with PR number input

#### Legacy Workflows

The previous split workflows `vercel-preview.yml` and `alias-preview.yml` have been removed during CI cleanup. `consolidated-vercel-preview.yml` is now the single source of truth for preview deploy, alias, and PR commenting.

#### Environment Variables:

- `PREVIEW_ALIAS_DOMAIN` - Repository variable for the base domain used for aliases (e.g., `preview.example.com`)

#### Secrets:

- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

## CI and Merge Queue

The main CI workflow `ci.yml` is the gatekeeper for PRs to `preview` and `production`. It includes fast checks (typecheck, lint) and full CI (build, unit, E2E). To support GitHub Merge Queue, `ci.yml` listens to the `merge_group` event so required status checks re-run in-queue before merging.
