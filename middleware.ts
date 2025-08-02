import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/legal/privacy',
    '/legal/terms',
    '/api/track',
  ],
  ignoredRoutes: [
    '/favicon.ico',
    '/brand/(.*)',
    '/og/(.*)',
  ],
  afterAuth(auth, req) {
    if (auth.userId && req.nextUrl.pathname === '/') {
      return Response.redirect(new URL('/dashboard', req.url));
    }
  },
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};