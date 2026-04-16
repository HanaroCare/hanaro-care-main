"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "../components/AuthInput";
import PhoneVerificationField from "../components/PhoneVerificationField";
import Header from "@/components/navigation/Header";
import PrimaryButton from "@/components/baseelements/PrimaryButton";
import { sendPasswordFindCode } from "../actions/auth";

const RESET_ERROR = "입력하신 정보와 일치하는 회원이 없습니다.";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isFieldLocked, setIsFieldLocked] = useState(false);
  const [sendCodeError, setSendCodeError] = useState("");

  useEffect(() => {
    setSendCodeError("");
    setIsVerified(false);
    setIsFieldLocked(false);
  }, []);

  const isIdValid = useMemo(() => userId.trim().length > 0, [userId]);
  const isNameValid = useMemo(() => name.trim().length > 0, [name]);
  const isPhoneReady = useMemo(
    () => phone.replace(/[^0-9]/g, "").length === 11,
    [phone]
  );
  const canRequestCode = isIdValid && isNameValid && isPhoneReady;
  const isFormValid = useMemo(
    () => isIdValid && isNameValid && isVerified,
    [isIdValid, isNameValid, isVerified]
  );

  const clearError = () => {
    if (sendCodeError) setSendCodeError("");
  };

  const handleRequestCode = async () => {
    try {
      const result = await sendPasswordFindCode(userId, name, phone);
      if (!result.ok) {
        setSendCodeError(RESET_ERROR);
        setIsFieldLocked(false);
        return { ok: false as const, error: RESET_ERROR };
      }
      setSendCodeError("");
      return { ok: true as const };
    } catch {
      setSendCodeError(RESET_ERROR);
      setIsFieldLocked(false);
      return { ok: false as const, error: RESET_ERROR };
    }
  };

  const handleNext = () => {
    if (!isFormValid) return;
    const params = new URLSearchParams({
      loginId: userId.trim(),
      username: name.trim(),
      phoneNumber: phone.replace(/[^0-9]/g, ""),
    });
    router.push(`/login/reset-password/new?${params.toString()}`);
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout">
        <Header title="비밀번호 재설정" showBackButton={true} showCloseButton={false} />

        <main className="app-main flex flex-col px-[1.5rem]">
          <div className="pt-[2.5rem] pb-[2rem]">
            <h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
              <span className="text-primary">비밀번호</span> 재설정을 위해
              <br />
              본인 확인을 해주세요
            </h2>
          </div>

          <div className="flex flex-col gap-[1.25rem] mb-[2rem]">
            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.875rem] font-semibold text-hana-black-900 ml-[0.2rem]">아이디</label>
              <AuthInput
                id="userId"
                placeholder="아이디를 입력해 주세요"
                value={userId}
                onChange={(e) => { setUserId(e.target.value); clearError(); }}
                disabled={isFieldLocked}
              />
            </div>

            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.875rem] font-semibold text-hana-black-900 ml-[0.2rem]">이름</label>
              <AuthInput
                id="name"
                placeholder="이름을 입력해 주세요"
                value={name}
                onChange={(e) => { setName(e.target.value); clearError(); }}
                disabled={isFieldLocked}
              />
            </div>

            <PhoneVerificationField
              phone={phone}
              onPhoneChange={(v) => { setPhone(v); clearError(); }}
              onRequestCode={canRequestCode ? handleRequestCode : undefined}
              externalError={sendCodeError}
              onClearExternalError={clearError}
              onVerified={() => {
                setIsVerified(true);
                setIsFieldLocked(true);
              }}
            />
          </div>

          <div className="pb-[3rem]">
            <PrimaryButton
              label="다음"
              disabled={!isFormValid}
              onClick={handleNext}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
