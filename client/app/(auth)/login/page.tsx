"use client";

import LoginHeader from "@/components/LoginHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginForm from "./components/LoginForm";

/**
 * 일반 로그인 페이지 (아이디/비밀번호)
 */
export default function LoginPage() {
  const router = useRouter();

  const handleLoginSubmit = (data: { id: string; pw: string }) => {
    console.log("Login Attempt:", data);
    // TODO: 로그인 로직 구현
    router.push("/");
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout">
        <LoginHeader title="로그인" />

        <main className="app-main flex flex-col px-[1.5rem]">
          <div className="pt-[2.5rem] pb-[2rem]">
            <h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
              반가워요!
              <br />
              정보를 입력해 주세요
            </h2>
          </div>

          <LoginForm onSubmit={handleLoginSubmit} />

          <div className="mt-[1.5rem] flex justify-center gap-[1rem] divide-x divide-border">
            <Link
              href="/login/find-id"
              className="text-[0.875rem] text-muted-foreground hover:text-foreground"
            >
              아이디 찾기
            </Link>
            <Link
              href="/login/reset-password"
              className="pl-[1rem] text-[0.875rem] text-muted-foreground hover:text-foreground"
            >
              비밀번호 재설정
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
