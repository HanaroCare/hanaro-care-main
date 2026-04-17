import { useState, useRef, useEffect } from "react";
import {
  FamilyMemberResponse,
  getFamilyMembers,
  registerCard,
} from "../../../actions/card";

export type Step =
  | "limit"
  | "account"
  | "cardName"
  | "familyShare"
  | "complete";

const STEP_ORDER: Step[] = [
  "limit",
  "account",
  "cardName",
  "familyShare",
  "complete",
];

export interface FamilyMember {
  id: number;
  name: string;
  initial: string;
  relation: string;
  shareEnabled: boolean;
}

export interface IssueFormData {
  limitAmt: number;
  accountId: number | null;
  cardNm: string;
  familyShareAll: boolean;
  familyMembers: FamilyMember[];
  payDay: number | null; // 추가
}

export function useIssueSteps(designId: string) {
  const [currentStep, setCurrentStep] = useState<Step>("limit");
  const [visibleSteps, setVisibleSteps] = useState<Step[]>(["limit"]);
  const [showModal, setShowModal] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<IssueFormData>({
    limitAmt: 400000,
    accountId: null,
    cardNm: "",
    familyShareAll: true,
    familyMembers: [],
    payDay: null, // 추가
  });

  // 가족 목록 API
  useEffect(() => {
    getFamilyMembers().then((data: FamilyMemberResponse[]) => {
      setFormData((prev) => ({
        ...prev,
        familyMembers: data.map((m) => ({
          id: Number(m.familyAuthId), // familyAuthId가 카드 발급 시 필요
          name: m.userNm,
          initial: m.userNm?.[0] ?? "?",
          relation: m.relationCd,
          shareEnabled: true,
        })),
      }));
    });
  }, []);

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

  const nextStep = async () => {
    console.log("currentStep:", currentStep);
    console.log("formData:", formData);
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      const next = STEP_ORDER[currentIndex + 1];
      if (next === "complete") {
        // 발급 API 호출
        await registerCard({
          accountId: formData.accountId!,
          cardNm: formData.cardNm,
          limitAmt: formData.limitAmt,
          autoTransAmt: formData.limitAmt,
          designCd: String.fromCharCode(64 + Number(designId)),
          familyAuthIds: formData.familyMembers
            .filter((m) => m.shareEnabled)
            .map((m) => m.id),
          payDay: formData.payDay!,
        });
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

  const toggleAllMembers = (val: boolean) => {
    setFormData((prev) => ({
      ...prev,
      familyShareAll: val,
      familyMembers: prev.familyMembers.map((m) => ({
        ...m,
        shareEnabled: val,
      })),
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
