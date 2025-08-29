#!/bin/bash

# Check Priority PRs Status Script
# Usage: ./scripts/check-priority-prs.sh

set -e

echo "🎯 PRIORITY PR STATUS CHECK"
echo "=========================="
echo ""

# Priority PRs from coordination message
PRIORITY_PRS=(638 643 645 642 640)

echo "📊 Checking status of priority PRs..."
echo ""

for pr in "${PRIORITY_PRS[@]}"; do
    echo "🔍 PR #$pr:"
    
    # Check if branch exists
    if gh pr view $pr >/dev/null 2>&1; then
        # Get PR details
        PR_INFO=$(gh pr view $pr --json state,statusCheckRollup,mergeable,headRefName,title,isDraft)
        
        STATE=$(echo "$PR_INFO" | jq -r '.state')
        TITLE=$(echo "$PR_INFO" | jq -r '.title')
        MERGEABLE=$(echo "$PR_INFO" | jq -r '.mergeable')
        BRANCH=$(echo "$PR_INFO" | jq -r '.headRefName')
        IS_DRAFT=$(echo "$PR_INFO" | jq -r '.isDraft')
        
        echo "  Title: $TITLE"
        echo "  State: $STATE"
        echo "  Branch: $BRANCH"
        echo "  Mergeable: $MERGEABLE"
        echo "  Draft: $IS_DRAFT"
        
        # Check status checks
        CHECKS=$(echo "$PR_INFO" | jq -r '.statusCheckRollup[] | select(.conclusion != null) | "\(.name): \(.conclusion)"')
        if [ ! -z "$CHECKS" ]; then
            echo "  Status Checks:"
            echo "$CHECKS" | sed 's/^/    /'
        fi
        
        # Provide recommendation
        if [ "$STATE" = "OPEN" ] && [ "$MERGEABLE" = "MERGEABLE" ] && [ "$IS_DRAFT" = "false" ]; then
            FAILING_CHECKS=$(echo "$PR_INFO" | jq -r '.statusCheckRollup[] | select(.conclusion == "FAILURE") | .name')
            if [ -z "$FAILING_CHECKS" ]; then
                echo "  ✅ READY TO MERGE!"
            else
                echo "  🔧 NEEDS FIXES: $FAILING_CHECKS"
            fi
        elif [ "$IS_DRAFT" = "true" ]; then
            echo "  📝 NEEDS: Convert from draft to ready"
        else
            echo "  ⚠️ NEEDS: Check merge conflicts or other issues"
        fi
        
    else
        echo "  ❌ PR not found or access denied"
    fi
    
    echo ""
done

echo "💡 Next steps:"
echo "1. Fix failing checks on PRs with specific issues"
echo "2. Convert drafts to ready status"
echo "3. Monitor for auto-merge once conditions met"
echo ""
echo "🚀 Auto-merge is enabled - PRs will merge automatically when ready!"