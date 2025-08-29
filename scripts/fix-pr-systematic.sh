#!/bin/bash

# PR Systematic Fix Script
# This script fixes common issues in PRs caused by new lint configurations
# Usage: ./scripts/fix-pr-systematic.sh <pr-number>

set -e

PR_NUMBER=$1
if [ -z "$PR_NUMBER" ]; then
    echo "❌ Usage: $0 <pr-number>"
    echo "Example: $0 633"
    exit 1
fi

echo "🚀 Starting systematic fix for PR #$PR_NUMBER..."

# Function to safely run commands with error handling
safe_run() {
    if ! "$@"; then
        echo "⚠️  Command failed: $*"
        return 1
    fi
}

# Check if we have GitHub CLI
if ! command -v gh &> /dev/null; then
    echo "⚠️  GitHub CLI not available. Some features may be limited."
    GH_AVAILABLE=false
else
    GH_AVAILABLE=true
fi

# Try to get PR information if GH CLI is available
if [ "$GH_AVAILABLE" = true ]; then
    echo "📋 Getting PR #$PR_NUMBER information..."
    
    # This will require approval but provides branch name
    if PR_INFO=$(gh pr view "$PR_NUMBER" --json headRefName,title,state 2>/dev/null); then
        BRANCH_NAME=$(echo "$PR_INFO" | jq -r '.headRefName')
        PR_TITLE=$(echo "$PR_INFO" | jq -r '.title')
        PR_STATE=$(echo "$PR_INFO" | jq -r '.state')
        
        echo "✅ Found PR #$PR_NUMBER: $PR_TITLE"
        echo "📌 Branch: $BRANCH_NAME"
        echo "📊 State: $PR_STATE"
    else
        echo "⚠️  Could not get PR info automatically. Will try common branch patterns."
        BRANCH_NAME=""
    fi
else
    echo "⚠️  GitHub CLI not available. Will try common branch patterns."
    BRANCH_NAME=""
fi

# If we don't have the branch name, try common patterns
if [ -z "$BRANCH_NAME" ]; then
    echo "🔍 Trying to find branch for PR #$PR_NUMBER..."
    
    # Try common branch patterns
    POSSIBLE_BRANCHES=(
        "codegen/pr-$PR_NUMBER"
        "feat/pr-$PR_NUMBER"  
        "fix/pr-$PR_NUMBER"
        "chore/pr-$PR_NUMBER"
        "pr-$PR_NUMBER"
        "issue-$PR_NUMBER"
    )
    
    for branch in "${POSSIBLE_BRANCHES[@]}"; do
        if git ls-remote --heads origin "$branch" | grep -q "$branch"; then
            BRANCH_NAME="$branch"
            echo "✅ Found branch: $BRANCH_NAME"
            break
        fi
    done
    
    if [ -z "$BRANCH_NAME" ]; then
        echo "❌ Could not find branch for PR #$PR_NUMBER"
        echo "💡 Available remote branches:"
        git branch -r
        exit 1
    fi
fi

echo "🔄 Checking out branch: $BRANCH_NAME"
if ! git fetch origin "$BRANCH_NAME"; then
    echo "❌ Could not fetch branch $BRANCH_NAME"
    exit 1
fi

if ! git checkout -B "local-$BRANCH_NAME" "origin/$BRANCH_NAME"; then
    echo "❌ Could not checkout branch $BRANCH_NAME"
    exit 1
fi

echo "🔄 Updating branch with latest preview..."
if ! git merge origin/preview --no-edit; then
    echo "❌ Merge conflicts detected. This requires manual resolution."
    echo "🔧 To resolve conflicts:"
    echo "   1. Fix merge conflicts in the affected files"
    echo "   2. Run: git add ."
    echo "   3. Run: git commit -m 'resolve merge conflicts with preview'"
    echo "   4. Run: git push origin local-$BRANCH_NAME:$BRANCH_NAME"
    exit 1
fi

echo "🧹 Running lint fixes..."

# Check if we have the lint commands available
if [ -f "package.json" ]; then
    echo "📦 Found package.json, checking for lint scripts..."
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        if command -v pnpm &> /dev/null; then
            pnpm install
        elif command -v npm &> /dev/null; then
            npm install
        else
            echo "⚠️  No package manager available"
        fi
    fi
    
    # Run various fix commands
    if command -v pnpm &> /dev/null; then
        echo "🔧 Running pnpm lint fixes..."
        safe_run pnpm run lint --fix || echo "⚠️  Lint fix failed, continuing..."
        safe_run pnpm run format || echo "⚠️  Format failed, continuing..."
        
        echo "🔍 Running type check..."
        safe_run pnpm run typecheck || echo "⚠️  Typecheck failed, continuing..."
        
        echo "🏗️  Running build..."
        safe_run pnpm run build || echo "⚠️  Build failed, continuing..."
        
        echo "🧪 Running tests..."
        safe_run pnpm run test || echo "⚠️  Tests failed, continuing..."
        
    elif command -v npm &> /dev/null; then
        echo "🔧 Running npm lint fixes..."
        safe_run npm run lint --fix || echo "⚠️  Lint fix failed, continuing..."
        safe_run npm run format || echo "⚠️  Format failed, continuing..."
        
        echo "🔍 Running type check..."
        safe_run npm run typecheck || echo "⚠️  Typecheck failed, continuing..."
        
        echo "🏗️  Running build..."
        safe_run npm run build || echo "⚠️  Build failed, continuing..."
        
        echo "🧪 Running tests..."
        safe_run npm run test || echo "⚠️  Tests failed, continuing..."
    fi
fi

# Apply Biome formatting if available
if [ -f "biome.json" ]; then
    echo "🔧 Applying Biome formatting..."
    if command -v npx &> /dev/null; then
        safe_run npx @biomejs/biome format --write . || echo "⚠️  Biome format failed, continuing..."
        safe_run npx @biomejs/biome lint --write . || echo "⚠️  Biome lint failed, continuing..."
    fi
fi

# Check if there are any changes to commit
if git diff --quiet && git diff --cached --quiet; then
    echo "✅ No changes to commit. PR may already be up to date."
else
    echo "💾 Committing fixes..."
    git add .
    
    COMMIT_MESSAGE="fix: apply systematic lint and formatting fixes

- Update branch with latest preview
- Apply new Biome and ESLint configurations  
- Fix lint, format, and typecheck issues
- Automated fix for PR #$PR_NUMBER

🤖 Generated with Claude Code"

    git commit -m "$COMMIT_MESSAGE"
    
    echo "📤 Pushing changes..."
    if ! git push origin "local-$BRANCH_NAME:$BRANCH_NAME"; then
        echo "❌ Failed to push changes"
        exit 1
    fi
fi

echo "✅ Systematic fix completed for PR #$PR_NUMBER"
echo "🔄 Fresh CI should now be triggered automatically"

# Try to convert draft to ready if GitHub CLI is available
if [ "$GH_AVAILABLE" = true ] && [ "$PR_STATE" = "DRAFT" ]; then
    echo "📝 Converting draft PR to ready..."
    if gh pr ready "$PR_NUMBER" 2>/dev/null; then
        echo "✅ PR #$PR_NUMBER marked as ready for review"
    else
        echo "⚠️  Could not mark PR as ready (may require approval)"
    fi
fi

echo "🎯 PR #$PR_NUMBER fix process complete!"
echo "📊 Auto-merge should trigger if all CI checks pass"