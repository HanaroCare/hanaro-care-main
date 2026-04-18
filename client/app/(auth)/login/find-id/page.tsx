"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "../components/AuthInput";
import PhoneVerificationField from "../components/PhoneVerificationField";
import Header from "@/components/navigation/Header";
import PrimaryButton from "@/components/baseelements/PrimaryButton";
import { findId } from "../actions/user";
import { sendFindIdSms, checkUserNameExists } from "../actions/auth";

const NAME_LENGTH_ERROR = "이름은 2글자 이상 20자 이하로 입력해주세요.";
const FIND_ID_ERROR = "입력하신 정보와 일치하는 회원이 없습니다.";

export default function FindIdPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isFieldLocked, setIsFieldLocked] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [sendError, setSendError] = useState("");

  const [nameError, setNameError] = useState("");
  const [isNameVerified, setIsNameVerified] = useState(false);
  const isCheckingNameRef = useRef(false);

  const isPhoneReady = useMemo(
    () => phone.replace(/[^0-9]/g, "").length === 11,
    [phone]
  );
  const isPhoneEnabled = isNameVerified && !nameError && !isFieldLocked;
  const canRequestCode = isPhoneEnabled && isPhoneReady;
  const isFormValid = isNameVerified && !nameError && isVerified;

  const validateFindIdName = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed || isCheckingNameRef.current) return;

    // 길이 검사 (서버 호출 전)
    if (trimmed.length < 2 || trimmed.length > 20) {
      setNameError(NAME_LENGTH_ERROR);
      setIsNameVerified(false);
      return;
    }

    isCheckingNameRef.current = true;
    try {
      const result = await checkUserNameExists(trimmed);
      if (!result.ok) {
        setNameError(result.error ?? "등록되지 않은 정보입니다.");
        setIsNameVerified(false);
      } else {
        setNameError("");
        setIsNameVerified(true);
        // 이름 확인 후 휴대폰 필드로 포커스 이동
        setTimeout(() => document.getElementById("phone")?.focus(), 50);
      }
    } finally {
      isCheckingNameRef.current = false;
    }
  }, [name]);

  const handleRequestCode = async () => {
    // 이름이 검증되지 않은 경우 차단 (안전망)
    if (!isNameVerified || nameError) {
      return { ok: false as const, error: "이름을 먼저 확인해 주세요." };
    }
    const result = await sendFindIdSms(phone);
    if (!result.ok) setSendError(result.error);
    return result;
  };

  const handleFindId = async () => {
    if (!isFormValid || isPending) return;
    setIsPending(true);
    setSendError("");
    try {
      const result = await findId(name, phone);
      if (result.ok) {
        router.push(`/login/find-id/result?loginId=${encodeURIComponent(result.loginId)}`);
      } else {
        setSendError(FIND_ID_ERROR);
        setIsFieldLocked(false);
      }
    } catch {
      setSendError(FIND_ID_ERROR);
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
                  setNameError("");
                  setIsNameVerified(false);
                }}
                onBlur={() => { validateFindIdName(); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    validateFindIdName();
                  }
                }}
                disabled={isFieldLocked}
                autoComplete="name"
              />
              {nameError && (
                <p className="ml-[0.2rem] text-[0.75rem] text-hana-red-500 animate-in fade-in slide-in-from-top-1">
                  {nameError}
                </p>
              )}
            </div>

            <PhoneVerificationField
              phone={phone}
              onPhoneChange={(v) => {
                setPhone(v);
                if (sendError) setSendError("");
              }}
              onRequestCode={canRequestCode ? handleRequestCode : undefined}
              onVerified={() => {
                setIsVerified(true);
                setIsFieldLocked(true);
              }}
              externalError={sendError}
              onClearExternalError={() => { if (sendError) setSendError(""); }}
              disabled={!isPhoneEnabled}
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
