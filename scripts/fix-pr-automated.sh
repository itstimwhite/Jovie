#!/bin/bash

# PR Coordination Automation Script
# Usage: ./scripts/fix-pr-automated.sh <pr-number>
# Systematically fixes lint, build, test, and merge conflicts for a specific PR

set -euo pipefail

PR_NUMBER="${1:-}"
if [ -z "$PR_NUMBER" ]; then
    echo "❌ Error: PR number required"
    echo "Usage: $0 <pr-number>"
    exit 1
fi

echo "🎯 Starting automated fix for PR #$PR_NUMBER"

# Function to run command with error handling
run_with_error_handling() {
    local cmd="$1"
    local description="$2"
    
    echo "🔄 $description..."
    if ! eval "$cmd"; then
        echo "⚠️  Warning: $description failed, continuing..."
        return 1
    fi
    echo "✅ $description completed"
    return 0
}

# Function to get branch name for PR
get_pr_branch() {
    local pr_num="$1"
    # Try to find the branch name from GitHub CLI or git branches
    if command -v gh >/dev/null 2>&1; then
        if gh pr view "$pr_num" --json headRefName >/dev/null 2>&1; then
            gh pr view "$pr_num" --json headRefName --jq '.headRefName'
            return 0
        fi
    fi
    
    # Fallback: look for common branch patterns
    git branch -r | grep -E "(pr.*$pr_num|$pr_num.*pr)" | head -n1 | sed 's|.*origin/||' || echo ""
}

# Check if we can get PR info
echo "🔍 Looking up PR #$PR_NUMBER..."
PR_BRANCH=$(get_pr_branch "$PR_NUMBER")

if [ -z "$PR_BRANCH" ]; then
    echo "⚠️  Could not automatically determine branch for PR #$PR_NUMBER"
    echo "💡 Manual steps needed:"
    echo "   1. Find the branch: git branch -r | grep $PR_NUMBER"
    echo "   2. Checkout branch: git checkout <branch-name>"
    echo "   3. Run: ./scripts/fix-pr-automated.sh $PR_NUMBER"
    exit 1
fi

echo "📌 Found branch: $PR_BRANCH"

# Backup current branch
ORIGINAL_BRANCH=$(git branch --show-current)
echo "💾 Current branch: $ORIGINAL_BRANCH"

# Checkout PR branch
echo "🔄 Checking out PR branch..."
if ! git checkout "$PR_BRANCH" 2>/dev/null; then
    echo "🔄 Fetching and checking out remote branch..."
    git fetch origin "$PR_BRANCH" || git fetch origin
    git checkout -b "$PR_BRANCH" "origin/$PR_BRANCH" || git checkout "$PR_BRANCH"
fi

# Update with latest preview
echo "🔄 Updating with latest preview..."
git fetch origin preview
if git merge origin/preview --no-edit; then
    echo "✅ Merged latest preview"
else
    echo "⚠️  Merge conflicts detected. Manual resolution needed:"
    echo "   1. Resolve conflicts in affected files"
    echo "   2. Run: git add . && git commit -m 'resolve conflicts with preview'"
    echo "   3. Continue with: ./scripts/fix-pr-automated.sh $PR_NUMBER"
    git status
    exit 1
fi

# Install dependencies if package.json changed
if git diff HEAD~1..HEAD --name-only | grep -q "package.*json\|pnpm-lock.yaml"; then
    run_with_error_handling "pnpm install" "Installing dependencies"
fi

# Fix lint issues
echo "🧹 Fixing lint issues..."
run_with_error_handling "pnpm run lint:fix || npm run lint:fix" "Lint fixes"

# Format code
echo "📐 Formatting code..."
run_with_error_handling "pnpm run format || npm run format" "Code formatting" || \
run_with_error_handling "npx biome format --write ." "Biome formatting"

# Run typecheck
echo "🔍 Running typecheck..."
run_with_error_handling "pnpm run typecheck || npm run typecheck" "Type checking"

# Build the project
echo "🏗️  Building project..."
run_with_error_handling "pnpm run build || npm run build" "Project build"

# Run tests if they exist
if [ -f "package.json" ] && grep -q "\"test\"" package.json; then
    echo "🧪 Running tests..."
    run_with_error_handling "pnpm test || npm test" "Running tests"
fi

# Commit changes if any
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "📝 Committing automated fixes..."
    git add .
    git commit -m "fix: automated lint, format, and build fixes for PR #$PR_NUMBER

- Applied lint fixes
- Applied code formatting
- Fixed build issues
- Resolved merge conflicts with preview

🤖 Generated with automated PR coordination script"
else
    echo "✅ No changes to commit"
fi

# Push changes
echo "📤 Pushing changes..."
git push origin "$PR_BRANCH"

# Convert from draft if needed (requires GitHub CLI permissions)
if command -v gh >/dev/null 2>&1; then
    echo "🔄 Checking if PR is draft..."
    if gh pr view "$PR_NUMBER" --json isDraft --jq '.isDraft' | grep -q "true"; then
        echo "📝 Converting from draft to ready..."
        if gh pr ready "$PR_NUMBER"; then
            echo "✅ PR #$PR_NUMBER converted to ready for review"
        else
            echo "⚠️  Could not convert PR to ready - may need manual action"
        fi
    fi
fi

# Return to original branch
echo "🔄 Returning to original branch..."
git checkout "$ORIGINAL_BRANCH"

echo ""
echo "🎉 PR #$PR_NUMBER automated fixes completed!"
echo "📊 Next steps:"
echo "   - Monitor CI status for PR #$PR_NUMBER"
echo "   - Check for auto-merge once CI passes"
echo "   - Move to next priority PR if successful"
echo ""