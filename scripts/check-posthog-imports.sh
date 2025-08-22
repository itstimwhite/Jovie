#!/bin/bash

# Script to check for direct imports of posthog-js outside of lib/analytics.ts
# This script is meant to be run in CI to prevent direct usage of posthog-js

# Find all direct imports of posthog-js
IMPORT_RESULTS=$(grep -r --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" "from 'posthog-js'" .)

# Filter out allowed imports (in lib/analytics.ts)
DISALLOWED_IMPORTS=$(echo "$IMPORT_RESULTS" | grep -v "lib/analytics.ts" | grep -v "tests/")

# Find all direct usages of posthog
USAGE_RESULTS=$(grep -r --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" "posthog\." .)

# Filter out allowed usages (in lib/analytics.ts and tests)
DISALLOWED_USAGES=$(echo "$USAGE_RESULTS" | grep -v "lib/analytics.ts" | grep -v "tests/")

# Check if there are any disallowed imports or usages
if [ -n "$DISALLOWED_IMPORTS" ] || [ -n "$DISALLOWED_USAGES" ]; then
  echo "ERROR: Found direct imports or usages of posthog-js outside of lib/analytics.ts"
  
  if [ -n "$DISALLOWED_IMPORTS" ]; then
    echo "Direct imports:"
    echo "$DISALLOWED_IMPORTS"
  fi
  
  if [ -n "$DISALLOWED_USAGES" ]; then
    echo "Direct usages:"
    echo "$DISALLOWED_USAGES"
  fi
  
  echo "Please use the analytics API from lib/analytics.ts instead."
  exit 1
else
  echo "No direct imports or usages of posthog-js found outside of lib/analytics.ts"
  exit 0
fi

