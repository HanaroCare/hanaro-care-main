"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleNavigation = (path: string) => {
    localStorage.setItem("HAS_SEEN_ONBOARDING", "true");
    router.push(path);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-[375px] -translate-x-1/2 flex-col rounded-t-[1.5rem] bg-white px-[1.5rem] pb-[3.5rem] pt-[1.25rem] shadow-2xl"
          >
            <div className="mx-auto mb-[2rem] h-[0.375rem] w-[3rem] rounded-full bg-gray-200" />

            <div className="mb-[2.5rem] w-full text-center">
              <h2 className="text-[1.5rem] font-bold text-foreground">
                처음 오셨나요?
              </h2>
            </div>

            <div className="flex w-full flex-col gap-3">
              <PrimaryButton
                label="회원가입"
                variant="secondary"
                onClick={() => handleNavigation("/signup")}
                className="!h-[4rem] !bg-white border border-gray-200 !text-gray-900 !text-[1.125rem]"
              />

              <PrimaryButton
                label="하나인증서로 로그인"
                variant="primary"
                onClick={() => handleNavigation("/login/hanaCert")}
                className="!h-[4rem] !text-[1.125rem]"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
