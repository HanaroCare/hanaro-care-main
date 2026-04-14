"use client";

import PrimaryButton from "@/components/baseelements/PrimaryButton";
import Header from "@/components/navigation/Header";
import { useRouter } from "next/navigation";

const maskId = (id: string): string => {
  if (!id) return "";
  const len = id.length;

  if (len <= 3) {
    return id.charAt(0) + "*".repeat(len - 1);
  }

  const visibleStart = 3;
  const visibleEnd = 2;

  if (len <= visibleStart + visibleEnd) {
    return id.substring(0, 2) + "*".repeat(len - 2);
  }

  const maskedPart = "*".repeat(len - (visibleStart + visibleEnd));
  return id.substring(0, visibleStart) + maskedPart + id.substring(len - visibleEnd);
};

export default function FindIdResultPage() {
  const router = useRouter();

  // TODO: 실제로는 API를 통해 조회한 값을 props나 상태로 받아와야 함
  const foundId = "hana1234";

  return (
    <div className="app-shell bg-background">
      <div className="app-layout">
        <Header title="아이디 찾기 결과" showBackButton={true} showCloseButton={false} />

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
            <span className="text-[1.25rem] font-bold text-primary">
              {maskId(foundId)}
            </span>
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