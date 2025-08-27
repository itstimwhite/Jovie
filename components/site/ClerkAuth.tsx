'use client';

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs';

/**
 * Client-side component to render Clerk authentication buttons.
 */
export default function ClerkAuth() {
  return (
    <>
      <SignedOut>
        <SignInButton>Sign In</SignInButton>
        <SignUpButton forceRedirectUrl='/sign-up'>Sign Up</SignUpButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}
