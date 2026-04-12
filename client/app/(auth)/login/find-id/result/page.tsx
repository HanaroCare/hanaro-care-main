"use client";

import { useRouter } from "next/navigation";
import LoginHeader from "@/components/LoginHeader";
import PrimaryButton from "@/components/PrimaryButton";

/**
 * 아이디 찾기 결과 페이지
 */
export default function FindIdResultPage() {
  const router = useRouter();

  // TODO API를 통해 조회한 값을 표시
  const foundId = "hana1234";

  return (
    <div className="app-shell bg-background">
      <div className="app-layout">
        <LoginHeader title="아이디 찾기 결과" />

        <main className="app-main flex flex-col px-[1.5rem]">
          <div className="pt-[2.5rem] pb-[3rem] text-center">
            <h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
              아이디를 찾았습니다
            </h2>
            <p className="mt-[0.75rem] text-[1rem] text-muted-foreground">
              정보와 일치하는 아이디입니다.
            </p>
          </div>

          <div className="rounded-[1rem] bg-gray-50 p-[2rem] text-center">
            <span className="text-[1.25rem] font-bold text-primary">{foundId}</span>
          </div>

          <div className="mt-auto flex flex-col gap-[1rem] pb-[3rem]">
            <PrimaryButton
              label="로그인하기"
              onClick={() => router.push("/login")}
            />
            <button
              type="button"
              onClick={() => router.push("/login/reset-password")}
              className="text-[0.875rem] text-muted-foreground underline underline-offset-4"
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
