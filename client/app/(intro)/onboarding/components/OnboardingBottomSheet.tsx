"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

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
      // 바텀시트가 열릴 때 포커스 이동
      sheetRef.current?.focus();

      // Escape 키 입력 시 닫기
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="absolute inset-0 z-40 w-full h-full bg-black/40 transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        tabIndex={-1}
        className="absolute bottom-0 left-0 right-0 z-50 flex flex-col items-center rounded-t-[1.5rem] bg-card p-[1.5rem] pt-[1.25rem] pb-[3rem] shadow-2xl animate-in slide-in-from-bottom-full duration-300 focus:outline-none"
      >
        <div className="flex w-full items-center justify-between pb-[1.75rem]">
          <div className="w-6 h-6" /> {/* 좌측 여백용 */}
          <div className="h-[0.375rem] w-[3rem] rounded-full bg-gray-200" />
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        <p id="bottom-sheet-title" className="mb-[2rem] text-center font-bold text-foreground text-[1.25rem]">
          이미 회원이신가요?
          <br />
          <span className="text-[1rem] font-medium text-muted-foreground">또는 처음 오셨나요?</span>
        </p>

        <div className="flex w-full flex-col gap-[0.75rem]">
          <button
            type="button"
            onClick={() => router.push("/login/hanaCert")}
            className="h-[3.2rem] w-full rounded-xl bg-primary font-bold text-[1.125rem] text-white transition-all active:scale-[0.98] hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            하나인증서로 로그인
          </button>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="h-[3.2rem] w-full rounded-xl border border-gray-200 bg-transparent font-bold text-[1.125rem] text-gray-700 transition-all active:scale-[0.98] hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
          >
            로그인
          </button>

          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="h-[3.2rem] w-full rounded-xl border border-border bg-white font-bold text-[1.125rem] text-foreground transition-all active:scale-[0.98] hover:bg-gray-50 focus:ring-2 focus:ring-border focus:ring-offset-2"
          >
            회원가입
          </button>
        </div>
      </div>
    </>
  );
}
