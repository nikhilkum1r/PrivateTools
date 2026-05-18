import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the last locale for all requests
    '/((?!api|_next|lib|assets|favicon|.*\\..*).*)',

    // However, match all pathnames within `/[locale]`
    '/(en|hi|es|ar|fr|zh|ru|pt|de|ja|id|tr|it|pl|vi|ko|th|nl|fa|uk|ms|cs|da|el|fi|ro|sv)/:path*'
  ]
};
