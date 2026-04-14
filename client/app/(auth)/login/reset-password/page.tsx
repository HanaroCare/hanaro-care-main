"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "../components/AuthInput";
import { validatePhone } from "../utils/validators";
import Header from "@/components/navigation/Header";
import PrimaryButton from "@/components/baseelements/PrimaryButton";

/**
 * 비밀번호 재설정 페이지
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");

  const isIdValid = useMemo(() => userId.trim().length > 0, [userId]);
  const isPhoneValid = useMemo(() => validatePhone(phone), [phone]);

  const isFormValid = useMemo(() => isIdValid && isPhoneValid, [isIdValid, isPhoneValid]);

  const handleResetRequest = () => {
    if (isFormValid) {
      router.push("/login/reset-password/new");
    }
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout">
        <Header title="비밀번호 재설정" showBackButton={true} showCloseButton={false} />

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
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
              {phone.length > 0 && !isPhoneValid && (
                <p className="ml-[0.2rem] mt-[0.25rem] text-[0.75rem] text-hana-red-500">
                  010으로 시작하는 11자리 숫자를 입력해주세요.
                </p>
              )}
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
