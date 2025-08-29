#!/bin/bash

# PR Fix Automation Script
# Usage: ./scripts/fix-pr.sh <pr-branch-name>

set -e

if [ -z "$1" ]; then
    echo "❌ Usage: $0 <pr-branch-name>"
    echo "   Example: $0 feature/new-dashboard"
    exit 1
fi

PR_BRANCH="$1"

echo "🔧 Fixing PR branch: $PR_BRANCH"

# Check if branch exists
if ! git show-ref --verify --quiet refs/remotes/origin/$PR_BRANCH; then
    echo "❌ Branch origin/$PR_BRANCH does not exist"
    exit 1
fi

# Save current branch
CURRENT_BRANCH=$(git branch --show-current)

# Checkout PR branch
echo "📦 Checking out $PR_BRANCH..."
git checkout $PR_BRANCH 2>/dev/null || git checkout -b $PR_BRANCH origin/$PR_BRANCH

# Update with preview
echo "🔄 Updating branch with preview..."
git fetch origin preview
git merge origin/preview --no-edit

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    pnpm install
fi

# Run fixes in order of priority
echo "🔍 Running lint fixes..."
pnpm run lint:fix || echo "⚠️ Lint fix had issues"

echo "🎨 Running format..."
pnpm run format || echo "⚠️ Format had issues"

echo "⚡ Running typecheck..."
if ! pnpm run typecheck; then
    echo "❌ TypeScript errors found. Please fix manually."
    echo "💡 Common fixes:"
    echo "   - Check import/export statements"
    echo "   - Verify type annotations" 
    echo "   - Check for undefined variables"
    exit 1
fi

echo "🏗️ Running build test..."
if ! pnpm run build; then
    echo "❌ Build failed. Please fix manually."
    echo "💡 Check the build output above for specific errors"
    exit 1
fi

echo "🧪 Running tests..."
if ! pnpm run test; then
    echo "❌ Tests failed. Please fix manually."
    echo "💡 Common test fixes:"
    echo "   - Update snapshots if UI changed"
    echo "   - Fix broken assertions"
    echo "   - Check mock implementations"
    exit 1
fi

# Commit changes if any
if ! git diff --quiet; then
    echo "💾 Committing fixes..."
    git add .
    git commit -m "fix: resolve lint, format, and build issues

- Auto-fixed linting and formatting issues
- Resolved build and test errors
- Updated branch with latest preview

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-authored-by: Tim White <itstimwhite@users.noreply.github.com>"
    
    echo "📤 Pushing changes..."
    git push origin $PR_BRANCH
    echo "✅ Changes pushed successfully"
else
    echo "✨ No changes needed - PR is already in good state!"
fi

# Return to original branch
git checkout $CURRENT_BRANCH

echo ""
echo "🎉 PR $PR_BRANCH is now ready for auto-merge!"
echo "📋 Next steps:"
echo "   1. Check PR has 'auto-merge' label"
echo "   2. Remove any blocking labels (blocked, human-review, etc.)"
echo "   3. Auto-merge workflow will handle the rest"
echo ""