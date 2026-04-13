"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm from "./components/LoginForm";
import { useState } from "react";

type LoginSubmitData = {
  id: string;
  pw: string;
};

/**
 * 일반 로그인 페이지 (아이디/비밀번호)
 */
export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (data: LoginSubmitData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      /**
       * TODO: 실제 API 연동 로직
       * const response = await fetch("/api/auth/login", { ... });
       * const result = await response.json();
       */

      // 실제 연동 시 result.success 으로 교체
      const verificationSuccess = true;

      if (verificationSuccess) {
        localStorage.setItem("accessToken", "temp-token");
        localStorage.setItem("LAST_LOGIN_METHOD", "ID_PW");
        localStorage.setItem("HAS_SEEN_ONBOARDING", "true");
        router.replace("/");
      } else {
        alert("아이디 또는 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("로그인 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout">
        {/* <Header title="로그인" showBackButton={true} showCloseButton={false} /> */}

        <main className="app-main flex flex-col px-[1.5rem]">
          <div className="pt-[2.5rem] pb-[2rem]">
            <h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
              반가워요!
              <br />
              정보를 입력해 주세요
            </h2>
          </div>

          <LoginForm onSubmit={handleLoginSubmit} />

          <div className="mt-[2rem] flex items-center justify-center text-[0.875rem]">
            <Link
              href="/login/find-id"
              className="px-[0.75rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              아이디 찾기
            </Link>

            <div className="h-[0.75rem] w-[1px] bg-border/50" />

            <Link
              href="/login/reset-password"
              className="px-[0.75rem] text-muted-foreground transition-colors hover:text-foreground"
            >
              비밀번호 재설정
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}