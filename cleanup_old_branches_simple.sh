#!/bin/bash

# Simple script to list remote branches older than 3 days
# To delete them, pipe to xargs git push origin --delete

git fetch --prune

# Get current date in seconds since epoch
current_date=$(date +%s)
# Calculate date 3 days ago in seconds since epoch
three_days_ago=$((current_date - (3 * 24 * 60 * 60)))

echo "The following branches are older than 3 days:"
echo "-----------------------------------------"

git for-each-ref --sort=-committerdate refs/remotes/origin/ \
  --format='%(committerdate:unix) %(refname:short)' | \
  while read -r timestamp branch; do
    # Skip main, production, and preview branches
    if [[ "$branch" == "origin/main" || "$branch" == "origin/production" || "$branch" == "origin/preview" ]]; then
        continue
    fi
    
    # Check if branch is older than 3 days
    if [ -n "$timestamp" ] && [ "$timestamp" -lt "$three_days_ago" ]; then
        # Remove 'origin/' prefix
        branch_name=${branch#origin/}
        echo "$branch_name"
    fi
done

echo -e "\nTo delete these branches, run:"
echo "./cleanup_old_branches_simple.sh | xargs -I{} git push origin --delete {}"
