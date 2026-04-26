"use server";

import { cookies } from "next/headers";

const BASE = process.env.SPRING_API_URL ?? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

type ActionResult = { ok: true } | { ok: false; error: string; detail?: unknown };

export type LoginMeans = "PASSWORD" | "SIMPLE_PASSWORD" | "PATTERN" | "FACEID";

export type LoginResult =
  | { ok: true; isPasswordExpired: boolean }
  | { ok: false; error: string; isDormant?: false }
  | { ok: false; error: string; isDormant: true };

export async function login(loginId: string, userPwd: string): Promise<LoginResult> {
  try {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, means: "PASSWORD", userPwd }),
    });

    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      if (body.accessToken) {
        const jar = await cookies();
        jar.set("ACCESS_TOKEN", body.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }
      return { ok: true, isPasswordExpired: body.isPasswordExpired === true };
    }

    const body = await res.json().catch(() => ({}));
    if (res.status === 403 && body.code === "AUTH_009") {
      return { ok: false, error: body.message ?? "휴면 계정입니다.", isDormant: true };
    }
    if (res.status === 403 && body.code === "AUTH_015") {
      return { ok: false, error: "탈퇴 처리된 계정입니다. 고객센터에 문의해주세요." };
    }
    return { ok: false, error: body.message ?? "로그인에 실패했습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function loginWithHanaCert(
  loginId: string,
  means: LoginMeans,
  userPwd: string
): Promise<LoginResult> {
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
        jar.set("ACCESS_TOKEN", body.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }
      return { ok: true, isPasswordExpired: body.isPasswordExpired === true };
    }

    const body = await res.json().catch(() => ({}));
    if (res.status === 403 && body.code === "AUTH_009") {
      return { ok: false, error: body.message ?? "휴면 계정입니다.", isDormant: true };
    }
    if (res.status === 403 && body.code === "AUTH_015") {
      return { ok: false, error: "탈퇴 처리된 계정입니다. 고객센터에 문의해주세요." };
    }
    return { ok: false, error: body.message ?? "로그인에 실패했습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function sendSms(phone: string, loginId: string): Promise<ActionResult> {
  const userPhone = phone.replace(/[^0-9]/g, "");
  try {
    const res = await fetch(`${BASE}/api/auth/sms/send/dormant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, userPhone }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.message ?? "등록된 휴대폰 번호와 일치하지 않습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function unlockDormant(loginId: string, newUserPwd: string): Promise<ActionResult> {
  try {
    const res = await fetch(`${BASE}/api/auth/unlock-dormant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId, newUserPwd }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.message ?? "휴면 해제에 실패했습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function resetPassword(
  loginId: string,
  username: string,
  phoneNumber: string,
  newPassword: string
): Promise<ActionResult> {
  try {
    const res = await fetch(`${BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loginId: loginId.trim(),
        username: username.trim(),
        phoneNumber: phoneNumber.replace(/[^0-9]/g, ""),
        newPassword,
      }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.message ?? "비밀번호 변경에 실패했습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function sendFindIdSms(phone: string): Promise<ActionResult> {
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

export async function checkUserNameExists(userNm: string): Promise<ActionResult> {
  try {
    const res = await fetch(
      `${BASE}/api/auth/check-user-name?userNm=${encodeURIComponent(userNm.trim())}`
    );
    const body = await res.json().catch(() => ({}));
    if (res.ok && body.isSuccess !== false) return { ok: true };
    return { ok: false, error: body.message ?? "등록되지 않은 정보입니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function checkLoginIdExists(loginId: string): Promise<ActionResult> {
  try {
    const res = await fetch(
      `${BASE}/api/auth/check-user?loginId=${encodeURIComponent(loginId.trim())}`
    );
    const body = await res.json().catch(() => ({}));
    // HTTP 2xx AND isSuccess:true → 아이디 존재
    if (res.ok && body.isSuccess !== false) return { ok: true };
    return { ok: false, error: body.message ?? "등록되지 않은 아이디입니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function checkNameExists(loginId: string, userNm: string): Promise<ActionResult> {
  try {
    const res = await fetch(
      `${BASE}/api/auth/check-name?loginId=${encodeURIComponent(loginId.trim())}&userNm=${encodeURIComponent(userNm.trim())}`
    );
    const body = await res.json().catch(() => ({}));
    // HTTP 2xx AND isSuccess:true → 이름+아이디 조합 존재
    if (res.ok && body.isSuccess !== false) return { ok: true };
    return { ok: false, error: body.message ?? "등록되지 않은 이름입니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function sendPasswordFindCode(
  loginId: string,
  username: string,
  phoneNumber: string
): Promise<ActionResult> {
  const normalizedPhone = phoneNumber.replace(/[^0-9]/g, "");
  try {
    const res = await fetch(`${BASE}/api/auth/sms/send/password-find`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        loginId: loginId.trim(),
        userNm: username.trim(),
        userPhone: normalizedPhone,
      }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.message ?? "입력하신 정보와 일치하는 회원이 없습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}
