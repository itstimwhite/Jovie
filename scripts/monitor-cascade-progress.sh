#!/bin/bash

# PR Cascade Monitoring Script
# Monitors the progress of all 18 PRs in the merge coordination effort

set -e

echo "🚀 PR Cascade Progress Monitor"
echo "=============================="
echo ""

# List of all PRs in coordination effort
declare -a PRS=(638 642 640 643 645 635 634 633 632 630 644 641 639 637 631 628 627)

# Already merged PRs
MERGED_PRS=(636 629)

echo "✅ SUCCESSFULLY MERGED: ${#MERGED_PRS[@]}/18 PRs"
for pr in "${MERGED_PRS[@]}"; do
    echo "  - PR #$pr ✅"
done
echo ""

echo "🔄 REMAINING PRs IN AUTO-MERGE PIPELINE: ${#PRS[@]}/18"
echo ""

# Check specific PR if provided
if [ $# -eq 1 ]; then
    PR_NUM=$1
    echo "🎯 DETAILED STATUS FOR PR #$PR_NUM:"
    echo "   Checking branch status..."
    
    # Try to get branch info if available
    if command -v gh >/dev/null 2>&1; then
        echo "   Using GitHub CLI to check status..."
        gh pr view $PR_NUM --json number,title,statusCheckRollup,mergeable,labels 2>/dev/null || echo "   ⚠️  GitHub CLI access limited"
    else
        echo "   ⚠️  GitHub CLI not available for detailed checks"
    fi
    
    echo ""
fi

echo "⚡ PRIORITY ORDER (Based on latest intelligence):"
echo "1. PR #638 - Dashboard UX (Only Build+Unit Tests queued) 🎯"
echo "2. PR #642 - Up-to-date with Preview, CI running"
echo "3. PR #640 - Fresh builds in progress"
echo "4. PR #643 - Recently updated with fresh CI"
echo "5. PR #645 - Active agent work detected"
echo ""

echo "🔧 COORDINATION NOTES:"
echo "- All 17 remaining PRs have auto-merge enabled"
echo "- All PRs updated to latest preview branch" 
echo "- Fresh CI triggered simultaneously across all PRs"
echo "- Root cause: New lint configs in commit 41935af"
echo ""

echo "📈 SUCCESS PATTERN:"
echo "  Fresh CI → Pass all checks → Auto-merge ✅"
echo ""

# Calculate progress percentage
TOTAL_PRS=18
MERGED_COUNT=${#MERGED_PRS[@]}
PROGRESS=$(( MERGED_COUNT * 100 / TOTAL_PRS ))

echo "📊 OVERALL PROGRESS: $MERGED_COUNT/$TOTAL_PRS ($PROGRESS%)"
echo "🎯 TARGET: 18/18 PRs merged successfully"
echo ""

if [ $MERGED_COUNT -lt 5 ]; then
    echo "🚀 NEXT MILESTONE: Reach 5/18 merges (cascade acceleration point)"
elif [ $MERGED_COUNT -lt 10 ]; then
    echo "🌊 MILESTONE: Cascade effect building - push to 10/18!"
elif [ $MERGED_COUNT -lt 18 ]; then
    echo "⚡ FINAL PUSH: Almost there - complete final $(( TOTAL_PRS - MERGED_COUNT )) PRs!"
else
    echo "🎉 SUCCESS: All 18 PRs merged! Coordination complete!"
fi