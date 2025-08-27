#!/bin/bash

# Get current timestamp in seconds since epoch
current_time=$(date +%s)
# Calculate timestamp for 3 days ago (in seconds since epoch)
three_days_ago=$((current_time - (3 * 24 * 60 * 60)))

# Get list of remote branches
git fetch --prune

echo "The following branches will be deleted (older than 3 days):"
echo "--------------------------------------------------------"

git for-each-ref --format='%(committerdate:raw) %(refname:short)' refs/remotes/origin/ | \
while read -r line; do
    # Extract timestamp and branch name
    timestamp=$(echo "$line" | awk '{print $1}')
    branch=$(echo "$line" | cut -d' ' -f2-)
    
    # Skip main, production, and preview branches
    if [[ "$branch" == "origin/main" || "$branch" == "origin/production" || "$branch" == "origin/preview" ]]; then
        continue
    fi
    
    # Check if branch is older than 3 days
    if [ -n "$timestamp" ] && [ "$timestamp" -lt "$three_days_ago" ]; then
        # Extract just the branch name without origin/
        branch_name=$(echo "$branch" | sed 's/^origin\///')
        echo "git push origin --delete $branch_name"
    fi
done

echo "\nTo proceed with deletion, run the above commands or run this script with the '--execute' parameter"

# If --execute parameter is provided, actually delete the branches
if [ "$1" == "--execute" ]; then
    echo "\nDeleting branches..."
    git for-each-ref --format='%(committerdate:raw) %(refname:short)' refs/remotes/origin/ | \
    while read -r line; do
        timestamp=$(echo "$line" | awk '{print $1}')
        branch=$(echo "$line" | cut -d' ' -f2-)
        
        if [[ "$branch" == "origin/main" || "$branch" == "origin/production" || "$branch" == "origin/preview" ]]; then
            continue
        fi
        
        if [ -n "$timestamp" ] && [ "$timestamp" -lt "$three_days_ago" ]; then
            branch_name=${branch#origin/}
            git push origin --delete "$branch_name"
        fi
    done
    
    echo "\nCleanup complete!"
fi
