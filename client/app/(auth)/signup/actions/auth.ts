"use server";

import { cookies } from "next/headers";

const BASE = process.env.SPRING_API_URL ?? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

type ActionResult = { ok: true; error?: never } | { ok: false; error: string };

export async function checkUsernameAvailability(username: string): Promise<ActionResult> {
  try {
    const res = await fetch(`${BASE}/api/auth/check-id?loginId=${encodeURIComponent(username)}`);
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

export async function sendSignupSms(phone: string): Promise<ActionResult> {
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

export async function verifySms(phone: string, code: string): Promise<ActionResult> {
  const normalizedPhone = phone.replace(/[^0-9]/g, "");
  try {
    const res = await fetch(`${BASE}/api/auth/sms/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: normalizedPhone, authCode: code }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.message ?? "인증번호가 일치하지 않습니다." };
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
        jar.set("ACCESS_TOKEN", body.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }
      return { ok: true };
    }
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.message ?? "회원가입에 실패했습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}
