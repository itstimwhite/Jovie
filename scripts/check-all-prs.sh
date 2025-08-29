#!/bin/bash

# PR status monitoring script for Jovie project
# Usage: ./scripts/check-all-prs.sh

set -e

echo "🔍 Checking status of all PRs for merge coordination..."
echo "=================================================="

# Priority PRs from the GitHub issue
PRIORITY_PRS=(642 640)
UNSTABLE_PRS=(635 632 630)
DRAFT_PRS=(636)
BLOCKED_PRS=(645 644 641 643 639 634 633 628 627)
CONFLICT_PRS=(637 631 638)

# Function to check PR status using git and branch info
check_pr_branch() {
  local pr_number="$1"
  local category="$2"
  
  # Try to find branch - common patterns for PR branches
  local possible_branches=(
    "pr-$pr_number"
    "feat/pr-$pr_number" 
    "fix/pr-$pr_number"
    "chore/pr-$pr_number"
  )
  
  echo "PR #$pr_number ($category):"
  
  # Check if we can find the branch locally or remotely
  local found_branch=""
  for branch in "${possible_branches[@]}"; do
    if git show-ref --verify --quiet refs/remotes/origin/"$branch" 2>/dev/null; then
      found_branch="$branch"
      break
    fi
  done
  
  if [ -n "$found_branch" ]; then
    echo "  ✅ Branch found: $found_branch"
    
    # Check if branch is up to date with preview
    local behind_count=$(git rev-list --count origin/"$found_branch"..origin/preview 2>/dev/null || echo "unknown")
    if [ "$behind_count" = "0" ]; then
      echo "  ✅ Up to date with preview"
    elif [ "$behind_count" = "unknown" ]; then
      echo "  ❓ Unable to determine if behind preview"
    else
      echo "  ⚠️  Behind preview by $behind_count commits"
    fi
    
    # Check for merge conflicts
    if git merge-tree $(git merge-base origin/"$found_branch" origin/preview) origin/"$found_branch" origin/preview | grep -q "<<<<<<< "; then
      echo "  🔄 Merge conflicts detected"
    else
      echo "  ✅ No merge conflicts"
    fi
  else
    echo "  ❓ Branch not found with common naming patterns"
    echo "     Try: git branch -r | grep $pr_number"
  fi
  
  echo ""
}

# Function to provide recommendations
provide_recommendations() {
  local pr_number="$1"
  local category="$2"
  
  case "$category" in
    "PRIORITY")
      echo "🎯 PRIORITY ACTION: ./scripts/fix-pr.sh <branch-name>"
      ;;
    "UNSTABLE") 
      echo "⚡ UNSTABLE: ./scripts/fix-pr.sh <branch-name>"
      ;;
    "DRAFT")
      echo "📝 DRAFT: Complete feature, then ./scripts/fix-pr.sh <branch-name>"
      ;;
    "BLOCKED")
      echo "🔴 BLOCKED: ./scripts/fix-pr.sh <branch-name>"
      ;;
    "CONFLICTS")
      echo "🔄 CONFLICTS: Manual merge resolution needed"
      ;;
  esac
}

# Fetch latest to ensure we have current branch info
echo "🔄 Fetching latest branch information..."
git fetch origin --quiet

echo ""
echo "🎯 PRIORITY QUEUE (needs immediate attention):"
echo "=============================================="
for pr in "${PRIORITY_PRS[@]}"; do
  check_pr_branch "$pr" "PRIORITY"
  provide_recommendations "$pr" "PRIORITY"
done

echo "🟡 UNSTABLE QUEUE (close to merge):"
echo "===================================="
for pr in "${UNSTABLE_PRS[@]}"; do
  check_pr_branch "$pr" "UNSTABLE"  
  provide_recommendations "$pr" "UNSTABLE"
done

echo "📝 DRAFT QUEUE (needs completion):"
echo "=================================="
for pr in "${DRAFT_PRS[@]}"; do
  check_pr_branch "$pr" "DRAFT"
  provide_recommendations "$pr" "DRAFT"
done

echo "🔴 BLOCKED QUEUE (needs fixes):"
echo "==============================="
for pr in "${BLOCKED_PRS[@]}"; do
  check_pr_branch "$pr" "BLOCKED"
  provide_recommendations "$pr" "BLOCKED"
done

echo "🔄 CONFLICT QUEUE (needs rebase):"
echo "================================="
for pr in "${CONFLICT_PRS[@]}"; do
  check_pr_branch "$pr" "CONFLICTS"
  provide_recommendations "$pr" "CONFLICTS"
done

echo ""
echo "📊 SUMMARY:"
echo "==========="
echo "• Priority PRs: ${#PRIORITY_PRS[@]}"
echo "• Unstable PRs: ${#UNSTABLE_PRS[@]}" 
echo "• Draft PRs: ${#DRAFT_PRS[@]}"
echo "• Blocked PRs: ${#BLOCKED_PRS[@]}"
echo "• Conflict PRs: ${#CONFLICT_PRS[@]}"
echo "• Total PRs: $((${#PRIORITY_PRS[@]} + ${#UNSTABLE_PRS[@]} + ${#DRAFT_PRS[@]} + ${#BLOCKED_PRS[@]} + ${#CONFLICT_PRS[@]}))"

echo ""
echo "🚀 NEXT STEPS:"
echo "=============="
echo "1. Use 'git branch -r | grep <pr-number>' to find exact branch names"
echo "2. Run './scripts/fix-pr.sh <branch-name>' for each PR"
echo "3. Monitor CI status after each fix"
echo "4. Enable auto-merge when ready"

echo ""
echo "🎯 Goal: 18/18 PRs merged successfully!"