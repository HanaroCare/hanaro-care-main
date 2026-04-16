"use server";

import { cookies } from "next/headers";

const BASE = process.env.SPRING_API_URL ?? "http://localhost:8080";

type ActionResult = { ok: true } | { ok: false; error: string };

export async function checkUsernameAvailability(
  username: string
): Promise<ActionResult> {
  try {
    const res = await fetch(
      `${BASE}/api/auth/check-id?loginId=${encodeURIComponent(username)}`
    );
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    if (res.status === 409) {
      return { ok: false, error: body.message ?? "이미 사용 중인 아이디입니다." };
    }
    return { ok: false, error: "아이디 확인 중 오류가 발생했습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function sendSms(phone: string): Promise<ActionResult> {
  const normalizedPhone = phone.replace(/[^0-9]/g, "");
  try {
    const res = await fetch(`${BASE}/api/auth/sms/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalizedPhone }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.message ?? "인증번호 발송에 실패했습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function verifySms(
  phone: string,
  code: string
): Promise<ActionResult> {
  const normalizedPhone = phone.replace(/[^0-9]/g, "");
  try {
    const res = await fetch(`${BASE}/api/auth/sms/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalizedPhone, authCode: code }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    if (res.status === 400) {
      return { ok: false, error: body.message ?? "인증번호가 일치하지 않습니다." };
    }
    if (res.status === 401) {
      return { ok: false, error: body.message ?? "인증 시간이 만료되었습니다. 다시 시도해 주세요." };
    }
    return { ok: false, error: "인증 처리 중 오류가 발생했습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export type LoginMeans = "PASSWORD" | "SIMPLE_PASSWORD" | "PATTERN" | "FACEID";

export async function loginWithHanaCert(
  loginId: string,
  means: LoginMeans,
  userPwd: string
): Promise<ActionResult> {
  try {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, means, userPwd }),
    });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.accessToken) {
        const jar = await cookies();
        jar.set("token", body.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }
      return { ok: true };
    }
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.message ?? "로그인에 실패했습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function signup(data: {
  username: string;
  password: string;
  name: string;
  age: string;
  phone: string;
}): Promise<ActionResult> {
  try {
    const res = await fetch(`${BASE}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loginId: data.username,
        userPwd: data.password,
        userNm: data.name,
        userAge: Number(data.age),
        userPhone: data.phone,
      }),
    });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.token) {
        const jar = await cookies();
        jar.set("token", body.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }
      return { ok: true };
    }
    const body = await res.json().catch(() => ({}));
    const fieldError =
      body.result && typeof body.result === "object"
        ? (Object.values(body.result as Record<string, string>)[0] ?? undefined)
        : undefined;
    return { ok: false, error: fieldError ?? body.message ?? "회원가입에 실패했습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}
