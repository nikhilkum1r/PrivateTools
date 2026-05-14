import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the last locale for all requests
    '/((?!api|_next|.*\\..*).*)',

    // However, match all pathnames within `/[locale]`
    '/(en|hi|es|ar|fr|zh|ru|pt|de|ja)/:path*'
  ]
};
