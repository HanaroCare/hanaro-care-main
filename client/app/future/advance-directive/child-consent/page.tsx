"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Route } from "next";
import Header from "@/components/navigation/Header";
import DotIndicator from "@/app/future/components/DotIndicator";
import YesNoSelector from "@/app/future/components/YesNoSelector";

export default function ChildConsentPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"yes" | "no" | null>(null);

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <Header title="연명의료 결정" />

      <div className="flex flex-col flex-1 px-[25px] pt-[65px]">
        <div className="flex justify-center mt-[54px]">
          <DotIndicator total={3} current={3} />
        </div>

        <h2 className="font-medium text-[22px] leading-[33px] tracking-[-0.02em] text-black mt-[61px] whitespace-pre-line">
          자녀가 이 결정 내용을{"\n"}확인하는 것에 동의하시나요?
        </h2>

        <div className="mt-[100px]">
          <YesNoSelector selected={selected} onSelect={setSelected} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 px-[25px] pb-[30px] bg-white">
        <button
          onClick={() =>
            router.push("/future/advance-directive/complete" as Route)
          }
          disabled={!selected}
          className="w-full h-[53px] rounded-[10px] font-medium text-[16px] text-white transition-all"
          style={{
            backgroundColor: selected ? "#01A5AC" : "rgba(1,165,172,0.4)",
          }}
        >
          완료하기
        </button>
      </div>
    </div>
  );
}
