"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

type RouteGuardProps = {
  children: ReactNode;
};

/**
 * 앱 전역 경로 가드 컴포넌트
 * 온보딩 여부 및 로그인 방식 기반 리다이렉트 보조
 */
export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("HAS_SEEN_ONBOARDING");
    const lastLoginMethod = localStorage.getItem("LAST_LOGIN_METHOD"); // "HANA" | "ID_PW"

    const isAuthPage = pathname.startsWith("/login") ||
        pathname.startsWith("/signup") ||
        pathname === "/onboarding";

    if (!hasSeenOnboarding && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }

    /**
     * [핵심 변경 사항]
     * 이제 accessToken 여부는 서버(proxy/middleware)가 판단합니다.
     * 클라이언트에서는 '토큰이 없어서 튕겨내는 로직'을 제거합니다.
     * 대신, 로그인이 안 된 유저가 보호된 페이지에 접근하면 서버 프록시가 /login으로 보낼 것이고,
     * 우리는 여기서 '어디로 보낼지(HANA 인증인지 ID/PW인지)'에 대한 경로 보조만 수행할 수 있습니다.
     */

    // 만약 로그인이 안 된 상태라면 (서버가 /login으로 리다이렉트 시켰다면)
    // 혹은 사용자가 수동으로 /login에 접근했을 때, 마지막 로그인 방식에 따라 자동 이동
    if (pathname === "/login") {
      if (lastLoginMethod === "HANA") {
        router.replace("/login/hanaCert");
        return;
      }
    }

    setIsChecking(false);
  }, [pathname, router]);

  // 체크 중일 때는 빈 화면을 보여주어 깜빡임(Flash of unauthenticated content)을 방지합니다.
  if (isChecking) {
    return <div className="min-h-screen bg-white" />;
  }

  return <>{children}</>;
}
