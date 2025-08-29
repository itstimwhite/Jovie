#!/bin/bash

# Batch PR Processing Script
# Processes all 18 PRs in priority order for systematic merging
# Usage: ./scripts/process-all-prs.sh

set -euo pipefail

echo "🎯 Processing All PRs for Merge Coordination"
echo "============================================"

# Define PR priority order based on issue #646
PRIORITY_PRS=(643 638 642 640 636)  # Highest probability first
BLOCKED_PRS=(645 644 641 639 634 633 628 627)  # Need fixes
CONFLICT_PRS=(637 631)  # Need rebase
UNSTABLE_PRS=(635 632 630)  # Close to merge

ALL_PRS=("${PRIORITY_PRS[@]}" "${UNSTABLE_PRS[@]}" "${BLOCKED_PRS[@]}" "${CONFLICT_PRS[@]}")

echo "📊 Processing ${#ALL_PRS[@]} PRs in optimized order"
echo ""

# Check if fix script exists
FIX_SCRIPT="./scripts/fix-pr-automated.sh"
if [ ! -f "$FIX_SCRIPT" ]; then
    echo "❌ Fix script not found: $FIX_SCRIPT"
    exit 1
fi

# Make scripts executable
chmod +x "$FIX_SCRIPT" 2>/dev/null || true

# Process PRs in priority order
SUCCESS_COUNT=0
TOTAL_COUNT=${#ALL_PRS[@]}

for PR_NUM in "${ALL_PRS[@]}"; do
    echo "🔧 Processing PR #$PR_NUM..."
    echo "─────────────────────────────────"
    
    # Check if PR exists and is open
    if ! gh pr view $PR_NUM --json state --jq '.state' | grep -q "OPEN"; then
        echo "⏭️ PR #$PR_NUM is not open, skipping"
        continue
    fi
    
    # Apply fixes
    if bash "$FIX_SCRIPT" $PR_NUM; then
        echo "✅ PR #$PR_NUM processed successfully"
        ((SUCCESS_COUNT++))
    else
        echo "⚠️ PR #$PR_NUM had issues but continuing"
    fi
    
    echo ""
    echo "Progress: $SUCCESS_COUNT/$TOTAL_COUNT PRs processed"
    echo "═══════════════════════════════════════════════════"
    echo ""
done

echo "🎉 Batch processing complete!"
echo "   ✅ Successfully processed: $SUCCESS_COUNT/$TOTAL_COUNT PRs"
echo "   🔄 Auto-merge enabled on all applicable PRs"
echo "   ⏳ Monitoring for cascade merges..."
echo ""
echo "Next steps:"
echo "1. Monitor GitHub for auto-merges as CI passes"
echo "2. First successful merge should trigger cascade effect"
echo "3. Check progress: gh pr list --state open"
echo ""