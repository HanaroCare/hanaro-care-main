"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";

type RouteGuardProps = {
  children: ReactNode;
};

/**
 * 앱 전역 경로 가드 컴포넌트
 * 온보딩 여부, 로그인 상태, 마지막 로그인 방식을 체크하여 리다이렉트 처리
 */
export default function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("HAS_SEEN_ONBOARDING");
    const lastLoginMethod = localStorage.getItem("LAST_LOGIN_METHOD"); // "HANA" | "ID_PW"
    const accessToken = localStorage.getItem("accessToken");

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname === "/onboarding";

    // 1. 온보딩 체크
    if (!hasSeenOnboarding && pathname !== "/onboarding") {
      router.replace("/onboarding");
      return;
    }

    // 2. 로그인 상태 체크
    if (accessToken) {
      if (isAuthPage) {
        router.replace("/");
        return;
      }
    } else {
      // 로그인이 필요한 상태 (accessToken 없음)
      if (!isAuthPage) {
        // [Case 2] 'LAST_LOGIN_METHOD'가 "HANA"이면? -> /login/hanaCert
        if (lastLoginMethod === "HANA") {
          router.replace("/login/hanaCert");
        } 
        // [Case 3] 'LAST_LOGIN_METHOD'가 "ID_PW"이거나 기록이 없으면? -> /login
        else {
          router.replace("/login");
        }
        return;
      }
    }

    setIsChecking(false);
  }, [pathname, router]);

  if (isChecking) {
    return <div className="min-h-screen bg-background" />;
  }

  return <>{children}</>;
}
