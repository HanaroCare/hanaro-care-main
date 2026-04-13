"use client";

import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/baseelements/PrimaryButton";
import BottomSheet from "@/components/modules/BottomSheet";

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

  const handleNavigation = (path: string) => {
    localStorage.setItem("HAS_SEEN_ONBOARDING", "true");
    router.push(path);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
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
    </BottomSheet>
  );
}
