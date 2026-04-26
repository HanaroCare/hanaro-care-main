"use server";

const BASE = process.env.SPRING_API_URL ?? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080');

type ActionResult = { ok: true } | { ok: false; error: string };
type FindIdResult = { ok: true; loginId: string } | { ok: false; error: string };

export async function findId(name: string, phone: string): Promise<FindIdResult> {
  const username = name.trim();
  const phoneNumber = phone.trim().replace(/[^0-9]/g, "");
  try {
    const res = await fetch(`${BASE}/api/auth/find-id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, phoneNumber }),
    });
    if (res.ok) {
      const body = await res.json().catch(() => ({}));
      const loginId = body.result?.loginId ?? body.loginId ?? "";
      return { ok: true, loginId };
    }
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.message ?? "입력하신 정보와 일치하는 회원이 없습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}

export async function verifyUser(
  loginId: string,
  name: string,
  phone: string
): Promise<ActionResult> {
  const trimmedLoginId = loginId.trim();
  const userName = name.trim();
  const userPhone = phone.trim().replace(/[^0-9]/g, "");
  try {
    const res = await fetch(`${BASE}/api/users/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ loginId: trimmedLoginId, userName, userPhone }),
    });
    if (res.ok) return { ok: true };
    const body = await res.json().catch(() => ({}));
    return { ok: false, error: body.message ?? "일치하는 회원 정보가 없습니다." };
  } catch {
    return { ok: false, error: "서버 연결에 실패했습니다." };
  }
}
