import React from 'react';

// Mock for next/link
const MockNextLink = ({
  href,
  as,
  replace,
  scroll,
  shallow,
  passHref,
  prefetch,
  locale,
  legacyBehavior,
  children,
  ...props
}: {
  href: string;
  as?: string;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
  passHref?: boolean;
  prefetch?: boolean;
  locale?: string | false;
  legacyBehavior?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}) => {
  return (
    <a
      href={href}
      {...props}
      onClick={(e) => {
        e.preventDefault();
        props.onClick?.(e);
        console.log(`Link clicked: ${href}`);
      }}
    >
      {children}
    </a>
  );
};

export default MockNextLink;

