#!/bin/bash

# Monitor PR Progress - Real-time status tracking for 18 PRs
# Usage: ./scripts/monitor-pr-progress.sh [pr-number]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# PR numbers from issue #646
ALL_PRS=(642 640 645 644 641 635 632 630 643 639 634 633 628 627 637 631 638)
MERGED_PRS=(636 629)  # Already merged

echo "🚀 PR Merge Coordination - Progress Monitor"
echo "=========================================="

# Function to check single PR status
check_pr_status() {
    local pr_number=$1
    
    echo -e "\n📋 ${BLUE}PR #${pr_number}${NC}"
    echo "----------------------------------------"
    
    # Get PR info using gh CLI if available
    if command -v gh &> /dev/null; then
        # Try to get detailed PR status
        if gh pr view $pr_number --json title,state,isDraft,mergeable,statusCheckRollup 2>/dev/null; then
            echo "✅ Status retrieved via GitHub CLI"
        else
            echo "❌ Could not retrieve PR status via GitHub CLI"
        fi
    else
        echo "⚠️  GitHub CLI not available - install for detailed status"
    fi
}

# Function to show overall progress
show_progress() {
    echo -e "\n🎯 ${GREEN}OVERALL PROGRESS${NC}"
    echo "=================================================="
    echo -e "✅ Merged: ${GREEN}${#MERGED_PRS[@]}/18${NC} ($(printf '%s ' "${MERGED_PRS[@]}"))"
    echo -e "🔄 Remaining: ${YELLOW}${#ALL_PRS[@]}/18${NC}"
    echo -e "📊 Success Rate: ${GREEN}$(( ${#MERGED_PRS[@]} * 100 / 18 ))%${NC}"
    
    echo -e "\n🎯 ${BLUE}REMAINING PRs:${NC}"
    for pr in "${ALL_PRS[@]}"; do
        echo "  • PR #$pr"
    done
}

# Main execution
if [ $# -eq 0 ]; then
    # Show overall progress first
    show_progress
    
    echo -e "\n🔍 ${YELLOW}Monitoring all remaining PRs...${NC}"
    echo "=============================================="
    
    # Check status of remaining PRs
    for pr in "${ALL_PRS[@]}"; do
        check_pr_status $pr
    done
    
    echo -e "\n⚡ ${GREEN}NEXT ACTIONS:${NC}"
    echo "- PR #638: Monitor Build+Unit Tests (closest to merge)"
    echo "- PRs #642, #640: Fix lint issues (were previously ready)"
    echo "- Monitor CI progress across all PRs"
    echo "- Auto-merge will trigger when CI passes ✅"
    
else
    # Monitor specific PR
    check_pr_status $1
fi

echo -e "\n🎉 ${GREEN}Goal: 18/18 PRs merged successfully!${NC}"