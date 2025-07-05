import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh'],
  defaultLocale: 'zh'
});

export const config = {
  matcher: ['/', '/(en|zh)/:path*']
};