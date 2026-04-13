"use client";

import LoginHeader from "../../../../components/LoginHeader";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConsentStep from "../components/ConsentStep";
import IntroStep from "../components/IntroStep";
import AgencySelectStep from "../components/AgencySelectStep";
import LoadingStep from "../components/LoadingStep";
import SuccessModal from "../components/SuccessModal";
import CompleteStep from "../components/CompleteStep";

type Step = "consent" | "intro" | "select" | "loading" | "complete";

/**
 * 마이데이터 연결 통합 플로우 페이지
 * - 전체 불러오기 vs 원하는 것만 선택하기 분기 처리
 */
export default function MyDataConnectPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("consent");
  const [isCustomSelection, setIsCustomSelection] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 약관 동의 후 다음 단계 (전체 연결 모드)
  const handleConsentNext = () => {
    setIsCustomSelection(false);
    setStep("intro");
  };

  // 개별 선택 모드로 전환 (Step 3로 바로 이동)
  const handleCustomSelectMode = () => {
    setIsCustomSelection(true);
    setStep("select");
  };

  // 인트로 확인 후 로딩 (전체 연결 모드)
  const handleIntroConfirm = () => {
    setStep("loading");
  };

  // 기관 선택 완료 후 로딩 (개별 선택 모드)
  const handleAgencySelectComplete = () => {
    setStep("loading");
  };

  // 로딩 완료 후 성공 모달 표시
  const handleLoadingComplete = () => {
    setStep("complete");
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    router.push("/asset/housing");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout relative overflow-hidden">
        <div className="flex-1 flex flex-col relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {step === "consent" && (
                <ConsentStep onNext={handleConsentNext} />
              )}
              {step === "intro" && (
                <IntroStep
                  onConfirm={handleIntroConfirm}
                  onCustomMode={handleCustomSelectMode}
                />
              )}
              {step === "select" && (
                <AgencySelectStep onNext={handleAgencySelectComplete} />
              )}
              {step === "loading" && (
                <LoadingStep onComplete={handleLoadingComplete} />
              )}
              {step === "complete" && (
                <CompleteStep />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <SuccessModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
        />
      </div>
    </div>
  );
}
