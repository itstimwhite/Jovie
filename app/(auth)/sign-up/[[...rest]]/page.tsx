'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0D0E12] transition-colors">
      <SignUp />
    </div>
  );
}
