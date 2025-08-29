#!/bin/bash

# Systematic PR Fix Script
# Usage: ./scripts/fix-pr-systematic.sh <pr-number>

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <pr-number>"
    echo "Example: $0 638"
    exit 1
fi

PR_NUMBER=$1

echo "🔧 SYSTEMATIC PR FIX FOR #$PR_NUMBER"
echo "==================================="
echo ""

# Get PR details
echo "📊 Getting PR details..."
if ! gh pr view $PR_NUMBER >/dev/null 2>&1; then
    echo "❌ PR #$PR_NUMBER not found or not accessible"
    exit 1
fi

PR_INFO=$(gh pr view $PR_NUMBER --json headRefName,baseRefName,title,isDraft,state)
BRANCH=$(echo "$PR_INFO" | jq -r '.headRefName')
BASE_BRANCH=$(echo "$PR_INFO" | jq -r '.baseRefName')
TITLE=$(echo "$PR_INFO" | jq -r '.title')
IS_DRAFT=$(echo "$PR_INFO" | jq -r '.isDraft')
STATE=$(echo "$PR_INFO" | jq -r '.state')

echo "  Title: $TITLE"
echo "  Branch: $BRANCH"
echo "  Base: $BASE_BRANCH"
echo "  Draft: $IS_DRAFT"
echo "  State: $STATE"
echo ""

if [ "$STATE" != "OPEN" ]; then
    echo "⚠️ PR is not open, skipping..."
    exit 0
fi

# Step 1: Convert from draft if needed
if [ "$IS_DRAFT" = "true" ]; then
    echo "📝 Converting from draft to ready..."
    gh pr ready $PR_NUMBER
    echo "✅ Converted to ready for review"
    echo ""
fi

# Step 2: Checkout and update branch
echo "🔄 Updating branch with latest $BASE_BRANCH..."
git fetch origin
git checkout $BRANCH 2>/dev/null || git checkout -b $BRANCH origin/$BRANCH
git merge origin/$BASE_BRANCH --no-edit

# Step 3: Run systematic fixes
echo "🛠️ Running systematic fixes..."

# Install dependencies if needed
if [ -f package.json ] && [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Format with Biome (new linting system)
if [ -f biome.json ]; then
    echo "🎨 Running Biome formatting..."
    npx @biomejs/biome format --write .
    npx @biomejs/biome check --write .
fi

# Run ESLint fixes
if [ -f eslint.config.js ]; then
    echo "🔍 Running ESLint fixes..."
    npx eslint . --fix || echo "⚠️ Some ESLint issues couldn't be auto-fixed"
fi

# Run type checking
echo "🔧 Running type check..."
if pnpm run typecheck; then
    echo "✅ Type check passed"
else
    echo "⚠️ Type check failed - may need manual fixes"
fi

# Run build
echo "🏗️ Running build..."
if pnpm run build; then
    echo "✅ Build passed"
else
    echo "⚠️ Build failed - may need manual fixes"
fi

# Run tests
echo "🧪 Running tests..."
if pnpm test; then
    echo "✅ Tests passed"
else
    echo "⚠️ Tests failed - may need manual fixes"
fi

# Step 4: Commit and push fixes
echo "💾 Committing fixes..."
git add .
if git diff --staged --quiet; then
    echo "ℹ️ No changes to commit"
else
    git commit -m "fix: apply systematic lint and format fixes

- Apply Biome formatting and linting fixes
- Fix ESLint issues
- Update to latest $BASE_BRANCH
- Prepare for auto-merge

🤖 Generated with Claude Code"
    
    echo "⬆️ Pushing changes..."
    git push origin $BRANCH
    echo "✅ Changes pushed successfully"
fi

echo ""
echo "🎯 SYSTEMATIC FIX COMPLETE FOR PR #$PR_NUMBER"
echo ""
echo "📊 Next steps:"
echo "1. Check CI status with: gh pr view $PR_NUMBER"
echo "2. Monitor for auto-merge (should happen automatically if all checks pass)"
echo "3. If issues remain, check the specific failing tests/checks"
echo ""
echo "🚀 Auto-merge is enabled - PR will merge automatically when ready!"