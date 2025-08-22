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
- Push events to non-main, non-preview branches
- Manual workflow dispatch with PR number input

#### Legacy Workflows:

The following workflows have been kept for reference but have their PR commenting functionality disabled:

1. `vercel-preview.yml` - Original workflow for Vercel deployments
2. `alias-preview.yml` - Original workflow for aliasing deployments

These workflows are maintained for backward compatibility but their PR commenting steps have been commented out to avoid duplication.

#### Environment Variables:

- `PREVIEW_ALIAS_DOMAIN` - Repository variable for the base domain used for aliases (e.g., `preview.example.com`)

#### Secrets:

- `VERCEL_TOKEN` - Vercel API token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `GITHUB_TOKEN` - Automatically provided by GitHub Actions

