import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/onboarding', '/font-config'];

// These paths remain accessible even when the user is authenticated
// (e.g. post-login password expiry flow redirects to reset-password)
const ALWAYS_ACCESSIBLE = ['/login/reset-password', '/login/find-id'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get('AUTH_TOKEN')?.value;
  const hasSeenFont = request.cookies.get('HAS_SEEN_FONT_CONFIG')?.value === 'true';
  const hasSeenOnboarding = request.cookies.get('HAS_SEEN_ONBOARDING')?.value === 'true';
  const authType = request.cookies.get('AUTH_TYPE')?.value;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isAlwaysAccessible = ALWAYS_ACCESSIBLE.some((path) => pathname.startsWith(path));

  if (token) {
    if (isPublic && !isAlwaysAccessible) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  if (!hasSeenFont) {
    if (pathname === '/font-config') return NextResponse.next();
    return NextResponse.redirect(new URL('/font-config', request.url));
  }

  if (!hasSeenOnboarding) {
    if (pathname === '/font-config') return NextResponse.next();
    if (pathname === '/onboarding') return NextResponse.next();
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  const loginTarget = authType === 'HANA_CERT' ? '/login/hanaCert' : '/login';

  if (isPublic) {
    if (pathname === '/login' && loginTarget === '/login/hanaCert') {
      return NextResponse.redirect(new URL('/login/hanaCert', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(loginTarget, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.).*)'],
};
