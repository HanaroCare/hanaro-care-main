"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import PrimaryButton from "@/components/PrimaryButton";

type OnboardingBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * 온보딩 완료 후 로그인/회원가입 바텀시트
 */
export default function OnboardingBottomSheet({
  isOpen,
  onClose,
}: OnboardingBottomSheetProps) {
  const router = useRouter();
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.focus();

      // 배경 스크롤 방지
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 w-full h-full bg-black/40 transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        tabIndex={-1}
        className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 flex w-full max-w-[375px] flex-col items-center rounded-t-[1.5rem] bg-card p-[1.5rem] pt-[1.25rem] pb-[3rem] shadow-2xl animate-in slide-in-from-bottom-full duration-300 focus:outline-none"
      >
        <div className="flex w-full items-center justify-between pb-[1.75rem]">
          <div className="w-6 h-6" />
          <div className="h-[0.375rem] w-[3rem] rounded-full bg-gray-200" />
          <div className="w-6 h-6" />
        </div>

        <p id="bottom-sheet-title" className="mb-[2rem] text-center font-hana font-bold text-foreground text-[1.25rem]">
          이미 회원이신가요?
          <br />
          <span className="text-[1rem] font-medium text-muted-foreground">또는 처음 오셨나요?</span>
        </p>

        <div className="flex w-full flex-col gap-[0.75rem]">
          <PrimaryButton
            onClick={() => router.push("/login/hanaCert")}
            label="하나인증서로 로그인"
            className="h-[3.2rem] text-[1.125rem]"
            variant="primary"
          />

          <PrimaryButton
            onClick={() => router.push("/login")}
            label="로그인"
            className="h-[3.2rem] text-[1.125rem] border border-gray-200 bg-transparent !text-gray-900 hover:bg-gray-50"
          />

          <PrimaryButton
            onClick={() => router.push("/signup")}
            label="회원가입"
            className="h-[3.2rem] text-[1.125rem] border border-border bg-white !text-gray-900 hover:bg-gray-50"
          />
        </div>
      </div>
    </>
  );
}