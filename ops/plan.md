# Plan

## Queue

```task
id: JOV-PL-001
source: INBOX-001
title: Configuration Error – Clerk publishable key on dev.jov.ie (develop)
labels: [bug, auth, env, ai-task]
priority: P2
acceptance:
  - Reproduce on dev.jov.ie develop deployment; capture screenshot and console/network logs

issue: #218
```

```task
id: JOV-PL-002
source: INBOX-002
title: Vercel Flags SDK outdated or misconfigured on dev.jov.ie
labels: [bug, ops, vercel, feature-flags, ai-task]
priority: P2
acceptance:
  - Call /.well-known/vercel/flags discovery endpoint and verify version info is returned

issue: #219
```
