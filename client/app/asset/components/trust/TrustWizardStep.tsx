import type { ReactNode } from "react";
import ProgressBar from "@/components/baseelements/ProgressBar";
import Header from "@/components/navigation/Header";
import TrustStepLayout from "./TrustStepLayout";

type TrustWizardStepProps = {
  step: number;
  footer: ReactNode;
  children: ReactNode;
};

/**
 * 신탁 가입 wizard 공통 래퍼
 * TrustStepLayout + Header + section + TrustProgressBar 반복 제거
 */
export default function TrustWizardStep({
  step,
  footer,
  children,
}: TrustWizardStepProps) {
  return (
    <TrustStepLayout footer={footer}>
      <Header title="내맘대로신탁" />
      <section className="px-6 pt-8">
        <ProgressBar step={step} />
        {children}
      </section>
    </TrustStepLayout>
  );
}
