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
    toggleAllMembers,
    nextStep,
    topRef,
  } = useIssueSteps();

  const handleConfirm = () => {
    router.push("/card/add/complete");
  };

  const handleReset = () => {
    setShowModal(false);
  };

  return (
    <div className="relative bg-white" style={{ minHeight: "100dvh" }}>
      {/* 헤더 */}
      <div
        className="flex justify-between items-center px-4 bg-white z-20 border-b border-black/10"
        style={{ position: "sticky", top: 0, height: "65px" }}
      >
        <button className="p-1" onClick={() => router.back()}>
          <ChevronLeft size={24} color="#0A0A0A" />
        </button>
        <span className="text-base font-medium tracking-tight text-[#0A0A0A]">카드 발급</span>
        <div className="w-8" />
      </div>

      {/* 섹션들 */}
      <div className="flex flex-col pb-12">
        <div ref={topRef} />

        {visibleSteps.includes("familyShare") && (
          <StepFamilyShare
            shareAll={formData.familyShareAll}
            members={formData.familyMembers}
            onToggleAll={toggleAllMembers}
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

        {visibleSteps.includes("cardName") && (
          <StepCardName
            value={formData.cardNm}
            onChange={(val) => updateFormData({ cardNm: val })}
            onNext={nextStep}
            isActive={currentStep === "cardName"}
          />
        )}

        {visibleSteps.includes("account") && (
          <StepAccountSelect
            onNext={nextStep}
            isActive={currentStep === "account"}
          />
        )}

        {visibleSteps.includes("limit") && (
          <StepLimitSlider
            value={formData.limitAmt}
            onChange={(val) => updateFormData({ limitAmt: val })}
            onNext={nextStep}
            isActive={currentStep === "limit"}
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