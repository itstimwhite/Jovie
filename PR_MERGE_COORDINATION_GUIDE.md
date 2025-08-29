# PR Merge Coordination Guide

## 🎯 Mission: Merge All 18 PRs Successfully

**Current Status**: 3/18 PRs merged ✅ (PRs #638, #636, #629)  
**Remaining**: 15 PRs with auto-merge enabled, requiring systematic fixes

## 🔍 Root Cause Analysis

**Problem**: Commit `41935af` introduced new lint configurations (`eslint.config.js`, `biome.json`) causing systematic failures across all PRs created before these new rules existed.

**Solution**: Systematic application of new lint rules and branch updates to align with current codebase standards.

## 🛠️ Automation Tools Created

### 1. Individual PR Fixer
```bash
./scripts/fix-pr-systematic.sh <pr-number>
```
**Purpose**: Systematically fix individual PRs  
**Actions**:
- Merges latest preview branch
- Applies new Biome + ESLint configurations
- Runs lint, format, typecheck, build, tests
- Commits and pushes fixes
- Converts draft → ready (when possible)

### 2. Cascade Monitor
```bash
./scripts/monitor-pr-cascade.sh [pr-number]
```
**Purpose**: Real-time status monitoring  
**Features**:
- Shows overall progress (currently 3/18 = 16.7%)
- Tracks CI status for all PRs
- Provides specific action recommendations
- Progress tracking toward 18/18 goal

## 📋 Current PR Status & Priority Order

### ✅ Successfully Merged (3/18)
- **PR #638**: Dashboard UX card system unifier
- **PR #636**: Add tipping empty states and skeletons  
- **PR #629**: Nested dashboard routes

### 🔥 High Priority (Assigned to AI Agents)
- **PR #633**: Lint + Vercel + Claude Review failures → @claude @codegen
- **PR #635**: Merge conflicts → @codegen
- **PR #645**: Lint, Typecheck, Claude Review, Vercel failures
- **PR #641**: Lint, Vercel failures  
- **PR #639**: Lint, Vercel failures

### 🔄 Processing Queue
- **PR #642**: Was ready, now failing lint (systematic issue)
- **PR #640**: Was ready, now failing lint (systematic issue)
- **PR #643**: Recently updated with fresh CI
- **PR #637**: Merge conflicts need resolution
- **PR #631**: Merge conflicts need resolution

### ⏳ Remaining PRs
- **PR #634, #632, #630, #628, #627**: Various failures requiring systematic fixes

## 🚀 Execution Strategy

### Phase 1: AI Agent Coordination
1. **@claude**: Focus on PR #633 (assigned)
2. **@codegen**: Focus on PR #635 conflicts (assigned)  
3. **@copilot**: Focus on remaining high-priority PRs

### Phase 2: Systematic Fixing
```bash
# For each failing PR:
./scripts/fix-pr-systematic.sh <pr-number>

# Monitor progress:  
./scripts/monitor-pr-cascade.sh
```

### Phase 3: Cascade Effect
- Auto-merge enabled on all PRs ✅
- Each successful fix → automatic merge
- Success creates momentum for remaining PRs

## ✅ Success Criteria

**For each PR**:
- ✅ All CI checks passing
- ✅ Up-to-date with `preview` branch
- ✅ Auto-merge enabled (already done)
- ❌ No blocking conflicts or failures

**Overall Goal**: 18/18 PRs merged successfully 🎯

## 🔧 Manual Interventions (When Needed)

### Merge Conflicts
```bash
git checkout <branch-name>
git merge origin/preview
# Resolve conflicts manually
git add .
git commit -m "resolve merge conflicts with preview"
git push origin <branch-name>
```

### Draft PR Conversion
```bash
gh pr ready <pr-number>
```

### Force CI Re-run
```bash
# Make trivial change and push to trigger fresh CI
git commit --allow-empty -m "trigger CI re-run"
git push origin <branch-name>
```

## 📊 Progress Tracking

**Current Metrics**:
- **Merged**: 3/18 PRs (16.7% complete)
- **Active CI**: 0 builds (all steady state)  
- **Auto-merge enabled**: 17/17 remaining PRs ✅
- **Coordination infrastructure**: ✅ Operational

**Next Milestones**:
- **5/18 PRs**: Cascade acceleration point
- **10/18 PRs**: Majority momentum  
- **18/18 PRs**: Mission complete! 🎉

## 🤖 AI Agent Coordination

### Current Assignments
- **PR #633**: @claude (Lint + Vercel + Claude Review failures)
- **PR #635**: @codegen (Merge conflicts)
- **Remaining PRs**: @codegen @copilot @claude (coordinated approach)

### Coordination Protocol
1. **Check issue #646 comments** before working on a PR
2. **Update progress** in coordination issue  
3. **Avoid duplicate work** on same PR
4. **Focus on highest probability PRs** first
5. **Communicate status changes** immediately

## 🎯 Success Formula

**Proven Pattern**:
Fresh CI → Apply lint fixes → Auto-merge ✅

**Infrastructure Ready**:
- ✅ Auto-merge enabled on all remaining PRs
- ✅ Root cause identified and fixable
- ✅ Automation tools created and tested
- ✅ Coordination system operational

**Execute systematic fixes → Trigger cascade effect → Achieve 18/18 success! 🚀**