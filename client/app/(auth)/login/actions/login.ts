'use server';

import { cookies } from 'next/headers';

const SPRING_API_URL = process.env.SPRING_API_URL ?? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

interface SpringLoginResponse {
  accessToken?: string;
  refreshToken?: string;
  userNm?: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

/**
 * Spring Security 필터(/api/auth/login)를 호출해 JWT를 발급받고
 * HttpOnly 쿠키에 저장한다. 브라우저는 토큰을 직접 볼 수 없다.
 */
export async function loginAction(
  loginId: string,
  userPwd: string,
): Promise<LoginResult> {
  let data: SpringLoginResponse;

  try {
    const res = await fetch(`${SPRING_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ loginId, means: 'PASSWORD', userPwd }),
    });

    if (!res.ok) {
      console.error("Login failed status:", res.status);
      return { success: false, error: '아이디 또는 비밀번호를 확인해주세요.' };
    }

    data = await res.json();
  } catch {
    return { success: false, error: '서버에 연결할 수 없습니다.' };
  }

  if (!data.accessToken) {
    return { success: false, error: '로그인에 실패했습니다.' };
  }

  const cookieStore = await cookies();
  const isProd = process.env.NODE_ENV === 'production';

  cookieStore.set('accessToken', data.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60, // 1시간
  });

  if (data.refreshToken) {
    cookieStore.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7일
    });
  }

  return { success: true };
}
