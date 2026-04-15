import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/onboarding'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value;
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // TODO: 로그인이 HttpOnly 쿠키 방식으로 전환된 후 주석 해제
  // if (!token && !isPublic) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  // 정적 파일, 이미지, Next.js 내부 경로 제외
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images).*)'],
};
