"use client";

import { useState, useEffect, useRef } from "react";
import AuthInput from "./AuthInput";
import { verifySms } from "@/app/(auth)/signup/actions/auth";
import { validatePhone } from "../utils/validators";
import { sendSms } from "../actions/auth";

interface PhoneVerificationFieldProps {
  loginId?: string;
  phone: string;
  onPhoneChange: (value: string) => void;
  onVerified: () => void;
  onRequestCode?: () => Promise<{ ok: boolean; error?: string }>;
  externalError?: string;
  onClearExternalError?: () => void;
  disabled?: boolean;
}

export default function PhoneVerificationField({
  phone,
  loginId = "",
  onPhoneChange,
  onVerified,
  onRequestCode,
  externalError,
  onClearExternalError,
  disabled = false,
}: PhoneVerificationFieldProps) {
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sendError, setSendError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPhoneValid = validatePhone(phone);
  const displayError = externalError ?? sendError;

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(300);
    setIsExpired(false);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleRequestCode = async () => {
    if (isSending || (!onRequestCode && !isPhoneValid) || isVerified || disabled) return;
    if (!onRequestCode && !loginId) {
      setSendError("아이디 정보가 필요합니다.");
      return;
    }
    setIsSending(true);
    setSendError("");
    setVerifyError("");
    setOtp("");
    const result = onRequestCode ? await onRequestCode() : await sendSms(phone, loginId);
    setIsSending(false);
    if (result.ok) {
      setCodeSent(true);
      startTimer();
    } else if (!onRequestCode) {
      setSendError(result.error ?? "");
    }
  };

  const handleVerifyCode = async () => {
    if (isVerifying || otp.length !== 6 || isExpired || isVerified || disabled) return;
    setIsVerifying(true);
    setVerifyError("");
    const result = await verifySms(phone, otp);
    setIsVerifying(false);
    if (result.ok) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsVerified(true);
      onVerified();
    } else {
      setVerifyError(result.error);
      setOtp("");
    }
  };

  return (
    <div className="flex flex-col gap-[0.5rem]">
      <label className="text-[0.875rem] font-semibold text-hana-black-900 ml-[0.2rem]">
        휴대폰 번호
      </label>

      <div className="flex gap-[0.5rem]">
        <div className="flex-1">
          <AuthInput
            id="phone"
            type="tel"
            placeholder="'-' 없이 숫자만 입력"
            value={phone}
            onChange={(e) => {
              onPhoneChange(e.target.value.replace(/\D/g, ""));
              onClearExternalError?.();
              if (sendError) setSendError("");
            }}
            disabled={isVerified || disabled}
          />
        </div>
        <button
          type="button"
          onClick={handleRequestCode}
          disabled={
            (!onRequestCode && !isPhoneValid) || isSending || isVerified || disabled
          }
          className="h-[3.5rem] shrink-0 rounded-[0.75rem] bg-hana-ez-600 px-[1rem] text-[0.875rem] font-semibold text-white transition-opacity disabled:opacity-40 whitespace-nowrap"
        >
          {isSending ? "발송 중" : codeSent ? "재발송" : "인증요청"}
        </button>
      </div>

      {phone.length > 0 && !isPhoneValid && !codeSent && !displayError && (
        <p className="ml-[0.2rem] text-[0.75rem] text-hana-red-500">
          010으로 시작하는 11자리 숫자를 입력해주세요.
        </p>
      )}
      {displayError && (
        <p className="ml-[0.2rem] text-[0.75rem] text-hana-red-500 animate-in fade-in slide-in-from-top-1">
          {displayError}
        </p>
      )}

      {codeSent && (
        <div className="flex flex-col gap-[0.5rem] mb-[4rem]">
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              placeholder="인증번호 6자리"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setVerifyError("");
              }}
              disabled={isVerified || isExpired || isVerifying || disabled}
              className="h-[3.5rem] w-full rounded-[0.75rem] border border-gray-200 bg-white px-[1rem] pr-[5.5rem] text-[1rem] text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
            <span
              className={`absolute right-[1rem] top-1/2 -translate-y-1/2 text-[0.875rem] font-semibold tabular-nums ${isVerified ? "text-hana-ez-600" : isExpired ? "text-hana-red-500" : "text-hana-ez-600"
                }`}
            >
              {isVerified ? "인증완료" : isExpired ? "만료" : formatTime(timeLeft)}
            </span>
          </div>

          {verifyError && (
            <p className="ml-[0.2rem] text-[0.75rem] text-hana-red-500 animate-in fade-in slide-in-from-top-1">
              {verifyError}
            </p>
          )}

          <button
            type="button"
            onClick={handleVerifyCode}
            disabled={isVerified || otp.length !== 6 || isVerifying || isExpired || disabled}
            className={`h-[3.5rem] w-full rounded-[0.75rem] border text-[1rem] font-semibold transition-opacity ${isVerified
              ? "cursor-default border-hana-ez-600 bg-hana-ez-600/10 text-hana-ez-600"
              : "border-hana-ez-600 text-hana-ez-600 disabled:opacity-40"
              }`}
          >
            {isVerified ? "인증 완료" : isVerifying ? "확인 중..." : "인증 확인"}
          </button>
        </div>
      )}
    </div>
  );
}
