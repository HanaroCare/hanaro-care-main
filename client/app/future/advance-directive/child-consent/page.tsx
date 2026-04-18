"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Route } from "next";
import YesNoSelector from "@/app/future/components/YesNoSelector";
import DirectivePageLayout from "@/app/future/components/DirectivePageLayout";

export default function ChildConsentPage() {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  const router = useRouter();

  return (
      <DirectivePageLayout
          step={3}
          question={`자녀가 이 결정 내용을\n확인하는 것에 동의하시나요?`}
          footer={
            <button
                onClick={() => router.push("/future/advance-directive/complete" as Route)}
                disabled={!selected}
                className="w-full h-[56px] rounded-[12px] font-semibold text-white transition-all"
                style={{ backgroundColor: selected ? "#01A5AC" : "rgba(1,165,172,0.4)" }}
            >
              완료하기
            </button>
          }
      >
        <div className="mt-[20px]">
          <YesNoSelector selected={selected} onSelect={setSelected} />
        </div>
      </DirectivePageLayout>
  );
}
