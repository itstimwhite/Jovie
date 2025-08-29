# PR Merge Coordination - Solution Guide

## 🎯 Root Cause Analysis

**Problem**: Commit `41935af` introduced new lint configurations causing systematic failures across all 18 PRs.

**Changes Introduced**:
- New `eslint.config.js` with stricter rules
- New `biome.json` for formatting/linting
- Updated `lint-staged` configuration
- Updated dependencies and project structure

**Impact**: PRs created before this commit now fail lint checks when trying to merge with `preview`.

## 🛠️ Automation Solution

### 1. **PR Fix Script**: `scripts/fix-pr.sh`

**Usage**: 
```bash
./scripts/fix-pr.sh <pr-branch-name>
```

**What it does**:
- ✅ Checks out PR branch and merges latest preview
- ✅ Installs dependencies if needed
- ✅ Applies Biome formatting (`biome format --write .`)
- ✅ Applies Biome fixes (`biome check --apply .`)
- ✅ Fixes ESLint issues (`pnpm run lint:fix`)
- ✅ Runs typecheck, build, and tests
- ✅ Commits and pushes fixes automatically
- ✅ Handles merge conflicts gracefully

### 2. **Status Monitor**: `scripts/check-all-prs.sh`

**Usage**:
```bash
./scripts/check-all-prs.sh
```

**What it does**:
- ✅ Checks status of all 18 PRs
- ✅ Shows branch relationships and conflicts
- ✅ Provides specific action recommendations
- ✅ Tracks progress toward 18/18 goal

## 🚀 Execution Strategy

### **Priority Order** (from GitHub issue):

1. **PRIORITY QUEUE**: PRs #642, #640 (were passing, now failing)
2. **UNSTABLE QUEUE**: PRs #635, #632, #630 (close to merge)  
3. **DRAFT QUEUE**: PR #636 (needs completion)
4. **BLOCKED QUEUE**: PRs #645, #644, #641, #643, #639, #634, #633, #628, #627
5. **CONFLICT QUEUE**: PRs #637, #631, #638 (merge conflicts)

### **For Each PR**:
1. Find branch name: `git branch -r | grep <pr-number>`
2. Run fix script: `./scripts/fix-pr.sh <branch-name>`
3. Monitor CI status for auto-merge
4. Move to next PR in priority order

## 📋 Success Criteria

**For each PR to be merge-ready**:
- ✅ All CI checks passing (lint, format, typecheck, build, tests)
- ✅ Up-to-date with `preview` branch
- ✅ Has `auto-merge` or `codegen` label
- ❌ No blocking labels

## 🎯 Goal

**18/18 PRs merged successfully** through systematic automation and coordination.

## 🤖 Agent Coordination

**@codegen @copilot @claude**: Use these scripts to systematically process PRs. The automation handles the heavy lifting - just run the scripts in priority order and monitor results.

**Communication**: Update GitHub issue with progress as PRs are fixed and merged.