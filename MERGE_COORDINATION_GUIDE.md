# PR Merge Coordination Guide - Issue #646

## 🎯 Objective: Merge All 18 PRs Successfully

This guide provides comprehensive automation and coordination strategies for merging all 18 PRs mentioned in issue #646.

## 📊 Current Status (as of analysis)

**AUTO-MERGE ENABLED:** 17/18 PRs (all except draft #636)
**ROOT CAUSE:** Commit `41935af` introduced new lint configurations causing systematic failures

### PR Categories

**PRIORITY QUEUE (Quick Wins):**
- **PR #636** - Draft → Ready + lint fixes
- **PR #638** - CI running (highest probability)  
- **PR #643** - Fresh branch updates

**PREVIOUSLY READY (Lint Issues):**
- **PR #642, #640** - Were passing, now failing lint due to new configs

**SYSTEMATIC FIXES NEEDED:**
- **PR #645, #644, #641** - Lint failures
- **PR #635, #632, #630** - Build/test issues
- **PR #639, #634, #633, #628, #627** - Various blocks

**CONFLICT RESOLUTION:**
- **PR #637, #631** - Merge conflicts with preview

## 🛠️ Automation Tools

### 1. Individual PR Fixer
```bash
./scripts/fix-pr-automated.sh <pr-number>
```

**What it does:**
- Automatically checks out PR branch
- Merges latest preview (with conflict detection)
- Runs lint fixes, formatting, typecheck, build
- Commits and pushes changes
- Converts from draft if needed (requires GitHub CLI)

**Usage Examples:**
```bash
# Fix highest priority targets
./scripts/fix-pr-automated.sh 636  # Draft conversion + fixes
./scripts/fix-pr-automated.sh 642  # Lint issues from new configs
./scripts/fix-pr-automated.sh 638  # Monitor this one, may be ready
```

### 2. Status Monitor
```bash
./scripts/check-pr-status.sh          # Check all 18 PRs
./scripts/check-pr-status.sh 636      # Check specific PR
```

**What it shows:**
- Overall status (MERGED, READY, ACTIVE, BLOCKED, DRAFT)
- CI check status
- Auto-merge label status
- Specific actions needed
- Progress toward 18/18 goal

## 🚀 Execution Strategy

### Phase 1: Quick Wins (Start Here)
Focus on highest probability successes to trigger cascade effect:

```bash
# 1. Check overall status
./scripts/check-pr-status.sh

# 2. Target easiest wins first
./scripts/fix-pr-automated.sh 636  # Draft conversion
./scripts/fix-pr-automated.sh 638  # May already be close
./scripts/fix-pr-automated.sh 643  # Fresh updates

# 3. Monitor for first merge
# Watch for first successful auto-merge to trigger cascade
```

### Phase 2: Previously Ready PRs
Fix PRs that were working before lint config changes:

```bash
./scripts/fix-pr-automated.sh 642
./scripts/fix-pr-automated.sh 640
```

### Phase 3: Systematic Fixes
Work through remaining blocked PRs:

```bash
# Lint failures
./scripts/fix-pr-automated.sh 645
./scripts/fix-pr-automated.sh 644
./scripts/fix-pr-automated.sh 641

# Build/test issues
./scripts/fix-pr-automated.sh 635
./scripts/fix-pr-automated.sh 632
./scripts/fix-pr-automated.sh 630

# Various blocks
./scripts/fix-pr-automated.sh 639
./scripts/fix-pr-automated.sh 634
./scripts/fix-pr-automated.sh 633
./scripts/fix-pr-automated.sh 628
./scripts/fix-pr-automated.sh 627
```

### Phase 4: Conflict Resolution
Handle merge conflicts (may need manual intervention):

```bash
./scripts/fix-pr-automated.sh 637  # Check for conflicts
./scripts/fix-pr-automated.sh 631  # Check for conflicts
```

## 🔧 Manual Intervention Scenarios

### When Automation Needs Help

1. **Merge Conflicts:**
   ```bash
   # Script will detect and provide instructions
   git checkout <pr-branch>
   git merge origin/preview
   # Resolve conflicts manually
   git add . && git commit -m "resolve conflicts"
   # Then continue with: ./scripts/fix-pr-automated.sh <pr-number>
   ```

2. **GitHub CLI Permissions:**
   ```bash
   # If scripts can't convert draft or check status
   gh pr ready 636
   gh pr view 636 --json state,isDraft
   ```

3. **Complex Build Issues:**
   ```bash
   # If automated fixes don't resolve build problems
   cd <project-root>
   pnpm install --force
   pnpm run build
   # Debug specific errors manually
   ```

## 📈 Success Metrics

### Monitoring Progress
- **Goal:** 18/18 PRs merged
- **Current:** 0/18 merged (as of last check)
- **Infrastructure:** Auto-merge enabled on 17/18 PRs

### Success Indicators
1. **First successful merge** → Triggers cascade effect
2. **CI passing** → Immediate auto-merge
3. **Draft converted** → Lint checks enabled
4. **Conflicts resolved** → Path to merge cleared

### Failure Recovery
- **Script fails:** Check error output, may need manual resolution
- **CI still failing:** May need deeper investigation of specific issues
- **Auto-merge not working:** Verify labels and branch protection rules

## 🤖 AI Agent Coordination

### For @codegen @copilot @claude

**Recommended Approach:**
1. **Start with Phase 1** (quick wins) to build momentum
2. **Monitor progress** using check script every 10-15 minutes
3. **Coordinate work** - avoid duplicating efforts on same PR
4. **Focus on cascade effect** - first merge often leads to others

**Communication:**
- Use issue #646 comments to coordinate
- Report progress and blockers
- Share successful strategies

**Priority Assignment:**
- **Agent 1:** Focus on PR #636 (draft conversion)
- **Agent 2:** Monitor PR #638 (active CI) and #643
- **Agent 3:** Work on PR #642, #640 (lint fixes)

## 🎯 Expected Outcomes

**Immediate (0-30 minutes):**
- First PR merges successfully
- Cascade effect begins
- 3-5 PRs complete

**Short-term (30-60 minutes):**
- Most lint/format issues resolved
- 8-12 PRs merged
- Only complex conflicts remain

**Complete (60-120 minutes):**
- All 18 PRs merged
- Issue #646 closed
- Coordination complete

---

## 📚 Reference

**Created for Issue #646:** 🚨 URGENT: PR Merge Coordination - All PRs Must Merge

**Root Cause:** Commit `41935af` introduced new lint configurations (`eslint.config.js`, `biome.json`) causing systematic failures across PRs created before these changes.

**Solution:** Automated scripts handle updates to new lint standards while maintaining coordination across all 18 PRs.

**Infrastructure:** Auto-merge enabled, CI properly configured, just need to fix the code issues.

---

*Generated for systematic PR merge coordination*