#!/bin/bash

# PR Cascade Monitoring Script
# Monitors the status of all PRs in the merge coordination effort
# Usage: ./scripts/monitor-pr-cascade.sh [pr-number]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# PR numbers to monitor (based on issue #646)
ALL_PRS=(645 644 643 642 641 640 639 637 636 635 634 633 632 631 630 628 627 638)

echo "🚀 PR Cascade Monitoring Dashboard"
echo "=================================="

# Function to check PR status
check_pr_status() {
    local pr_number=$1
    echo -e "\n📋 ${BLUE}PR #$pr_number${NC}"
    echo "   ├── Checking status..."
    
    if command -v gh &> /dev/null; then
        if pr_info=$(gh pr view "$pr_number" --json state,title,mergeable,statusCheckRollupState 2>/dev/null); then
            local state=$(echo "$pr_info" | jq -r '.state')
            local title=$(echo "$pr_info" | jq -r '.title')
            local mergeable=$(echo "$pr_info" | jq -r '.mergeable')
            local checks=$(echo "$pr_info" | jq -r '.statusCheckRollupState')
            
            case $state in
                "MERGED")
                    echo -e "   ├── Status: ${GREEN}✅ MERGED${NC}"
                    echo "   └── Title: $title"
                    return 0
                    ;;
                "CLOSED")
                    echo -e "   ├── Status: ${RED}❌ CLOSED${NC}"
                    echo "   └── Title: $title"
                    return 1
                    ;;
                "DRAFT")
                    echo -e "   ├── Status: ${YELLOW}📝 DRAFT${NC}"
                    echo "   ├── Title: $title"
                    echo "   └── 💡 Action: Convert to ready using: gh pr ready $pr_number"
                    return 0
                    ;;
                "OPEN")
                    echo -e "   ├── Status: ${BLUE}🔄 OPEN${NC}"
                    echo "   ├── Title: $title"
                    
                    case $checks in
                        "SUCCESS")
                            echo -e "   ├── CI: ${GREEN}✅ PASSING${NC}"
                            if [ "$mergeable" = "MERGEABLE" ]; then
                                echo -e "   └── 🎯 ${GREEN}READY TO MERGE!${NC}"
                            else
                                echo -e "   └── ⚠️  Not mergeable (conflicts?)"
                            fi
                            ;;
                        "FAILURE")
                            echo -e "   ├── CI: ${RED}❌ FAILING${NC}"
                            echo "   └── 🔧 Action: Run ./scripts/fix-pr-systematic.sh $pr_number"
                            ;;
                        "PENDING")
                            echo -e "   ├── CI: ${YELLOW}⏳ PENDING${NC}"
                            echo "   └── ⏰ Waiting for CI completion"
                            ;;
                        *)
                            echo -e "   ├── CI: ${YELLOW}❓ UNKNOWN${NC}"
                            echo "   └── 🔍 Manual investigation needed"
                            ;;
                    esac
                    return 0
                    ;;
            esac
        else
            echo -e "   └── ${RED}❌ Could not fetch PR info${NC}"
            return 1
        fi
    else
        echo -e "   └── ${YELLOW}⚠️  GitHub CLI not available${NC}"
        return 0
    fi
}

# Function to show summary
show_summary() {
    echo -e "\n📊 ${BLUE}CASCADE SUMMARY${NC}"
    echo "================"
    
    local merged_count=0
    local open_count=0
    local draft_count=0
    local failing_count=0
    local passing_count=0
    
    for pr in "${ALL_PRS[@]}"; do
        if command -v gh &> /dev/null; then
            if pr_info=$(gh pr view "$pr" --json state,statusCheckRollupState 2>/dev/null); then
                local state=$(echo "$pr_info" | jq -r '.state')
                local checks=$(echo "$pr_info" | jq -r '.statusCheckRollupState')
                
                case $state in
                    "MERGED") ((merged_count++)) ;;
                    "DRAFT") ((draft_count++)) ;;
                    "OPEN")
                        ((open_count++))
                        case $checks in
                            "SUCCESS") ((passing_count++)) ;;
                            "FAILURE") ((failing_count++)) ;;
                        esac
                        ;;
                esac
            fi
        fi
    done
    
    local total=${#ALL_PRS[@]}
    local progress=$((merged_count * 100 / total))
    
    echo -e "🎯 Progress: ${GREEN}$merged_count/$total merged${NC} ($progress%)"
    echo -e "📝 Draft PRs: ${YELLOW}$draft_count${NC}"
    echo -e "🔄 Open PRs: ${BLUE}$open_count${NC}"
    echo -e "✅ Passing CI: ${GREEN}$passing_count${NC}"
    echo -e "❌ Failing CI: ${RED}$failing_count${NC}"
    
    if [ $merged_count -eq $total ]; then
        echo -e "\n🎉 ${GREEN}ALL PRs MERGED! CASCADE COMPLETE!${NC} 🎉"
    elif [ $failing_count -gt 0 ]; then
        echo -e "\n🔧 ${YELLOW}Next Action: Fix failing PRs using systematic fix script${NC}"
    elif [ $draft_count -gt 0 ]; then
        echo -e "\n📝 ${YELLOW}Next Action: Convert draft PRs to ready${NC}"
    else
        echo -e "\n⏳ ${BLUE}All PRs processing - monitor for completion${NC}"
    fi
}

# Main execution
if [ $# -eq 0 ]; then
    echo "📋 Monitoring all PRs in the cascade..."
    
    for pr in "${ALL_PRS[@]}"; do
        check_pr_status "$pr"
    done
    
    show_summary
else
    # Monitor specific PR
    PR_NUMBER=$1
    echo "📋 Monitoring PR #$PR_NUMBER specifically..."
    check_pr_status "$PR_NUMBER"
fi

echo -e "\n🔄 Monitoring complete. Run again to refresh status."