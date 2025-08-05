import { NavLink } from '@/components/atoms/NavLink';

interface AuthActionsProps {
  className?: string;
}

export function AuthActions({ className }: AuthActionsProps) {
  return (
    <div className={`flex items-center space-x-4 ${className || ''}`}>
      <NavLink href="/sign-in" variant="default">
        Sign In
      </NavLink>
      <NavLink href="/sign-up" variant="primary">
        Sign Up
      </NavLink>
    </div>
  );
}
