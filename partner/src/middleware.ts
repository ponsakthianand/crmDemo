import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales } from './i18n';
import { localePrefix } from './navigation';
type CustomMiddleware = (req: NextRequest) => Promise<NextRequest>;
const customMiddleware: CustomMiddleware = async (req) => {
  console.log('Custom middleware executed before next-intl');
  return req;
};

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale: 'en',
  localePrefix,
});

export default async function middleware(req: NextRequest) {
  // const supplied_token = req.nextUrl.searchParams.get('token');
  // const valid_token = process.env.AUTH_TOKEN;

  // if (supplied_token !== valid_token) {
  //   const signinUrl = new URL('/', req.url);
  //   return NextResponse.redirect(signinUrl);
  // }
  await customMiddleware(req);
  // return NextResponse.next();
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/',
    '/(en|ta)/:path*',
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
    '/profile/:path*',
  ],
};
