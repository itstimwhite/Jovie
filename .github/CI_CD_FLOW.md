# CI/CD Pipeline Flow

This document explains the complete CI/CD pipeline flow from develop branch to production deployment.

## 🔄 **Complete Flow Overview**

```
develop → preview → main → production
   ↓        ↓        ↓        ↓
  CI/CD    CI/CD   Manual   Production
Pipeline  Pipeline  Review   Deployment
```

## 📋 **Step-by-Step Flow**

### **Step 1: Develop Branch (develop-ci.yml)**

**Trigger:** Push to `develop` branch

**Process:**

1. ✅ **CI Checks:**
   - Type checking and linting
   - Unit and integration tests
   - Build verification
   - Preview deployment
   - Lighthouse performance testing
   - Security dependency scanning

2. ✅ **Auto-Promotion:**
   - Check if develop is ahead of preview
   - Create PR: `develop → preview`
   - Enable auto-merge (squash)
   - Auto-merge when all checks pass

**Output:** Changes automatically merged to `preview` branch

### **Step 2: Preview Branch (preview-ci.yml)**

**Trigger:** Push to `preview` branch (after develop → preview merge)

**Process:**

1. ✅ **Comprehensive Testing:**
   - Full E2E testing (desktop + mobile)
   - Visual regression testing
   - Lighthouse performance budgets
   - Bundle size analysis
   - ZAP security scanning
   - Dependency security audit

2. ✅ **Auto-Promotion to Main:**
   - Check if preview is ahead of main
   - Create PR: `preview → main`
   - Add "needs-review" label
   - **Manual review required**

**Output:** PR created for `preview → main` (manual approval needed)

### **Step 3: Main Branch (production-deploy.yml)**

**Trigger:** Push to `main` branch (after preview → main merge)

**Process:**

1. ✅ **Production Deployment:**
   - Production environment deployment
   - Post-deployment verification
   - Environment protection
   - Deployment monitoring

**Output:** Changes deployed to production

## 🎯 **Key Features**

### **Automated Promotions:**

- ✅ **develop → preview:** Fully automated with auto-merge
- ✅ **preview → main:** Automated PR creation, manual review required
- ✅ **main → production:** Automated deployment

### **Safety Gates:**

- ✅ **Develop:** All CI checks must pass
- ✅ **Preview:** Full E2E tests + security scans must pass
- ✅ **Main:** Manual review required
- ✅ **Production:** Automatic deployment with verification

### **Error Handling:**

- ✅ **Branch ahead checks:** Prevents unnecessary PRs
- ✅ **Conditional execution:** Only runs when needed
- ✅ **Comprehensive logging:** Clear status messages
- ✅ **Graceful failures:** Continues pipeline on non-critical errors

## 🔍 **Workflow Triggers**

### **develop-ci.yml:**

```yaml
on:
  push:
    branches: [develop]
  pull_request:
    branches: [develop]
  workflow_dispatch: {}
```

### **preview-ci.yml:**

```yaml
on:
  push:
    branches: [preview]
  pull_request:
    branches: [preview]
  workflow_dispatch: {}
```

### **production-deploy.yml:**

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch: {}
```

## 🛡️ **Security & Quality Gates**

### **Develop Branch:**

- ✅ TypeScript type checking
- ✅ ESLint code quality
- ✅ Unit and integration tests
- ✅ Build verification
- ✅ Smoke E2E tests
- ✅ Lighthouse performance
- ✅ Dependency security audit

### **Preview Branch:**

- ✅ Full E2E testing (desktop + mobile)
- ✅ Visual regression testing
- ✅ Lighthouse performance budgets
- ✅ Bundle size analysis
- ✅ ZAP security scanning
- ✅ Comprehensive security audit

### **Main Branch:**

- ✅ Production deployment
- ✅ Post-deployment verification
- ✅ Environment protection

## 📊 **Monitoring & Observability**

### **Workflow Status:**

- ✅ **Success:** All checks passed, promotion successful
- ✅ **Failure:** Check logs for specific issues
- ✅ **Skipped:** No changes to promote (expected)

### **Deployment URLs:**

- ✅ **Preview:** Available in PR description
- ✅ **Production:** Available in deployment logs

### **Notifications:**

- ✅ **PR Creation:** Automatic PR with detailed description
- ✅ **Auto-merge:** Automatic merging when conditions met
- ✅ **Manual Review:** Clear indication when manual review needed

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Develop → Preview not triggering:**
   - Check if develop is ahead of preview
   - Verify CI checks are passing
   - Check auto-merge conditions

2. **Preview → Main not creating PR:**
   - Check if preview is ahead of main
   - Verify all preview CI checks passed
   - Check workflow permissions

3. **Production deployment failing:**
   - Check environment variables
   - Verify Vercel configuration
   - Check deployment logs

### **Debug Commands:**

```bash
# Check branch status
git fetch origin
git rev-list --count preview..develop
git rev-list --count main..preview

# Check workflow runs
gh run list --workflow=develop-ci.yml
gh run list --workflow=preview-ci.yml
gh run list --workflow=production-deploy.yml
```

## 🎯 **Best Practices**

### **Development:**

- ✅ Always work on `develop` branch
- ✅ Ensure all tests pass before pushing
- ✅ Monitor CI/CD pipeline status
- ✅ Review auto-created PRs

### **Review Process:**

- ✅ Review preview → main PRs carefully
- ✅ Test preview environment before approval
- ✅ Check security scan results
- ✅ Verify performance metrics

### **Deployment:**

- ✅ Monitor production deployment
- ✅ Verify post-deployment checks
- ✅ Monitor application performance
- ✅ Check error tracking

## 📈 **Performance Metrics**

### **Pipeline Efficiency:**

- ✅ **Develop CI:** ~40 minutes
- ✅ **Preview CI:** ~60 minutes
- ✅ **Production Deploy:** ~30 minutes

### **Quality Metrics:**

- ✅ **Test Coverage:** Comprehensive E2E testing
- ✅ **Performance:** Lighthouse budget compliance
- ✅ **Security:** Automated vulnerability scanning
- ✅ **Reliability:** Multiple safety gates

---

**Status:** ✅ **Fully Automated Pipeline**

The CI/CD pipeline is now fully automated with proper safety gates, comprehensive testing, and clear promotion flow from develop to production. The pipeline ensures quality, security, and reliability at every stage.
