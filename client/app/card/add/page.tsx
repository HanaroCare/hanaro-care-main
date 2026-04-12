"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useIssueSteps } from "./hooks/useIssueSteps";
import StepLimitSlider from "./components/StepLimitSlider";
import StepAccountSelect from "./components/StepAccountSelect";
import StepCardName from "./components/StepCardName";
import StepFamilyShare from "./components/StepFamilyShare";
import CompleteModal from "./components/CompleteModal";

export default function CardIssuePage() {
  const router = useRouter();
  const {
    currentStep,
    visibleSteps,
    showModal,
    setShowModal,
    formData,
    updateFormData,
    nextStep,
    topRef,
  } = useIssueSteps();

  const handleConfirm = () => {
    // TODO: POST /api/cards
    router.push("/card/issue/complete");
  };

  const handleReset = () => {
    setShowModal(false);
  };

  return (
    <div className="relative min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 h-[65px] border-b border-black/10 sticky top-0 bg-white z-10">
        <button className="p-1" onClick={() => router.back()}>
          <ChevronLeft size={24} color="#0A0A0A" />
        </button>
        <span className="text-base font-medium tracking-tight text-[#0A0A0A]">카드 발급</span>
        <div className="w-8" />
      </div>

      {/* 단계별 섹션 -아래에서 위로 쌓임 */}
      <div className="pb-12 flex flex-col-reverse">
        <div ref={topRef} />
        {visibleSteps.includes("limit") && (
          <StepLimitSlider
            value={formData.limitAmt}
            onChange={(val) => updateFormData({ limitAmt: val })}
            onNext={nextStep}
            isActive={currentStep === "limit"}
          />
        )}

        {visibleSteps.includes("account") && (
          <StepAccountSelect
            onNext={nextStep}
            isActive={currentStep === "account"}
          />
        )}

        {visibleSteps.includes("cardName") && (
          <StepCardName
            value={formData.cardNm}
            onChange={(val) => updateFormData({ cardNm: val })}
            onNext={nextStep}
            isActive={currentStep === "cardName"}
          />
        )}

        {visibleSteps.includes("familyShare") && (
          <StepFamilyShare
            shareAll={formData.familyShareAll}
            members={formData.familyMembers}
            onToggleAll={(val) => updateFormData({ familyShareAll: val })}
            onToggleMember={(id, val) =>
              updateFormData({
                familyMembers: formData.familyMembers.map((m) =>
                  m.id === id ? { ...m, shareEnabled: val } : m
                ),
              })
            }
            onNext={nextStep}
            isActive={currentStep === "familyShare"}
          />
        )}
      </div>

      {/* 완료 모달 */}
      {showModal && (
        <CompleteModal onConfirm={handleConfirm} onReset={handleReset} />
      )}
    </div>
  );
}