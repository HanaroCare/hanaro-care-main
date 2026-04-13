"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AuthInput from "../../components/AuthInput";
import PrimaryButton from "@/components/PrimaryButton";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { validatePassword, validatePasswordMatch } from "../../utils/validators";

/**
 * 새 비밀번호 설정 페이지
 */
export default function NewPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const isPasswordSecure = useMemo(() => validatePassword(password), [password]);
  const isMatch = useMemo(() => validatePasswordMatch(password, confirmPassword), [password, confirmPassword]);
  const isFormValid = useMemo(() => isPasswordSecure && isMatch, [isPasswordSecure, isMatch]);

  const handleComplete = () => {
    if (isFormValid) {
      // TODO: 비밀번호 변경 API 호출 (서버 연동 시점)
      setShowSuccessPopup(true);
    }
  };

  const handlePopupConfirm = () => {
    setShowSuccessPopup(false);
    router.push("/login");
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout">
        {/* <Header title="비밀번호 재설정" showBackButton={true} showCloseButton={false} /> */}

        <main className="app-main flex flex-col px-[1.5rem]">
          <div className="pt-[2.5rem] pb-[2rem]">
            <h2 className="text-[1.5rem] font-bold leading-tight text-foreground">
              새로운 비밀번호를
              <br />
              입력해 주세요
            </h2>
            <p className="mt-[0.75rem] text-[0.875rem] text-muted-foreground">
              6~8자 영문 포함하여 입력해주세요.
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
              {password.length > 0 && !isPasswordSecure && (
                <p className="ml-[0.2rem] mt-[0.25rem] text-[0.75rem] text-hana-red-500">
                  6~8자 영문 포함하여 입력해주세요.
                </p>
              )}
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
              {confirmPassword.length > 0 && !isMatch && (
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

        <AnimatePresence>
          {showSuccessPopup && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-[2rem]">

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handlePopupConfirm}
                className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              />

              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-[20rem] overflow-hidden rounded-[1.25rem] bg-white p-[1.5rem] shadow-2xl"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-[1rem] flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-[2rem] w-[2rem] text-primary" />
                  </div>
                  <h3 className="mb-[0.5rem] text-[1.125rem] font-bold text-foreground">변경 완료</h3>
                  <p className="mb-[1.5rem] text-[0.9375rem] leading-relaxed text-muted-foreground">
                    비밀번호가 성공적으로<br />변경되었습니다.
                  </p>
                  <button
                    onClick={handlePopupConfirm}
                    className="w-full rounded-[0.75rem] bg-primary py-[0.875rem] text-[1rem] font-semibold text-white active:bg-primary/90"
                  >
                    확인
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}