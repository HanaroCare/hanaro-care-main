"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import Header from "@/components/navigation/Header";
import { verifySms } from "@/app/(auth)/signup/actions/auth";
import { sendSms, unlockDormant } from "../actions/auth";

type Step = "phone" | "otp" | "password" | "done";

function UnlockDormantContent() {
  const router = useRouter();

  const [loginId, setLoginId] = useState<string>("");
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedId = sessionStorage.getItem("DORMANT_LOGIN_ID");

    if (!savedId) {
      router.replace("/login");
      return;
    }

    setLoginId(savedId);
  }, [router]);

  if (!loginId) return null;

  const handlePhoneSubmit = async () => {
    if (isLoading) return;
    setError("");

    const normalized = phone.replace(/[^0-9]/g, "");
    if (normalized.length !== 11) {
      setError("휴대폰 번호 11자리를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    const result = await sendSms(normalized, loginId);
    setIsLoading(false);

    if (result.ok) {
      setStep("otp");
    } else {
      setError(result.error || "등록된 휴대폰 번호와 일치하지 않습니다.");
    }
  };

  const handleOtpSubmit = async () => {
    if (isLoading) return;
    setError("");
    const normalized = phone.replace(/[^0-9]/g, "");
    setIsLoading(true);
    const result = await verifySms(normalized, otp.trim());
    setIsLoading(false);
    if (result.ok) {
      setStep("password");
    } else {
      setError(result.error);
    }
  };

  const handlePasswordSubmit = async () => {
    if (isLoading) return;
    setError("");
    if (newPwd.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (newPwd !== confirmPwd) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    setIsLoading(true);
    const result = await unlockDormant(loginId, newPwd);
    setIsLoading(false);
    if (result.ok) {
      sessionStorage.removeItem("DORMANT_LOGIN_ID");
      setStep("done");
    } else {
      setError(result.error);
    }
  };

  if (step === "done") {
    return (
      <div className="app-shell bg-background">
        <div className="app-layout flex flex-col h-full">
          <Header title="휴면 계정 해제" showBackButton={false} showCloseButton={false} />
          <main className="app-main flex flex-1 flex-col items-center justify-center px-[1.5rem] text-center gap-[1.5rem]">
            <div>
              <p className="text-[1.5rem] font-bold text-foreground">해제 완료!</p>
              <p className="mt-[0.75rem] text-[0.9375rem] text-muted-foreground">
                계정이 활성화되었습니다. 다시 로그인해주세요.
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="w-full rounded-[0.75rem] bg-hana-ez-600 py-[0.875rem] text-[1rem] font-semibold text-white"
            >
              로그인하러 가기
            </button>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell bg-background">
      <div className="app-layout flex flex-col h-full">
        <Header title="휴면 계정 해제" showBackButton={true} showCloseButton={false} />

        <main className="app-main flex flex-1 flex-col px-[1.5rem]">
          <div className="pt-[2.5rem] pb-[2rem]">
            <h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
              {step === "phone" && <>휴면 계정을<br />해제할게요</>}
              {step === "otp" && <>인증번호를<br />입력해주세요</>}
              {step === "password" && <>새 비밀번호를<br />설정해주세요</>}
            </h2>
            <p className="mt-[0.5rem] text-[0.9375rem] text-muted-foreground">
              {step === "phone" && "본인 인증을 위해 휴대폰 번호를 입력해주세요"}
              {step === "otp" && "문자로 발송된 6자리 인증번호를 입력해주세요"}
              {step === "password" && "새로운 비밀번호를 8자 이상 입력해주세요"}
            </p>
          </div>

          <div className="mb-[1.5rem] rounded-[0.75rem] bg-muted px-[1rem] py-[0.75rem]">
            <p className="text-[0.8125rem] text-muted-foreground">아이디</p>
            <p className="mt-[0.125rem] text-[1rem] font-semibold text-foreground">{loginId}</p>
          </div>

          <div className="flex flex-col gap-[0.75rem]">
            {step === "phone" && (
              <>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="휴대폰 번호 입력 (- 없이)"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError("");
                  }}
                  className="w-full rounded-[0.75rem] border border-border bg-background px-[1rem] py-[0.875rem] text-[1rem] outline-none focus:border-hana-ez-600"
                />
                <button
                  type="button"
                  onClick={handlePhoneSubmit}
                  disabled={isLoading || phone.replace(/[^0-9]/g, "").length !== 11}
                  className="w-full rounded-[0.75rem] bg-hana-ez-600 py-[0.875rem] text-[1rem] font-semibold text-white disabled:opacity-50"
                >
                  {isLoading ? "확인 중..." : "인증번호 받기"}
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="인증번호 6자리"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/[^0-9]/g, ""));
                    setError("");
                  }}
                  className="w-full rounded-[0.75rem] border border-border bg-background px-[1rem] py-[0.875rem] text-[1rem] outline-none focus:border-hana-ez-600"
                />
                <button
                  type="button"
                  onClick={handleOtpSubmit}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full rounded-[0.75rem] bg-hana-ez-600 py-[0.875rem] text-[1rem] font-semibold text-white disabled:opacity-50"
                >
                  {isLoading ? "확인 중..." : "인증 확인"}
                </button>
                <button
                  type="button"
                  onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
                  className="text-center text-[0.875rem] text-muted-foreground underline underline-offset-4"
                >
                  인증번호 재발송
                </button>
              </>
            )}

            {step === "password" && (
              <>
                <input
                  type="password"
                  placeholder="새 비밀번호 (8자 이상)"
                  value={newPwd}
                  onChange={(e) => { setNewPwd(e.target.value); setError(""); }}
                  className="w-full rounded-[0.75rem] border border-border bg-background px-[1rem] py-[0.875rem] text-[1rem] outline-none focus:border-hana-ez-600"
                />
                <input
                  type="password"
                  placeholder="비밀번호 확인"
                  value={confirmPwd}
                  onChange={(e) => { setConfirmPwd(e.target.value); setError(""); }}
                  className="w-full rounded-[0.75rem] border border-border bg-background px-[1rem] py-[0.875rem] text-[1rem] outline-none focus:border-hana-ez-600"
                />
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  disabled={isLoading || newPwd.length < 8 || confirmPwd.length === 0}
                  className="w-full rounded-[0.75rem] bg-hana-ez-600 py-[0.875rem] text-[1rem] font-semibold text-white disabled:opacity-50"
                >
                  {isLoading ? "처리 중..." : "휴면 해제하기"}
                </button>
              </>
            )}
          </div>

          {error && (
            <p className="mt-[0.75rem] text-[0.8125rem] font-medium text-red-500">
              {error}
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default function UnlockDormantPage() {
  return (
    <Suspense fallback={null}>
      <UnlockDormantContent />
    </Suspense>
  );
}