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
 *
 * Spring이 4xx를 비즈니스 에러 JSON({ isSuccess: false, code, message })으로
 * 반환할 때는 console.error 없이 ServerFetchError를 던진다.
 * 5xx 같은 예상치 못한 서버 오류만 console.error로 기록한다.
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

    // Spring 비즈니스 에러 JSON 파싱 시도
    // { isSuccess: false, code: "...", message: "..." } 형태이면
    // 예상된 에러이므로 console.error 없이 조용히 throw한다.
    try {
      const errorJson = JSON.parse(text) as SpringResponse<never>;
      if (errorJson.isSuccess === false) {
        throw new ServerFetchError({
          message: `[${errorJson.code}] ${errorJson.message}`,
          status: res.status,
          code: errorJson.code,
          path,
          responseText: text,
        });
      }
    } catch (e) {
      if (e instanceof ServerFetchError) throw e;
      // JSON 파싱 실패 → 예상치 못한 에러, 아래에서 로깅
    }

    // 파싱 불가 혹은 isSuccess 필드 없는 경우 (5xx, 네트워크 에러 등)
    console.error('[serverFetch] 예상치 못한 오류');
    console.error('[serverFetch] URL:', path);
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
      message: `[${json.code}] ${json.message}`,
      status: res.status,
      code: json.code,
      path,
      responseText: JSON.stringify(json),
    });
  }

  return json.result;
}