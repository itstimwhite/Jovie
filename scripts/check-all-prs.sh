#!/bin/bash

# PR Status Checker Script
# Helps coordinate the merge of multiple PRs

echo "🔍 PR Merge Coordination Status Checker"
echo "======================================="
echo ""

# Define PR lists from issue #646
PRIORITY_QUEUE="642 640 635 632 630 636"
BLOCKED_QUEUE="645 644 641 643 639 634 633 628 627"
CONFLICT_QUEUE="637 631 638"

ALL_PRS="$PRIORITY_QUEUE $BLOCKED_QUEUE $CONFLICT_QUEUE"

echo "📊 Checking status of 18 PRs..."
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if gh CLI is available
if command_exists gh; then
    echo "✅ GitHub CLI detected - checking PR statuses..."
    
    check_pr_status() {
        local pr_num=$1
        local category=$2
        
        # Get PR info
        pr_info=$(gh pr view $pr_num --json state,mergeable,statusCheckRollup,labels,title,headRefName 2>/dev/null)
        
        if [ $? -eq 0 ]; then
            title=$(echo "$pr_info" | jq -r '.title // "Unknown"')
            state=$(echo "$pr_info" | jq -r '.state // "Unknown"')
            mergeable=$(echo "$pr_info" | jq -r '.mergeable // "Unknown"')
            branch=$(echo "$pr_info" | jq -r '.headRefName // "Unknown"')
            
            # Count status checks
            total_checks=$(echo "$pr_info" | jq '.statusCheckRollup | length // 0')
            passed_checks=$(echo "$pr_info" | jq '[.statusCheckRollup[] | select(.conclusion == "SUCCESS")] | length // 0')
            failed_checks=$(echo "$pr_info" | jq '[.statusCheckRollup[] | select(.conclusion == "FAILURE")] | length // 0')
            pending_checks=$(echo "$pr_info" | jq '[.statusCheckRollup[] | select(.conclusion == null or .conclusion == "PENDING")] | length // 0')
            
            # Check for auto-merge labels
            has_auto_merge=$(echo "$pr_info" | jq '.labels | map(.name) | contains(["auto-merge"]) or contains(["codegen"]) or contains(["dependencies"])')
            has_blocking_labels=$(echo "$pr_info" | jq '.labels | map(.name) | contains(["blocked"]) or contains(["human-review"]) or contains(["claude:needs-fixes"])')
            
            echo "PR #$pr_num [$category] - $title"
            echo "  Branch: $branch"
            echo "  State: $state | Mergeable: $mergeable"
            echo "  Checks: $passed_checks✅ $failed_checks❌ $pending_checks⏳ (total: $total_checks)"
            echo "  Auto-merge eligible: $has_auto_merge | Has blocking labels: $has_blocking_labels"
            
            # Provide recommendation
            if [ "$state" = "OPEN" ]; then
                if [ "$failed_checks" -gt 0 ]; then
                    echo "  🔧 ACTION NEEDED: Fix failing checks"
                elif [ "$mergeable" = "CONFLICTING" ]; then
                    echo "  🔄 ACTION NEEDED: Resolve merge conflicts" 
                elif [ "$mergeable" = "BEHIND" ]; then
                    echo "  📤 ACTION NEEDED: Update branch with preview"
                elif [ "$has_blocking_labels" = "true" ]; then
                    echo "  🏷️ ACTION NEEDED: Remove blocking labels"
                elif [ "$has_auto_merge" = "false" ]; then
                    echo "  🏷️ ACTION NEEDED: Add auto-merge label"
                elif [ "$pending_checks" -gt 0 ]; then
                    echo "  ⏳ WAITING: Checks still running"
                else
                    echo "  ✅ READY: Should auto-merge soon"
                fi
            else
                echo "  ℹ️ STATUS: PR is $state"
            fi
            echo ""
        else
            echo "PR #$pr_num [$category] - ❌ Could not fetch PR info"
            echo ""
        fi
    }
    
    echo "🎯 PRIORITY QUEUE (Should merge first):"
    for pr in $PRIORITY_QUEUE; do
        check_pr_status $pr "PRIORITY"
    done
    
    echo "🚫 BLOCKED QUEUE (Need fixes):"
    for pr in $BLOCKED_QUEUE; do
        check_pr_status $pr "BLOCKED"
    done
    
    echo "🔄 CONFLICT QUEUE (Need rebase):"  
    for pr in $CONFLICT_QUEUE; do
        check_pr_status $pr "CONFLICT"
    done
    
else
    echo "⚠️ GitHub CLI not available - showing manual check instructions"
    echo ""
    echo "To check PR statuses manually:"
    echo "1. Visit each PR on GitHub"
    echo "2. Check CI status (green checkmarks)"
    echo "3. Check if branch is up-to-date"
    echo "4. Verify labels (need auto-merge, no blocking labels)"
    echo ""
    echo "PR Numbers to check:"
    echo "Priority: $PRIORITY_QUEUE"
    echo "Blocked:  $BLOCKED_QUEUE"
    echo "Conflict: $CONFLICT_QUEUE"
fi

echo ""
echo "🛠️ Tools available for fixing PRs:"
echo "   ./scripts/fix-pr.sh <branch-name>  # Auto-fix common issues"
echo "   pnpm run validate                  # Check lint + types"
echo "   pnpm run build                     # Check build"
echo "   pnpm run test                      # Run tests"
echo ""
echo "🎯 Goal: Get all 18 PRs merged successfully!"