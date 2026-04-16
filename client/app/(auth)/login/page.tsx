"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import LoginForm from "./components/LoginForm";
import { login } from "./actions/auth";

type LoginSubmitData = {
  id: string;
  pw: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const authType = localStorage.getItem("AUTH_TYPE");
    if (authType === "HANA_CERT") {
      router.replace("/login/hanaCert");
    }
  }, [router]);

  const handleLoginSubmit = async (data: LoginSubmitData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setLoginError("");

      const result = await login(data.id, data.pw);

      if (result.ok) {
        localStorage.setItem("HAS_SEEN_FONT_CONFIG", "true");
        localStorage.setItem("HAS_SEEN_ONBOARDING", "true");
        localStorage.setItem("AUTH_TYPE", "PASSWORD");
        document.cookie = "HAS_SEEN_FONT_CONFIG=true; path=/; max-age=31536000";
        document.cookie = "HAS_SEEN_ONBOARDING=true; path=/; max-age=31536000";
        document.cookie = "AUTH_TYPE=PASSWORD; path=/; max-age=31536000";
        router.replace("/");
      } else if (!result.ok && result.isDormant) {
        const confirmed = window.confirm(
          "6개월 이상 접속하지 않아 휴면 계정으로 전환되었습니다.\n\n서비스 이용을 위해 본인인증 후 휴면을 해제하시겠습니까?"
        );
        if (confirmed) {
          router.push(`/login/unlock-dormant?loginId=${encodeURIComponent(data.id)}`);
        }
      } else {
        setLoginError(result.error || "아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    } catch {
      setLoginError("로그인 중 서버 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout relative overflow-hidden flex flex-col h-full">
        <Header title="로그인" showBackButton={false} showCloseButton={false} />

        <main className="app-main flex flex-col px-[1.5rem] flex-1">
          <div className="pt-[2.5rem] pb-[2rem]">
            <h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
              반가워요!
              <br />
              정보를 입력해 주세요
            </h2>
          </div>

          <LoginForm onSubmit={handleLoginSubmit} isSubmitting={isSubmitting} />

          {loginError && (
            <p className="mt-[1rem] text-[0.8125rem] font-medium text-red-500 text-center animate-in fade-in slide-in-from-top-1">
              {loginError}
            </p>
          )}

          <div className="mt-[1.5rem] flex items-center justify-center text-[0.875rem]">
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