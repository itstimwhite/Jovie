# Manual Testing Guide: Sign-up → Dashboard Redirect Flow

This document provides manual testing steps to verify that Clerk sign-up correctly redirects to `/dashboard` and that dashboard data loads successfully for new users.

## Prerequisites

Before testing, ensure you have:
- Local development environment running (`npm run dev`)
- Valid environment variables in `.env.local`:
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY` 
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Supabase database accessible and properly configured

## Test Cases

### Test Case 1: New User Sign-up Flow

**Objective**: Verify that a new user signing up is properly redirected to dashboard and can access the onboarding flow.

**Steps**:
1. Open browser in incognito/private mode
2. Navigate to `http://localhost:3000`
3. Click on the sign-up button/link (Clerk component)
4. Complete the Clerk sign-up process with a new email address
5. After successful sign-up, verify redirect behavior

**Expected Results**:
- User should be redirected to `/dashboard` after successful sign-up
- Since user has no database record yet, dashboard should show onboarding form
- Onboarding form should display: "Welcome to Jovie" heading
- Form should allow entering a handle
- No console errors should appear during the flow
- Loading states should display appropriately

**Success Criteria**:
- ✅ Redirect to `/dashboard` occurs automatically after sign-up
- ✅ Dashboard shows onboarding form (not error state)
- ✅ Onboarding form is functional and accessible
- ✅ No JavaScript errors in browser console
- ✅ Page loads within reasonable time (< 5 seconds)

### Test Case 2: Existing User Dashboard Access

**Objective**: Verify that users with existing accounts can access dashboard and see their data.

**Steps**:
1. Sign in with an existing Clerk account that has associated artist data
2. Navigate to `/dashboard` directly or from homepage
3. Verify dashboard loads with user's existing data

**Expected Results**:
- Dashboard should load successfully
- User's artist profile data should be displayed
- Dashboard tabs (Profile, Social Links, Listen Now, Analytics) should be accessible
- Profile link card should show the user's jov.ie URL

**Success Criteria**:
- ✅ Dashboard displays user's existing data
- ✅ All dashboard tabs are functional
- ✅ No "Failed to load user data" errors
- ✅ Profile URL is correctly generated

### Test Case 3: Authentication Middleware

**Objective**: Verify that middleware correctly handles authentication redirects.

**Steps**:
1. Sign out of any existing session
2. Navigate directly to `/dashboard` 
3. Complete sign-in flow
4. Verify redirect behavior after authentication

**Expected Results**:
- Unauthenticated users should be redirected to Clerk sign-in
- After successful authentication, users should return to `/dashboard`
- Authenticated users visiting `/` should redirect to `/dashboard`

**Success Criteria**:
- ✅ Proper redirects occur based on authentication state
- ✅ No redirect loops or infinite redirects
- ✅ Authentication flow completes successfully

### Test Case 4: Error Handling

**Objective**: Verify that errors are handled gracefully during the sign-up and data loading process.

**Steps**:
1. Test with various network conditions (slow connection, intermittent connectivity)
2. Test error scenarios (temporarily invalid env vars, database connection issues)
3. Verify error UI and recovery mechanisms

**Expected Results**:
- Loading states should display during slow connections
- Error messages should be user-friendly (no technical details exposed)
- Refresh/retry mechanisms should be available
- Errors should not crash the application

**Success Criteria**:
- ✅ Graceful error handling with helpful messages
- ✅ No sensitive information exposed in errors
- ✅ Recovery options available to users
- ✅ Application remains stable during errors

## Manual Test Checklist

- [ ] **Environment Setup**: All required environment variables configured
- [ ] **Homepage**: Landing page loads without errors for unauthenticated users  
- [ ] **Sign-up Flow**: Clerk sign-up process completes successfully
- [ ] **Redirect**: Automatic redirect to `/dashboard` after sign-up
- [ ] **Onboarding**: New users see onboarding form, not error state
- [ ] **Dashboard**: Existing users can access dashboard with their data
- [ ] **Middleware**: Authentication redirects work correctly
- [ ] **Error Handling**: Errors are handled gracefully with user-friendly messages
- [ ] **Performance**: Pages load within reasonable time limits
- [ ] **Console**: No JavaScript errors during the complete flow
- [ ] **Accessibility**: Onboarding form and dashboard are keyboard navigable
- [ ] **Responsive**: Flow works correctly on mobile and desktop

## Common Issues to Watch For

1. **"Failed to load user data" error**: Usually indicates Supabase connection or RLS policy issues
2. **Infinite redirect loops**: May occur if middleware or authentication logic has bugs
3. **Clerk integration issues**: Check that CLERK_SECRET_KEY and publishable key are correct
4. **Database permission errors**: Verify RLS policies allow authenticated users to read/write their data
5. **Session management**: Ensure session persistence works across page navigations

## Reporting Issues

When reporting issues found during manual testing, include:
- Browser and version used
- Exact steps to reproduce
- Screenshots or screen recordings of the issue
- Console error messages (if any)
- Network tab information (for API-related issues)
- Expected vs. actual behavior

## Automated Testing Note

The companion e2e test file `tests/e2e/auth-signup-redirect.spec.ts` provides automated verification of this flow, but manual testing is still valuable for:
- Testing real Clerk authentication integration
- Verifying actual Supabase data persistence 
- Testing edge cases and error scenarios
- Validating user experience and accessibility