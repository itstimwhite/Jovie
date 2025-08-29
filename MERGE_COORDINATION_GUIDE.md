# PR Merge Coordination Guide - Issue #646

## 🚨 URGENT: All 18 PRs Must Merge Successfully

### Root Cause Analysis
Commit `41935af` introduced new lint configurations (`eslint.config.js`, `biome.json`) that are causing systematic failures across all PRs created before these new rules existed.

### Current Situation
- **Auto-merge enabled** on 17/18 PRs (all except draft #636)  
- **Zero manual intervention needed** once CI passes
- **Instant merging** once code issues are resolved

### Priority Order (Execute in This Sequence)

#### Phase 1: Highest Probability (Fresh CI)
1. **PR #643** - Fresh CI from recent branch update
2. **PR #638** - Fresh CI from recent branch update  

#### Phase 2: Previously Ready (Just Lint Issues)
3. **PR #642** - Was passing all tests, now failing lint
4. **PR #640** - Was passing all tests, now failing lint

#### Phase 3: Draft + Ready Status
5. **PR #636** - Needs draft → ready + lint fixes

#### Phase 4: Unstable → Blocked
6. **PR #635** - Close to merge, needs systematic fixes
7. **PR #632** - Close to merge, needs systematic fixes  
8. **PR #630** - Close to merge, needs systematic fixes

#### Phase 5: Blocked PRs (Systematic Fixes)
9. **PR #645** - Lint failures
10. **PR #644** - Lint failures
11. **PR #641** - Lint failures  
12. **PR #639** - Blocked status
13. **PR #634** - Blocked status
14. **PR #633** - Blocked status
15. **PR #628** - Blocked status
16. **PR #627** - Blocked status

#### Phase 6: Conflict Resolution  
17. **PR #637** - Merge conflicts, needs rebase
18. **PR #631** - Merge conflicts, needs rebase

## 🛠️ Systematic Fix Process

### For Each PR:

```bash
# 1. Get PR branch name
PR_BRANCH=$(gh pr view $PR_NUM --json headRefName --jq '.headRefName')

# 2. Checkout and update
git fetch origin
git checkout $PR_BRANCH || git checkout -b $PR_BRANCH origin/$PR_BRANCH
git merge origin/preview --no-edit

# 3. Install dependencies
pnpm install --frozen-lockfile

# 4. Apply systematic fixes
pnpm biome format --write .        # New Biome formatting rules
pnpm biome check --apply .         # Organize imports + structure
pnpm lint:fix                      # Fix ESLint issues  
pnpm typecheck                     # Verify TypeScript
pnpm build                         # Ensure build succeeds
pnpm test                          # Run test suite

# 5. Commit and push fixes
git add -A
git commit -m "fix: apply systematic lint and format fixes

- Apply new Biome formatting rules from commit 41935af
- Fix ESLint issues from updated configuration  
- Organize imports and update code style
- Merge latest preview branch changes

Co-authored-by: Claude <noreply@anthropic.com>"

git push origin $PR_BRANCH

# 6. Mark draft PRs as ready (for #636)
gh pr ready $PR_NUM
```

### Special Cases:

#### Draft PR #636:
```bash
# After fixes, mark as ready
gh pr ready 636
```

#### Merge Conflicts (#637, #631):
```bash
# Resolve conflicts during merge
git merge origin/preview
# Fix conflicts manually, then:
git add .
git commit
git push origin $PR_BRANCH
```

## 🎯 Success Criteria

### Each PR Needs:
- ✅ All CI checks passing  
- ✅ Up-to-date with `preview` branch
- ✅ `auto-merge` enabled (already done)
- ❌ No blocking labels or draft status

### Expected Outcome:
- **First successful merge triggers cascade effect**
- **Zero manual intervention after fixes applied**
- **All 18 PRs merge automatically as CI passes**

## 🚀 Execution Strategy

### For AI Agents (@codegen @copilot @claude):

1. **Start with Phase 1** (PRs #643, #638) - highest probability of quick success
2. **Move to Phase 2** (PRs #642, #640) - previously ready, just need lint fixes  
3. **Process remaining phases** systematically
4. **Monitor for first successful merge** - this triggers the cascade effect
5. **Coordinate to avoid duplicate work** on same PRs

### Tools Available:
- `scripts/fix-pr-automated.sh <pr-number>` - Individual PR fixing
- `scripts/process-all-prs.sh` - Batch processing in priority order

## 📊 Progress Tracking

Track completions in priority order:
```
Phase 1: [ ] #643  [ ] #638
Phase 2: [ ] #642  [ ] #640  
Phase 3: [ ] #636
Phase 4: [ ] #635  [ ] #632  [ ] #630
Phase 5: [ ] #645  [ ] #644  [ ] #641  [ ] #639  [ ] #634  [ ] #633  [ ] #628  [ ] #627
Phase 6: [ ] #637  [ ] #631
```

**Target: 18/18 PRs merged successfully 🎯**