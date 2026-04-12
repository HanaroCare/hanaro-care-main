import { useState, useRef, useEffect } from "react";

export type Step = "limit" | "account" | "cardName" | "familyShare" | "complete";

const STEP_ORDER: Step[] = ["limit", "account", "cardName", "familyShare", "complete"];

export interface IssueFormData {
  limitAmt: number;
  accountId: number | null;
  cardNm: string;
  familyShareAll: boolean;
  familyMembers: { id: number; name: string; initial: string; relation: string; shareEnabled: boolean }[];
}

export function useIssueSteps() {
  const [currentStep, setCurrentStep] = useState<Step>("limit");
  const [visibleSteps, setVisibleSteps] = useState<Step[]>(["limit"]);
  const [showModal, setShowModal] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<IssueFormData>({
    limitAmt: 400000,
    accountId: null,
    cardNm: "",
    familyShareAll: true,
    familyMembers: [
      { id: 1, name: "권하나", initial: "김", relation: "배우자", shareEnabled: true },
      { id: 2, name: "권하나", initial: "김", relation: "배우자", shareEnabled: true },
      { id: 3, name: "권하나", initial: "김", relation: "배우자", shareEnabled: true },
    ],
  });

  // 새 섹션 추가 시 자동 스크롤
  useEffect(() => {
    if (visibleSteps.length > 1) {
      setTimeout(() => {
        const el = topRef.current;
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 65;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    }
  }, [visibleSteps]);

  const nextStep = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const next = STEP_ORDER[currentIndex + 1];
      if (next === "complete") {
        setShowModal(true);
        return;
      }
      setCurrentStep(next);
      setVisibleSteps((prev) => [...prev, next]);
    }
  };

  const updateFormData = (data: Partial<IssueFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // 전체 토글 - 한 번에 업데이트
  const toggleAllMembers = (val: boolean) => {
    setFormData((prev) => ({
      ...prev,
      familyShareAll: val,
      familyMembers: prev.familyMembers.map((m) => ({ ...m, shareEnabled: val })),
    }));
  };

  return {
    currentStep,
    visibleSteps,
    showModal,
    setShowModal,
    formData,
    updateFormData,
    toggleAllMembers,
    nextStep,
    topRef,
  };
}