#!/bin/bash

# PR Status Monitoring Script
# Usage: ./scripts/check-pr-status.sh [pr-number]
# Monitors status of specific PR or all 18 PRs from issue #646

set -euo pipefail

# All 18 PRs from issue #646
ALL_PRS=(642 640 635 632 630 636 645 644 641 643 639 634 633 628 627 637 631 638)

# Function to check individual PR status
check_pr_status() {
    local pr_num="$1"
    local detailed="${2:-false}"
    
    echo "🔍 Checking PR #$pr_num..."
    
    if command -v gh >/dev/null 2>&1; then
        # Try to get detailed status with GitHub CLI
        if gh pr view "$pr_num" >/dev/null 2>&1; then
            local title=$(gh pr view "$pr_num" --json title --jq '.title')
            local state=$(gh pr view "$pr_num" --json state --jq '.state')
            local isDraft=$(gh pr view "$pr_num" --json isDraft --jq '.isDraft')
            local mergeable=$(gh pr view "$pr_num" --json mergeable --jq '.mergeable')
            local checks=$(gh pr view "$pr_num" --json statusCheckRollup --jq '.statusCheckRollup | length')
            
            # Get check status
            local check_status="UNKNOWN"
            if [ "$checks" != "null" ] && [ "$checks" != "0" ]; then
                local failing_checks=$(gh pr view "$pr_num" --json statusCheckRollup --jq '.statusCheckRollup | map(select(.state == "FAILURE" or .state == "ERROR")) | length')
                local pending_checks=$(gh pr view "$pr_num" --json statusCheckRollup --jq '.statusCheckRollup | map(select(.state == "PENDING" or .state == "IN_PROGRESS")) | length')
                local passing_checks=$(gh pr view "$pr_num" --json statusCheckRollup --jq '.statusCheckRollup | map(select(.state == "SUCCESS")) | length')
                
                if [ "$failing_checks" != "0" ]; then
                    check_status="❌ FAILING ($failing_checks failed)"
                elif [ "$pending_checks" != "0" ]; then
                    check_status="🔄 RUNNING ($pending_checks pending)"
                elif [ "$passing_checks" != "0" ]; then
                    check_status="✅ PASSING ($passing_checks passed)"
                fi
            fi
            
            # Get labels
            local labels=$(gh pr view "$pr_num" --json labels --jq '.labels | map(.name) | join(", ")')
            
            # Determine overall status
            local overall_status=""
            if [ "$state" = "MERGED" ]; then
                overall_status="🎉 MERGED"
            elif [ "$isDraft" = "true" ]; then
                overall_status="📝 DRAFT"
            elif [ "$mergeable" = "CONFLICTING" ]; then
                overall_status="🔄 CONFLICTS"
            elif echo "$check_status" | grep -q "FAILING"; then
                overall_status="🔴 BLOCKED (CI failing)"
            elif echo "$check_status" | grep -q "RUNNING"; then
                overall_status="⚡ ACTIVE (CI running)"
            elif echo "$check_status" | grep -q "PASSING"; then
                overall_status="🟢 READY (CI passing)"
            elif echo "$labels" | grep -q -E "(auto-merge|codegen)"; then
                overall_status="⚙️  AUTO-MERGE ENABLED"
            else
                overall_status="⏳ WAITING"
            fi
            
            echo "  Title: $title"
            echo "  Status: $overall_status"
            echo "  State: $state | Draft: $isDraft | Mergeable: $mergeable"
            echo "  CI: $check_status"
            [ -n "$labels" ] && echo "  Labels: $labels"
            
            if [ "$detailed" = "true" ]; then
                echo "  ⚡ Actions available:"
                if [ "$isDraft" = "true" ]; then
                    echo "    - Run: gh pr ready $pr_num"
                fi
                if echo "$check_status" | grep -q "FAILING"; then
                    echo "    - Run: ./scripts/fix-pr-automated.sh $pr_num"
                fi
                if [ "$mergeable" = "CONFLICTING" ]; then
                    echo "    - Fix conflicts manually, then run fix script"
                fi
            fi
            
        else
            echo "  ❌ PR #$pr_num not found or not accessible"
        fi
    else
        echo "  ⚠️  GitHub CLI not available - install 'gh' for detailed status"
        
        # Fallback: try to find branch and check basic git status
        local branch_found=false
        for remote_branch in $(git branch -r 2>/dev/null | grep -E "(pr.*$pr_num|$pr_num.*pr)" || echo ""); do
            branch_found=true
            echo "  📌 Found branch: $remote_branch"
            break
        done
        
        if [ "$branch_found" = "false" ]; then
            echo "  ❓ Branch not found locally"
        fi
    fi
    
    echo ""
}

# Main execution
if [ $# -eq 0 ]; then
    echo "📊 Checking status of all 18 PRs from issue #646"
    echo "=================================================="
    echo ""
    
    merged_count=0
    ready_count=0
    active_count=0
    blocked_count=0
    draft_count=0
    
    for pr in "${ALL_PRS[@]}"; do
        status_output=$(check_pr_status "$pr" false)
        echo "$status_output"
        
        # Count statuses
        if echo "$status_output" | grep -q "🎉 MERGED"; then
            ((merged_count++))
        elif echo "$status_output" | grep -q "🟢 READY"; then
            ((ready_count++))
        elif echo "$status_output" | grep -q "⚡ ACTIVE"; then
            ((active_count++))
        elif echo "$status_output" | grep -q "🔴 BLOCKED"; then
            ((blocked_count++))
        elif echo "$status_output" | grep -q "📝 DRAFT"; then
            ((draft_count++))
        fi
    done
    
    echo "📈 SUMMARY"
    echo "=========="
    echo "🎉 Merged: $merged_count/18"
    echo "🟢 Ready: $ready_count"
    echo "⚡ Active: $active_count"
    echo "🔴 Blocked: $blocked_count"
    echo "📝 Draft: $draft_count"
    echo ""
    echo "🎯 Goal: 18/18 PRs merged"
    
    if [ "$merged_count" -lt 18 ]; then
        echo "🚀 Next recommended actions:"
        if [ "$ready_count" -gt 0 ]; then
            echo "   - Monitor ready PRs for auto-merge"
        fi
        if [ "$active_count" -gt 0 ]; then
            echo "   - Wait for active CI to complete"
        fi
        if [ "$draft_count" -gt 0 ]; then
            echo "   - Convert drafts to ready: gh pr ready <pr-number>"
        fi
        if [ "$blocked_count" -gt 0 ]; then
            echo "   - Fix blocked PRs: ./scripts/fix-pr-automated.sh <pr-number>"
        fi
    else
        echo "🎉 ALL 18 PRs MERGED! Coordination complete!"
    fi
    
else
    # Check specific PR
    PR_NUMBER="$1"
    echo "📊 Detailed status for PR #$PR_NUMBER"
    echo "======================================"
    echo ""
    check_pr_status "$PR_NUMBER" true
fi