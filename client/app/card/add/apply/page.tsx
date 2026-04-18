"use client";

import { Suspense } from "react";
import { useIssueSteps } from "./hooks/useIssueSteps";
import StepLimitSlider from "./components/StepLimitSlider";
import StepAccountSelect from "./components/StepAccountSelect";
import StepCardName from "./components/StepCardName";
import StepFamilyShare from "./components/StepFamilyShare";
import CompleteModal from "./components/CompleteModal";
import { Route } from "next";
import Header from "@/components/navigation/Header";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

function CardIssueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const designId = searchParams.get("designId") ?? "1";
  const {
    currentStep,
    setCurrentStep,
    visibleSteps,
    showModal,
    setShowModal,
    formData,
    updateFormData,
    toggleAllMembers,
    nextStep,
    topRef,
  } = useIssueSteps(designId);

  const handleConfirm = () => {
    router.push(`/card/add/complete?designId=${designId}` as Route);
  };

  const handleReset = () => {
    setShowModal(false);
  };

  return (
    <div className="relative bg-white" style={{ minHeight: "100dvh" }}>
      {/* 헤더 */}
      <Header title="카드 발급" />

      {/* 섹션들 */}
      <div className="flex flex-col pb-12">
        <div ref={topRef} />

        {visibleSteps.includes("familyShare") && (
          <div
            className={`transition-opacity duration-300 ${currentStep !== "familyShare" ? "opacity-40 hover:opacity-100 cursor-pointer" : ""}`}
            onClick={() => currentStep !== "familyShare" && setCurrentStep("familyShare")}
          >
            <StepFamilyShare
              shareAll={formData.familyShareAll}
              members={formData.familyMembers}
              onToggleAll={toggleAllMembers}
              onToggleMember={(id, val) =>
                updateFormData({
                  familyMembers: formData.familyMembers.map((m) =>
                    m.id === id ? { ...m, shareEnabled: val } : m,
                  ),
                })
              }
              onNext={nextStep}
              isActive={currentStep === "familyShare"}
            />
          </div>
        )}

        {visibleSteps.includes("cardName") && (
          <div
            className={`transition-opacity duration-300 ${currentStep !== "cardName" ? "opacity-40 hover:opacity-100 cursor-pointer" : ""}`}
            onClick={() => currentStep !== "cardName" && setCurrentStep("cardName")}
          >
            <StepCardName
              value={formData.cardNm}
              onChange={(val) => updateFormData({ cardNm: val })}
              onNext={nextStep}
              isActive={currentStep === "cardName"}
            />
          </div>
        )}

        {visibleSteps.includes("account") && (
          <div
            className={`transition-opacity duration-300 ${currentStep !== "account" ? "opacity-40 hover:opacity-100 cursor-pointer" : ""}`}
            onClick={() => currentStep !== "account" && setCurrentStep("account")}
          >
            <StepAccountSelect
              value={formData.accountId}
              onChange={(accountId: string) => updateFormData({ accountId })}
              onNext={nextStep}
              isActive={currentStep === "account"}
            />
          </div>
        )}

        {visibleSteps.includes("limit") && (
          <div
            className={`transition-opacity duration-300 ${currentStep !== "limit" ? "opacity-40 hover:opacity-100 cursor-pointer" : ""}`}
            onClick={() => currentStep !== "limit" && setCurrentStep("limit")}
          >
            <StepLimitSlider
              value={formData.limitAmt}
              onChange={(val) => updateFormData({ limitAmt: val })}
              onNext={nextStep}
              isActive={currentStep === "limit"}
              onPayDayChange={(day) => updateFormData({ payDay: day })}
            />
          </div>
        )}
      </div>

      {/* 완료 모달 */}
      {showModal && (
        <CompleteModal onConfirm={handleConfirm} onReset={handleReset} />
      )}
    </div>
  );
}

export default function CardIssuePage() {
  return (
    <Suspense>
      <CardIssueContent />
    </Suspense>
  );
}
