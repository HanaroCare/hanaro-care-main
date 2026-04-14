"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PrimaryButton from "@/components/baseelements/PrimaryButton";
import TrustChoiceStep from "../TrustChoiceStep";
import TrustWizardStep from "../TrustWizardStep";
import { Route } from "next";

const options = [
  {
    id: "free",
    emoji: "🧑‍💼",
    title: "자유형",
    desc: "원할때 받기",
  },
  {
    id: "pension",
    emoji: "🧑‍💼",
    title: "연금형",
    desc: "연금 형태로 받기",
  },
];

export default function PayoutTypeStep() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>("free");

  return (
    <TrustWizardStep
      step={4}
      footer={
        <footer className="shrink-0 bg-white px-6 pt-10 pb-8">
          <PrimaryButton
            label="다음으로"
            disabled={!selected}
            onClick={() => router.push("/asset/trust/payout-use" as Route)}
          />
        </footer>
      }
    >
      <TrustChoiceStep
        question={
          <>
            어떤 형태로
            <br />
            자산을 받을까요?
          </>
        }
        options={options}
        selected={selected}
        onSelect={setSelected}
      />
    </TrustWizardStep>
  );
}
