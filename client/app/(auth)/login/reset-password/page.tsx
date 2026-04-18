"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "../components/AuthInput";
import PhoneVerificationField from "../components/PhoneVerificationField";
import Header from "@/components/navigation/Header";
import PrimaryButton from "@/components/baseelements/PrimaryButton";
import {
  sendPasswordFindCode,
  checkNameExists,
  checkLoginIdExists,
} from "../actions/auth";

const RESET_ERROR = "입력하신 정보와 일치하는 회원이 없습니다.";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [isIdPrefilled, setIsIdPrefilled] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isFieldLocked, setIsFieldLocked] = useState(false);
  const [sendCodeError, setSendCodeError] = useState("");

  const [idError, setIdError] = useState("");
  const [nameError, setNameError] = useState("");
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [isNameVerified, setIsNameVerified] = useState(false);

  const isCheckingIdRef = useRef(false);
  const isCheckingNameRef = useRef(false);

  useEffect(() => {
    const storedId = sessionStorage.getItem("RESET_LOGIN_ID");
    if (storedId) {
      setUserId(storedId);
      setIsIdPrefilled(true);
      setIsIdVerified(true);
      sessionStorage.removeItem("RESET_LOGIN_ID");
    }
  }, []);

  const isPhoneEnabled =
    isIdVerified && isNameVerified && !idError && !nameError && !isFieldLocked;

  const isPhoneReady = useMemo(
    () => phone.replace(/[^0-9]/g, "").length === 11,
    [phone]
  );

  const canRequestCode = isPhoneEnabled && isPhoneReady;

  const isFormValid = useMemo(
    () => isIdVerified && isNameVerified && !idError && !nameError && isVerified,
    [isIdVerified, isNameVerified, idError, nameError, isVerified]
  );

  const validateId = useCallback(async () => {
    const trimmedId = userId.trim();
    if (!trimmedId || isCheckingIdRef.current) return;
    isCheckingIdRef.current = true;
    try {
      const result = await checkLoginIdExists(trimmedId);
      if (!result.ok) {
        setIdError(result.error ?? "등록되지 않은 아이디입니다.");
        setIsIdVerified(false);
        // 아이디가 틀리면 이름 검증 상태도 초기화
        setIsNameVerified(false);
        setNameError("");
      } else {
        setIdError("");
        setIsIdVerified(true);
        // 아이디 검증 통과 → 이름 필드로 포커스 이동
        setTimeout(() => document.getElementById("name")?.focus(), 50);
      }
    } finally {
      isCheckingIdRef.current = false;
    }
  }, [userId]);

  const validateName = useCallback(async () => {
    const trimmedName = name.trim();
    const trimmedId = userId.trim();
    if (!trimmedName || !trimmedId || isCheckingNameRef.current) return;

    // 이름 길이 유효성 검사 (서버 호출 전)
    if (trimmedName.length < 2 || trimmedName.length > 20) {
      setNameError("이름은 2글자 이상 20자 이하로 입력해주세요.");
      setIsNameVerified(false);
      return;
    }

    isCheckingNameRef.current = true;
    try {
      const result = await checkNameExists(trimmedId, trimmedName);
      if (!result.ok) {
        setNameError(result.error ?? "등록되지 않은 이름입니다.");
        setIsNameVerified(false);
      } else {
        setNameError("");
        setIsNameVerified(true);
        // 이름+아이디 조합이 DB에 존재 → 아이디도 암묵적으로 검증됨
        setIsIdVerified(true);
        setIdError("");
      }
    } finally {
      isCheckingNameRef.current = false;
    }
  }, [userId, name]);

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

          <form
            onSubmit={(e) => { e.preventDefault(); handleNext(); }}
            className="flex flex-col gap-[1.25rem] mb-[2rem]"
          >
            <div className="flex flex-col gap-[0.5rem]">
              <label className="text-[0.875rem] font-semibold text-hana-black-900 ml-[0.2rem]">아이디</label>
              <AuthInput
                id="userId"
                placeholder="아이디를 입력해 주세요"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setIdError("");
                  setIsIdVerified(false);
                  setNameError("");
                  setIsNameVerified(false);
                }}
                onBlur={isIdPrefilled ? undefined : () => { validateId(); }}
                onKeyDown={isIdPrefilled ? undefined : (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    validateId();
                  }
                }}
                disabled={isFieldLocked || isIdPrefilled}
                autoComplete="username"
              />
              {idError && (
                <p className="ml-[0.2rem] text-[0.75rem] text-hana-red-500 animate-in fade-in slide-in-from-top-1">
                  {idError}
                </p>
              )}
            </div>

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
                onBlur={() => { validateName(); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    validateName();
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
              onPhoneChange={(v) => { setPhone(v); if (sendCodeError) setSendCodeError(""); }}
              onRequestCode={canRequestCode ? handleRequestCode : undefined}
              externalError={sendCodeError}
              onClearExternalError={() => { if (sendCodeError) setSendCodeError(""); }}
              onVerified={() => {
                setIsVerified(true);
                setIsFieldLocked(true);
              }}
              disabled={!isPhoneEnabled}
            />

            <div className="pb-[3rem]">
              <PrimaryButton
                label="다음"
                disabled={!isFormValid}
                type="submit"
              />
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
