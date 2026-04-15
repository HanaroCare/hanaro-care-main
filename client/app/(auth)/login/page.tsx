"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/navigation/Header";
import Link from "next/link";
import LoginForm from "./components/LoginForm";
import { loginAction } from "./actions/login";

type LoginSubmitData = {
  id: string;
  pw: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (data: LoginSubmitData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const result = await loginAction(data.id, data.pw);

      if (result.success) {
        router.replace("/");
      } else {
        alert(result.error ?? "로그인에 실패했습니다.");
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
        <Header title="로그인" showBackButton={false} showCloseButton={false} />

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
