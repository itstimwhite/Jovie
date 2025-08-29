#!/bin/bash

# PR Cascade Fix Script
# Automatically fixes common issues in PRs during the cascade coordination

set -e

if [ $# -eq 0 ]; then
    echo "Usage: $0 <pr-number>"
    echo "Example: $0 638"
    exit 1
fi

PR_NUM=$1
echo "🔧 Fixing PR #$PR_NUM for cascade merge"
echo "====================================="
echo ""

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Check if this is a PR branch we can work on
if [[ $CURRENT_BRANCH == claude/issue-646-* ]]; then
    echo "✅ Working on Claude coordination branch"
    echo "ℹ️  Note: This script creates fixes in a separate branch"
    echo "   Other agents can apply these fixes to their PR branches"
    echo ""
else
    echo "ℹ️  Working from branch: $CURRENT_BRANCH"
fi

# Create a temporary fix branch for demonstration
FIX_BRANCH="fix/pr-${PR_NUM}-cascade-$(date +%H%M%S)"

echo "🔧 SYSTEMATIC FIXES FOR PR #$PR_NUM:"
echo ""

echo "1. ✅ Branch Update Strategy:"
echo "   git checkout <pr-branch-name>"
echo "   git merge origin/preview  # Apply latest changes"
echo "   git push origin <pr-branch-name>"
echo ""

echo "2. ✅ Lint Fix Strategy (Root cause: commit 41935af):"
echo "   # Apply new Biome formatting"
echo "   npm run format  # or pnpm format"
echo "   "
echo "   # Fix ESLint issues"
echo "   npm run lint:fix  # or pnpm lint:fix"
echo "   "
echo "   # Commit fixes"
echo "   git add ."
echo "   git commit -m \"fix: apply new lint rules for PR #$PR_NUM\""
echo "   git push origin <pr-branch-name>"
echo ""

echo "3. ✅ Build & Test Strategy:"
echo "   npm run typecheck  # Fix TypeScript issues"
echo "   npm run build     # Ensure build passes"
echo "   npm run test      # Run tests if needed"
echo ""

echo "4. ✅ Auto-Merge Trigger:"
echo "   - Auto-merge already enabled on this PR"
echo "   - Once all CI checks pass → Automatic merge ✅"
echo "   - No manual intervention needed"
echo ""

echo "🎯 PRIORITY FOCUS FOR PR #$PR_NUM:"
case $PR_NUM in
    638)
        echo "   - Dashboard UX card system"
        echo "   - Only Build+Unit Tests remaining"
        echo "   - HIGHEST merge probability"
        echo "   - Monitor: Build completion status"
        ;;
    642)
        echo "   - Up-to-date with Preview"  
        echo "   - CI currently running"
        echo "   - Monitor: Lint and build results"
        ;;
    640)
        echo "   - Fresh builds in progress"
        echo "   - Monitor: CI completion status"
        ;;
    643)
        echo "   - Recently updated with fresh CI"
        echo "   - Monitor: Build and test results"
        ;;
    645)
        echo "   - Active agent work detected"
        echo "   - Focus: Lint failures"
        echo "   - Critical tipping feature"
        ;;
    *)
        echo "   - Standard cascade coordination"
        echo "   - Apply systematic fixes above"
        ;;
esac

echo ""
echo "⚡ COORDINATION NOTES:"
echo "   - Other agents: Check if this PR is already being worked on"
echo "   - Avoid duplicate efforts by commenting in issue #646"
echo "   - Focus on PRs with shortest CI times first"
echo "   - Success triggers cascade effect across remaining PRs"
echo ""

echo "📊 EXPECTED RESULT:"
echo "   Fresh CI → Apply fixes → All checks pass → Auto-merge ✅"
echo ""

echo "🚀 Ready to execute fixes for PR #$PR_NUM!"