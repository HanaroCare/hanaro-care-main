"use client";

import { useState } from "react";
import PrimaryButton from "../../../../../components/PrimaryButton";
import { Coins, Info } from "lucide-react";

/**
 * 금 자산 등록 및 결과 섹션
 */
export default function GoldSection({ step, onComplete }: { step: string; onComplete: () => void }) {
  const [weight, setWeight] = useState("");
  const [purity, setPurity] = useState("24K");

  if (step === "result") {
    return (
      <div className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem] pb-[3rem]">
        <div className="mb-[2rem]">
          <h2 className="text-[1.375rem] font-bold text-foreground tracking-tight">금 보유 현황</h2>
        </div>

        <div className="rounded-[1.5rem] bg-gradient-to-br from-[#FFD700]/15 to-[#FFA500]/5 border border-[#FFD700]/30 p-[1.75rem] shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-[#FFD700]/10 rotate-12">
            <Coins size={120} />
          </div>

          <div className="flex justify-between items-start mb-[2.5rem] relative z-10">
            <div>
              <p className="text-[#B8860B] text-[0.875rem] font-bold mb-[0.375rem]">{purity} 순금</p>
              <h3 className="text-[1.625rem] font-bold text-foreground">{weight || "37.5"}g (10돈)</h3>
            </div>
            <div className="p-[0.875rem] bg-white rounded-2xl text-[#DAA520] shadow-sm">
              <Coins size={28} />
            </div>
          </div>

          <div className="space-y-[1rem] relative z-10">
            <div className="flex justify-between items-center text-[0.9375rem]">
              <span className="text-muted-foreground font-medium">현재 금 시세(1g)</span>
              <span className="font-bold text-foreground">85,420원</span>
            </div>
            <div className="flex justify-between items-center pt-[1.25rem] border-t border-black/5">
              <span className="font-bold text-hana-black-800">평가 금액</span>
              <span className="font-extrabold text-[1.5rem] text-primary">3,203,250원</span>
            </div>
          </div>
        </div>

        <div className="mt-[1.5rem] flex items-center gap-[0.5rem] p-[1rem] bg-gray-50 rounded-[0.75rem]">
          <Info size={16} className="text-muted-foreground" />
          <p className="text-[0.75rem] text-muted-foreground">시세는 실시간 기준이며, 거래소에 따라 다를 수 있습니다.</p>
        </div>

        <div className="mt-auto">
          <PrimaryButton label="확인" onClick={() => { }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem] pb-[3rem]">
      <div className="mb-[2.5rem]">
        <h2 className="text-[1.5rem] font-bold leading-[1.4] text-foreground tracking-tight">
          보유하신 금의<br />정보를 입력해 주세요
        </h2>
      </div>

      <div className="flex flex-col gap-[2rem]">
        <div className="flex flex-col gap-[0.75rem]">
          <label className="text-[0.9375rem] font-bold text-hana-black-900 ml-1">금 함량</label>
          <div className="grid grid-cols-3 gap-[0.625rem]">
            {["24K", "18K", "14K"].map(k => (
              <button
                key={k}
                onClick={() => setPurity(k)}
                className={`py-[0.875rem] rounded-[1rem] border font-bold transition-all ${k === purity
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-gray-200 text-gray-500 bg-white"
                  }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[0.75rem]">
          <label className="text-[0.9375rem] font-bold text-hana-black-900 ml-1">중량 (g)</label>
          <div className="relative">
            <input
              type="number"
              placeholder="0.00"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full h-[3.75rem] px-[1.25rem] rounded-[1rem] border border-gray-200 outline-none focus:border-primary text-right pr-[3rem] font-extrabold text-[1.25rem] transition-all"
            />
            <span className="absolute right-[1.25rem] top-1/2 -translate-y-1/2 text-gray-500 font-bold text-[1.125rem]">g</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <PrimaryButton label="시세 확인하기" disabled={!weight} onClick={onComplete} />
      </div>
    </div>
  );
}
