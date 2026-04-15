import { cookies } from 'next/headers';

const SPRING_API_URL = process.env.SPRING_API_URL ?? 'http://localhost:8080';

interface SpringResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

/**
 * Next.js 서버(Server Action / Server Component)에서 Spring API를 호출하는 유틸.
 * HttpOnly 쿠키에서 JWT를 읽어 Authorization 헤더로 전달한다.
 */
export async function serverFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const res = await fetch(`${SPRING_API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('[serverFetch] 실패 URL:', path);
    console.error('[serverFetch] 상태코드:', res.status);
    console.error('[serverFetch] 응답본문:', text);
    throw new Error(`Spring API error ${res.status}: ${path}`);
  }

  const json: SpringResponse<T> = await res.json();
  if (!json.isSuccess) {
    throw new Error(
      `Spring API business error: ${json.code} - ${json.message}`,
    );
  }
  return json.result;
}
