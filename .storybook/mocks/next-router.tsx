import React from 'react';

// Mock for useRouter from next/router
export function useRouter() {
  return {
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    basePath: '',
    isLocaleDomain: false,
    push: (url: string) => {
      console.log(`Router.push: ${url}`);
      return Promise.resolve(true);
    },
    replace: (url: string) => {
      console.log(`Router.replace: ${url}`);
      return Promise.resolve(true);
    },
    reload: () => {
      console.log('Router.reload');
    },
    back: () => {
      console.log('Router.back');
    },
    prefetch: () => Promise.resolve(),
    beforePopState: () => {},
    events: {
      on: () => {},
      off: () => {},
      emit: () => {},
    },
    isFallback: false,
  };
}

// Mock for usePathname from next/navigation
export function usePathname() {
  return '/';
}

// Mock for useSearchParams from next/navigation
export function useSearchParams() {
  return new URLSearchParams();
}

// Mock for useParams from next/navigation
export function useParams() {
  return {};
}

// Mock for useRouter from next/navigation (App Router)
export function useAppRouter() {
  return {
    push: (url: string) => {
      console.log(`Router.push: ${url}`);
    },
    replace: (url: string) => {
      console.log(`Router.replace: ${url}`);
    },
    refresh: () => {
      console.log('Router.refresh');
    },
    back: () => {
      console.log('Router.back');
    },
    forward: () => {
      console.log('Router.forward');
    },
    prefetch: (url: string) => {
      console.log(`Router.prefetch: ${url}`);
    },
  };
}

// Mock for redirect from next/navigation
export function redirect(url: string) {
  console.log(`Redirect to: ${url}`);
}

// Mock for notFound from next/navigation
export function notFound() {
  console.log('Not found triggered');
}

