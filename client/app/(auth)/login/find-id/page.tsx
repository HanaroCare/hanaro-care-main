"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "../components/AuthInput";
import PhoneVerificationField from "../components/PhoneVerificationField";
import Header from "@/components/navigation/Header";
import PrimaryButton from "@/components/baseelements/PrimaryButton";
import { findId } from "../actions/user";

const FIND_ID_ERROR = "입력하신 정보와 일치하는 회원이 없습니다.";

export default function FindIdPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isFieldLocked, setIsFieldLocked] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    setIsVerified(false);
    setIsFieldLocked(false);
  }, []);

  const clearError = () => {
    if (error) setError("");
  };

  const isNameValid = useMemo(() => name.trim().length > 0, [name]);
  const isFormValid = useMemo(() => isNameValid && isVerified, [isNameValid, isVerified]);

  const handleFindId = async () => {
    if (!isFormValid || isPending) return;
    setIsPending(true);
    setError("");
    try {
      const result = await findId(name, phone);
      if (result.ok) {
        router.push(`/login/find-id/result?loginId=${encodeURIComponent(result.loginId)}`);
      } else {
        setError(FIND_ID_ERROR);
        setIsFieldLocked(false);
      }
    } catch {
      setError(FIND_ID_ERROR);
      setIsFieldLocked(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout">
        <Header title="아이디 찾기" showBackButton={true} showCloseButton={false} />

        <main className="app-main flex flex-col px-[1.5rem]">
          <div className="pt-[2.5rem] pb-[2rem]">
            <h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
              등록된 정보로
              <br />
              <span className="text-primary">아이디</span>를 찾아보세요
            </h2>
          </div>

          <div className="flex flex-col gap-[1.25rem] mb-[2rem]">
            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.875rem] font-semibold text-hana-black-900 ml-[0.2rem]">이름</label>
              <AuthInput
                id="name"
                placeholder="이름을 입력해 주세요"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearError();
                }}
                disabled={isFieldLocked}
              />
            </div>

            <PhoneVerificationField
              phone={phone}
              onPhoneChange={(v) => {
                setPhone(v);
                clearError();
              }}
              onVerified={() => {
                setIsVerified(true);
                setIsFieldLocked(true);
              }}
              externalError={error}
              onClearExternalError={clearError}
            />
          </div>

          <div className="mt-auto pt-[3rem] pb-[3rem]">
            <PrimaryButton
              label={isPending ? "조회 중..." : "아이디 찾기"}
              disabled={!isFormValid || isPending}
              onClick={handleFindId}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
