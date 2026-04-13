"use client";

import { useState } from "react";
import PrimaryButton from "../../../../../components/PrimaryButton";
import { Car } from "lucide-react";

/**
 * 자동차 자산 등록 및 결과 섹션
 */
export default function CarSection({ step, onComplete }: { step: string; onComplete: () => void }) {
  const [carNum, setCarNum] = useState("");

  if (step === "result") {
    return (
      <div className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem] pb-[3rem]">
        <div className="mb-[2rem]">
          <h2 className="text-[1.375rem] font-bold text-foreground tracking-tight">내 차 시세 조회 결과</h2>
        </div>

        <div className="rounded-[1.5rem] border border-gray-200 bg-white overflow-hidden shadow-lg transition-all hover:shadow-xl">
          <div className="h-[11rem] bg-gray-50 flex items-center justify-center relative overflow-hidden">
            <div className="text-gray-200 flex flex-col items-center">
              <Car size={80} strokeWidth={1} />
              <span className="text-[0.8125rem] font-bold mt-2 tracking-widest text-gray-300">GENESIS GV80</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent opacity-60" />
          </div>
          <div className="p-[1.75rem]">
            <div className="mb-[1.25rem]">
              <div className="flex items-center gap-[0.5rem] mb-[0.375rem]">
                <span className="px-[0.5rem] py-[0.125rem] bg-primary/10 text-primary text-[0.75rem] font-bold rounded-md">제네시스</span>
              </div>
              <h3 className="text-[1.375rem] font-bold text-foreground tracking-tight">GV80 (2023년형)</h3>
              <p className="text-muted-foreground text-[0.9375rem] mt-1 font-medium">12가 3456</p>
            </div>
            <div className="flex justify-between items-end pt-[1.5rem] border-t border-gray-100">
              <span className="text-muted-foreground text-[0.9375rem] font-medium">현재 예상 시세</span>
              <span className="text-[1.5rem] font-bold text-foreground">7,850만원</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <PrimaryButton label="자산 등록 완료" onClick={() => { }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem] pb-[3rem]">
      <div className="mb-[2.5rem]">
        <h2 className="text-[1.5rem] font-bold leading-[1.4] text-foreground tracking-tight">
          차량 번호를<br />입력해 주세요
        </h2>
      </div>

      <div className="flex flex-col gap-[0.75rem]">
        <input
          type="text"
          placeholder="예: 12가 3456"
          value={carNum}
          onChange={(e) => setCarNum(e.target.value)}
          className="w-full h-[4rem] px-[1.25rem] rounded-[1rem] border border-gray-200 outline-none focus:border-primary text-[1.25rem] font-bold placeholder:font-normal placeholder:text-[1rem] transition-all"
        />
        <div className="flex items-start gap-[0.5rem] px-[0.25rem]">
          <div className="mt-1 h-1 w-1 rounded-full bg-muted-foreground" />
          <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
            소유주 명의의 차량만 조회가 가능합니다.
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <PrimaryButton label="내 차 시세 확인하기" disabled={!carNum} onClick={onComplete} />
      </div>
    </div>
  );
}
