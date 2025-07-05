import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'zh'],
  defaultLocale: 'zh'
}); 
export const config = {
  matcher: ['/', '/(en|zh)/:path*']
};