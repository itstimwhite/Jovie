import { NavLink } from '@/components/atoms/NavLink';
import { FEATURE_FLAGS } from '@/constants/app';

interface AuthActionsProps {
  className?: string;
}

export function AuthActions({ className }: AuthActionsProps) {
  return (
    <div className={`flex items-center space-x-4 ${className || ''}`}>
      <NavLink href="/sign-in" variant="default">
        Sign In
      </NavLink>
      <NavLink
        href={FEATURE_FLAGS.waitlistEnabled ? '/waitlist' : '/sign-up'}
        variant="primary"
      >
        {FEATURE_FLAGS.waitlistEnabled ? 'Join Waitlist' : 'Sign Up'}
      </NavLink>
    </div>
  );
}
