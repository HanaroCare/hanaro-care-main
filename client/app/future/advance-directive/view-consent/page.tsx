"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Route } from "next";
import YesNoSelector from "@/app/future/components/YesNoSelector";
import DirectivePageLayout from "@/app/future/components/DirectivePageLayout";

function OpinionBottomSheet(props: { onClose: () => void, onConfirm: () => void }) {
  return null;
}

export default function ViewConsentPage() {
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  const [showOpinion, setShowOpinion] = useState(false);
  const router = useRouter();

  const goNext = () => router.push("/future/advance-directive/child-consent" as Route);

  return (
      <DirectivePageLayout
          step={2}
          question={`돌아가시기 전,\n이 결정 내용을\n열람하는 것에 동의하시나요?`}
          footer={
            <>
              <button
                  onClick={goNext}
                  disabled={!selected}
                  className="w-full h-[56px] rounded-[12px] font-semibold text-white transition-all"
                  style={{ backgroundColor: selected ? "#01A5AC" : "rgba(1,165,172,0.4)" }}
              >
                다음으로
              </button>
              <button onClick={() => setShowOpinion(true)} className="w-full h-[56px] rounded-[12px] font-semibold text-[#99A1AF] bg-[#F3F4F6]">
                직접 의견을 남길게요
              </button>
            </>
          }
      >
        <div className="mt-[20px]">
          <YesNoSelector selected={selected} onSelect={setSelected} />
        </div>

        {showOpinion && <OpinionBottomSheet onClose={() => setShowOpinion(false)} onConfirm={goNext} />}
      </DirectivePageLayout>
  );
}
