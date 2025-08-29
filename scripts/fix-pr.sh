#!/bin/bash

# PR fixing automation script for Jovie project
# Usage: ./scripts/fix-pr.sh <pr-branch-name>

set -e

if [ -z "$1" ]; then
  echo "❌ Usage: $0 <pr-branch-name>"
  echo "Example: $0 feat/some-feature"
  exit 1
fi

PR_BRANCH="$1"
echo "🔧 Starting automated fixes for PR branch: $PR_BRANCH"

# Function to run command with error handling
run_with_error_handling() {
  local cmd="$1"
  local description="$2"
  
  echo "▶️  $description..."
  if ! eval "$cmd"; then
    echo "⚠️  Warning: $description failed, continuing..."
    return 1
  fi
  echo "✅ $description completed successfully"
  return 0
}

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required tools
if ! command_exists git; then
  echo "❌ Error: git is not installed"
  exit 1
fi

# Store current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"

# Fetch latest changes
echo "🔄 Fetching latest changes..."
git fetch origin

# Check if PR branch exists locally or remotely
if git show-ref --verify --quiet refs/heads/"$PR_BRANCH"; then
  echo "✅ Branch $PR_BRANCH exists locally"
  git checkout "$PR_BRANCH"
elif git show-ref --verify --quiet refs/remotes/origin/"$PR_BRANCH"; then
  echo "✅ Branch $PR_BRANCH exists remotely, checking out..."
  git checkout -b "$PR_BRANCH" origin/"$PR_BRANCH"
else
  echo "❌ Error: Branch $PR_BRANCH not found locally or remotely"
  exit 1
fi

echo "🔄 Updating branch with latest preview..."
if ! git merge origin/preview --no-edit; then
  echo "❌ Error: Failed to merge with preview. Manual conflict resolution required."
  echo "Please resolve conflicts manually, then run:"
  echo "  git add ."
  echo "  git commit -m 'chore: resolve merge conflicts with preview'"
  echo "  git push origin $PR_BRANCH"
  exit 1
fi

# Check if pnpm is available, if not try npm
if command_exists pnpm; then
  PACKAGE_MANAGER="pnpm"
  INSTALL_CMD="pnpm install --frozen-lockfile"
elif command_exists npm; then
  PACKAGE_MANAGER="npm"
  INSTALL_CMD="npm ci"
else
  echo "❌ Error: Neither pnpm nor npm found"
  exit 1
fi

echo "📦 Using package manager: $PACKAGE_MANAGER"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  eval "$INSTALL_CMD" || {
    echo "⚠️  Warning: Dependency installation failed, continuing with existing setup..."
  }
fi

# Array to track what was fixed
FIXES_APPLIED=()

# Try to fix formatting with biome
if command_exists npx; then
  if run_with_error_handling "npx biome format --write ." "Fixing formatting with biome"; then
    FIXES_APPLIED+=("formatting")
  fi
  
  if run_with_error_handling "npx biome check --apply ." "Applying biome fixes"; then
    FIXES_APPLIED+=("biome-fixes")
  fi
fi

# Try to fix ESLint issues
if run_with_error_handling "$PACKAGE_MANAGER run lint:fix" "Fixing ESLint issues"; then
  FIXES_APPLIED+=("eslint")
fi

# Run type check
if run_with_error_handling "$PACKAGE_MANAGER run typecheck" "Running type check"; then
  FIXES_APPLIED+=("typecheck")
else
  echo "⚠️  TypeScript errors detected - may need manual fixing"
fi

# Try to run build to catch build issues
if run_with_error_handling "$PACKAGE_MANAGER run build" "Running build"; then
  FIXES_APPLIED+=("build")
else
  echo "⚠️  Build issues detected - may need manual fixing"
fi

# Try to run tests
if run_with_error_handling "$PACKAGE_MANAGER run test" "Running tests"; then
  FIXES_APPLIED+=("tests")
else
  echo "⚠️  Test failures detected - may need manual fixing"
fi

# Check if we have any changes to commit
if git diff --quiet && git diff --cached --quiet; then
  echo "ℹ️  No changes detected after running fixes"
  echo "🔄 Pushing branch update to trigger fresh CI..."
  git push origin "$PR_BRANCH"
else
  echo "📝 Changes detected, committing fixes..."
  git add .
  
  # Create commit message based on fixes applied
  if [ ${#FIXES_APPLIED[@]} -gt 0 ]; then
    COMMIT_MSG="chore: apply automated fixes ($(IFS=,; echo "${FIXES_APPLIED[*]}"))"
  else
    COMMIT_MSG="chore: update branch with preview"
  fi
  
  git commit -m "$COMMIT_MSG

🤖 Generated with Claude Code
Co-authored-by: Claude <noreply@anthropic.com>"
  
  echo "🚀 Pushing fixes to origin..."
  git push origin "$PR_BRANCH"
fi

# Return to original branch
if [ "$CURRENT_BRANCH" != "$PR_BRANCH" ]; then
  echo "🔙 Returning to original branch: $CURRENT_BRANCH"
  git checkout "$CURRENT_BRANCH"
fi

echo "🎉 Automated fixes completed for $PR_BRANCH!"
if [ ${#FIXES_APPLIED[@]} -gt 0 ]; then
  echo "✅ Applied fixes: ${FIXES_APPLIED[*]}"
else
  echo "ℹ️  No fixes were necessary, branch has been updated"
fi

echo "🔍 Check the PR status to see if CI is now passing"