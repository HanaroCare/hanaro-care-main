"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Route } from "next";
import Header from "@/components/navigation/Header";
import DotIndicator from "@/app/future/components/DotIndicator";
import YesNoSelector from "@/app/future/components/YesNoSelector";

export default function ViewConsentPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);
  const [showOpinion, setShowOpinion] = useState(false);
  const [opinion, setOpinion] = useState("");

  const goNext = () =>
    router.push("/future/advance-directive/child-consent" as Route);

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <Header title="연명의료 결정" />

      <div className="flex flex-col flex-1 px-[25px] pt-[65px]">
        <div className="flex justify-center mt-[54px]">
          <DotIndicator total={3} current={2} />
        </div>

        <h2 className="font-medium text-[22px] leading-[33px] tracking-[-0.02em] text-black mt-[61px] whitespace-pre-line">
          돌아가시기 전,{"\n"}이 결정 내용을{"\n"}열람하는 것에 동의하시나요?
        </h2>

        <div className="mt-[70px]">
          <YesNoSelector selected={selected} onSelect={setSelected} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-[7px] px-[25px] pb-[30px] bg-white">
        <button
          onClick={goNext}
          disabled={!selected}
          className="w-full h-[53px] rounded-[10px] font-medium text-[16px] text-white transition-all"
          style={{
            backgroundColor: selected ? "#01A5AC" : "rgba(1,165,172,0.4)",
          }}
        >
          다음으로
        </button>
        <button
          onClick={() => setShowOpinion(true)}
          className="w-full h-[53px] rounded-[10px] font-semibold text-[16px] text-[#99A1AF] bg-[#E5E7EB]"
        >
          직접 의견을 남길게요
        </button>
      </div>

      {showOpinion && (
        <div
          className="absolute inset-0 bg-black/40 flex flex-col justify-end"
          onClick={() => setShowOpinion(false)}
        >
          <div
            className="bg-white rounded-t-2xl px-[25px] pt-[30px] pb-[40px] flex flex-col gap-[20px]"
            onClick={(e) => e.stopPropagation()}
          >
            <textarea
              value={opinion}
              onChange={(e) => setOpinion(e.target.value)}
              placeholder="내용을 입력하세요."
              className="w-full h-[212px] border border-[#E5E5E5] rounded-xl p-[16px] font-medium text-[15px] leading-[38px] tracking-[-0.02em] text-[#1A212D] placeholder:text-[#E5E5E5] outline-none resize-none"
            />
            <button
              onClick={() => {
                setShowOpinion(false);
                goNext();
              }}
              className="w-full h-[53px] rounded-[10px] font-medium text-[16px] text-white"
              style={{ backgroundColor: "#01A5AC" }}
            >
              의견 남기기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
