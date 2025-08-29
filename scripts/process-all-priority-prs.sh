#!/bin/bash

# Process All Priority PRs Script
# Usage: ./scripts/process-all-priority-prs.sh

set -e

echo "🎯 PROCESSING ALL PRIORITY PRS"
echo "=============================="
echo ""

# Priority order based on latest coordination messages
PRIORITY_PRS=(638 643 645 642 640 635 632 630)

echo "📋 Processing PRs in priority order: ${PRIORITY_PRS[*]}"
echo ""

SUCCESSFUL_MERGES=1  # PR #636 already merged
TOTAL_PRS=18

for pr in "${PRIORITY_PRS[@]}"; do
    echo "🔄 PROCESSING PR #$pr"
    echo "===================="
    
    # Check if PR still exists and is open
    if gh pr view $pr --json state | jq -r '.state' | grep -q "OPEN"; then
        echo "✅ PR #$pr is open, processing..."
        
        # Run systematic fix
        if ./scripts/fix-pr-systematic.sh $pr; then
            echo "✅ Systematic fix completed for PR #$pr"
            
            # Wait a moment for CI to start
            sleep 10
            
            # Check if it's ready to merge
            PR_STATUS=$(gh pr view $pr --json mergeable,statusCheckRollup)
            MERGEABLE=$(echo "$PR_STATUS" | jq -r '.mergeable')
            
            if [ "$MERGEABLE" = "MERGEABLE" ]; then
                # Check for passing status checks
                FAILING_CHECKS=$(echo "$PR_STATUS" | jq -r '.statusCheckRollup[] | select(.conclusion == "FAILURE") | .name')
                if [ -z "$FAILING_CHECKS" ]; then
                    echo "🎉 PR #$pr appears ready for auto-merge!"
                    SUCCESSFUL_MERGES=$((SUCCESSFUL_MERGES + 1))
                else
                    echo "⚠️ PR #$pr still has failing checks: $FAILING_CHECKS"
                fi
            else
                echo "⚠️ PR #$pr not yet mergeable"
            fi
        else
            echo "❌ Failed to process PR #$pr"
        fi
        
    else
        echo "ℹ️ PR #$pr is not open (may be merged or closed)"
        # Check if it was merged
        if gh pr view $pr --json state | jq -r '.state' | grep -q "MERGED"; then
            echo "🎉 PR #$pr was already merged!"
            SUCCESSFUL_MERGES=$((SUCCESSFUL_MERGES + 1))
        fi
    fi
    
    echo ""
    echo "📊 Current progress: $SUCCESSFUL_MERGES/$TOTAL_PRS PRs complete"
    echo ""
    
    # Small delay between PRs to avoid overwhelming CI
    sleep 5
done

echo ""
echo "🏁 PRIORITY PR PROCESSING COMPLETE"
echo "================================="
echo ""
echo "📊 Final Status:"
echo "  - Processed: ${#PRIORITY_PRS[@]} priority PRs"
echo "  - Total Progress: $SUCCESSFUL_MERGES/$TOTAL_PRS PRs complete"
echo ""

if [ $SUCCESSFUL_MERGES -lt $TOTAL_PRS ]; then
    echo "⚡ Remaining PRs to check:"
    echo "  - Run: gh pr list --state open"
    echo "  - Check status of any remaining PRs"
    echo "  - Apply systematic fixes as needed"
else
    echo "🎉 ALL PRS SUCCESSFULLY MERGED!"
fi

echo ""
echo "🚀 Auto-merge system continues to monitor - PRs will merge automatically as they become ready!"