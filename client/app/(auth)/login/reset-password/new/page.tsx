"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginHeader from "@/components/LoginHeader";
import AuthInput from "../../components/AuthInput";
import PrimaryButton from "@/components/PrimaryButton";

/**
 * 새 비밀번호 설정 페이지
 */
export default function NewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isFormValid = 
    password.length >= 8 && 
    confirmPassword.length >= 8 && 
    password === confirmPassword;

  const handleComplete = () => {
    if (isFormValid) {
      console.log("Password reset successful");
      // TODO: 비밀번호 변경 API 호출
      alert("비밀번호가 성공적으로 변경되었습니다.");
      router.push("/login");
    }
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout">
        <LoginHeader title="비밀번호 재설정" />

        <main className="app-main flex flex-col px-[1.5rem]">
          <div className="pt-[2.5rem] pb-[2rem]">
            <h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
              새로운 비밀번호를
              <br />
              입력해 주세요
            </h2>
            <p className="mt-[0.75rem] text-[0.875rem] text-muted-foreground">
              영문, 숫자, 특수문자를 포함하여 8자 이상 입력해주세요.
            </p>
          </div>

          <div className="flex flex-col gap-[1.25rem]">
            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.875rem] font-semibold text-hana-black-900 ml-[0.2rem]">새 비밀번호</label>
              <AuthInput
                id="password"
                type="password"
                placeholder="새 비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.875rem] font-semibold text-hana-black-900 ml-[0.2rem]">비밀번호 확인</label>
              <AuthInput
                id="confirmPassword"
                type="password"
                placeholder="비밀번호 다시 입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <p className="ml-[0.2rem] mt-[0.25rem] text-[0.75rem] text-hana-red-500">
                  비밀번호가 일치하지 않습니다.
                </p>
              )}
            </div>
          </div>

          <div className="mt-auto pb-[3rem]">
            <PrimaryButton
              label="변경 완료"
              disabled={!isFormValid}
              onClick={handleComplete}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
