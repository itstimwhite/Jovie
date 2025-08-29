#!/bin/bash

# PR Status Checker - Works without GitHub CLI
# Checks local git state and provides recommendations
# Usage: ./scripts/check-pr-status.sh

set -euo pipefail

echo "📊 PR Coordination Status Check"
echo "==============================="

# List all remote branches to identify PR branches
echo "🌿 Remote branches available:"
git branch -r | grep -v HEAD | while read branch; do
    branch_name=$(echo $branch | sed 's/origin\///')
    echo "   $branch_name"
done

echo ""
echo "📋 Current branch status:"
echo "   Current: $(git branch --show-current)"
echo "   Latest commit: $(git log -1 --oneline)"
echo ""

# Check if we're up to date with preview
echo "🔄 Preview branch status:"
git fetch origin preview 2>/dev/null || echo "   ⚠️ Cannot fetch preview (approval needed)"

if git merge-base --is-ancestor HEAD origin/preview 2>/dev/null; then
    echo "   ✅ Current branch is up to date with preview"
elif git merge-base --is-ancestor origin/preview HEAD 2>/dev/null; then
    echo "   ⬆️ Current branch is ahead of preview"
else
    echo "   🔄 Current branch needs update from preview"
    BEHIND_COUNT=$(git rev-list --count HEAD..origin/preview 2>/dev/null || echo "?")
    AHEAD_COUNT=$(git rev-list --count origin/preview..HEAD 2>/dev/null || echo "?")
    echo "   📊 Behind: $BEHIND_COUNT commits, Ahead: $AHEAD_COUNT commits"
fi

echo ""
echo "🛠️ Available fix tools:"
echo "   📁 scripts/fix-pr-automated.sh <pr-number>"
echo "   📁 scripts/process-all-prs.sh"
echo "   📁 MERGE_COORDINATION_GUIDE.md"

echo ""
echo "🎯 Priority PR targets (highest probability first):"
echo "   Phase 1: #643, #638 (fresh CI)"
echo "   Phase 2: #642, #640 (previously ready)"  
echo "   Phase 3: #636 (draft + ready needed)"
echo ""
echo "💡 Recommendation: Start with Phase 1 PRs for quick cascade trigger"
echo "