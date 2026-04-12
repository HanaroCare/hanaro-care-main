"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginHeader from "@/components/LoginHeader";
import AuthInput from "../components/AuthInput";
import PrimaryButton from "@/components/PrimaryButton";

/**
 * 비밀번호 재설정 페이지
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");

  const isFormValid = userId.length > 0 && phone.length >= 10;

  const handleResetRequest = () => {
    if (isFormValid) {
      console.log("Reset Password for:", { userId, phone });
      router.push("/login/reset-password/new");
    }
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout">
        <LoginHeader title="비밀번호 재설정" />

        <main className="app-main flex flex-col px-[1.5rem]">
          <div className="pt-[2.5rem] pb-[2rem]">
            <h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
              본인 확인을 위해
              <br />
              정보를 입력해 주세요
            </h2>
          </div>

          <div className="flex flex-col gap-[1.25rem]">
            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.875rem] font-semibold text-hana-black-900 ml-[0.2rem]">아이디</label>
              <AuthInput
                id="userId"
                placeholder="아이디를 입력해 주세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.875rem] font-semibold text-hana-black-900 ml-[0.2rem]">휴대폰 번호</label>
              <AuthInput
                id="phone"
                type="tel"
                placeholder="'-' 없이 숫자만 입력"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-auto pb-[3rem]">
            <PrimaryButton
              label="다음"
              disabled={!isFormValid}
              onClick={handleResetRequest}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
