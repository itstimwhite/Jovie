import React from 'react';
import { Decorator } from '@storybook/react';
import { useRouter, usePathname, useSearchParams, useParams, useAppRouter, redirect, notFound } from './next-router';
import MockNextLink from './next-link';

// Create a context for Next.js router values that can be controlled via Storybook controls
export const NextRouterContext = React.createContext({
  pathname: '/',
  query: {},
  asPath: '/',
  push: (url: string) => {
    console.log(`Router.push: ${url}`);
    return Promise.resolve(true);
  },
  replace: (url: string) => {
    console.log(`Router.replace: ${url}`);
    return Promise.resolve(true);
  },
});

// Decorator that provides Next.js stubs
export const withNextJsStubs: Decorator = (Story, context) => {
  // Get router values from Storybook controls if provided
  const routerValues = {
    pathname: context.globals.pathname || '/',
    query: context.globals.query || {},
    asPath: context.globals.asPath || '/',
    push: (url: string) => {
      console.log(`Router.push: ${url}`);
      return Promise.resolve(true);
    },
    replace: (url: string) => {
      console.log(`Router.replace: ${url}`);
      return Promise.resolve(true);
    },
  };

  return (
    <NextRouterContext.Provider value={routerValues}>
      <Story />
    </NextRouterContext.Provider>
  );
};

// Mock implementations for Next.js modules
const nextJsMocks = {
  // next/link
  'next/link': MockNextLink,
  
  // next/router
  'next/router': {
    useRouter,
  },
  
  // next/navigation
  'next/navigation': {
    useRouter: useAppRouter,
    usePathname,
    useSearchParams,
    useParams,
    redirect,
    notFound,
  },
};

export default nextJsMocks;

