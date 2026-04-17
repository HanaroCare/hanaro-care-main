import { cookies } from 'next/headers';

const SPRING_API_URL = process.env.SPRING_API_URL ?? 'http://localhost:8080';

interface SpringResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

export class ServerFetchError extends Error {
  status?: number;
  code?: string;
  path?: string;
  responseText?: string;

  constructor(params: {
    message: string;
    status?: number;
    code?: string;
    path?: string;
    responseText?: string;
  }) {
    super(params.message);
    this.name = 'ServerFetchError';
    this.status = params.status;
    this.code = params.code;
    this.path = params.path;
    this.responseText = params.responseText;
  }
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
  const token =
      cookieStore.get('AUTH_TOKEN')?.value ??
      cookieStore.get('accessToken')?.value;

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

    throw new ServerFetchError({
      message: `Spring API error ${res.status}: ${path}`,
      status: res.status,
      path,
      responseText: text,
    });
  }

  const json: SpringResponse<T> = await res.json();

  if (!json.isSuccess) {
    throw new ServerFetchError({
      message: `Spring API business error: ${json.code} - ${json.message}`,
      code: json.code,
      path,
      responseText: JSON.stringify(json),
    });
  }

  return json.result;
}
