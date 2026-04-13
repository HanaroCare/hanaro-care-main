"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LoginHeader from "../../../../../components/LoginHeader";
import PrimaryButton from "../../../../../components/PrimaryButton";
import { AlertCircle, TrendingDown } from "lucide-react";
import Image from "next/image";

/**
 * 자동차 조회 및 등록 플로우 페이지 (시안 1~2 반영)
 */
export default function CarAssetPage() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "result">("input");
  const [carNum, setCarNum] = useState("");

  const handleBack = () => {
    if (step === "result") setStep("input");
    else router.back();
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout relative overflow-hidden">
        <LoginHeader 
          title="자동차 조회" 
          onBack={handleBack}
          onClose={() => router.push("/asset")}
        />

        <main className="app-main flex flex-1 flex-col px-[1.5rem] pt-[2.5rem]">
          <AnimatePresence mode="wait">
            {step === "input" ? (
              <motion.div 
                key="input" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="flex flex-1 flex-col"
              >
                <h2 className="text-[1.5rem] font-bold leading-[1.4] mb-[2.5rem] tracking-tight">
                  차량 번호를<br />입력해 주세요
                </h2>
                
                <div className="flex flex-col gap-[1rem]">
                  <input 
                    type="text" 
                    placeholder="예: 12가 3456" 
                    value={carNum} 
                    onChange={(e) => setCarNum(e.target.value)}
                    className="w-full h-[4.25rem] px-[1.5rem] rounded-[1.25rem] border border-gray-200 outline-none focus:border-primary text-[1.625rem] font-black placeholder:text-[1.0625rem] placeholder:font-normal tracking-wider transition-all shadow-sm"
                  />
                  <div className="flex items-start gap-[0.625rem] px-[0.5rem] py-[1rem] bg-gray-50 rounded-[1rem]">
                    <AlertCircle size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <p className="text-[0.875rem] text-muted-foreground leading-relaxed">
                      소유주 명의의 차량만 조회가 가능하며,<br />등록 후 시세를 실시간으로 확인할 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton 
                    label="내 차 시세 확인하기" 
                    disabled={carNum.length < 7} 
                    onClick={() => setStep("result")} 
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="result" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex flex-1 flex-col"
              >
                <h2 className="text-[1.375rem] font-bold text-foreground mb-[2rem] tracking-tight">내 차 시세 결과</h2>
                
                <div className="rounded-[1.75rem] border border-gray-200 bg-white overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                  <div className="h-[12.5rem] bg-[#F1F3F5] flex items-center justify-center relative overflow-hidden">
                    {/* 차량 이미지 플레이스홀더 */}
                    <div className="text-gray-300 flex flex-col items-center">
                      <Image 
                        src="/images/mydata/car.svg" 
                        alt="자동차 이미지" 
                        width={260} 
                        height={146}
                        className="w-auto h-[8.5rem] drop-shadow-sm"
                      />
                      <span className="text-[0.8125rem] font-black mt-3 tracking-[0.2em] opacity-50 uppercase">Genesis GV80</span>
                    </div>
                    <div className="absolute top-[1.25rem] right-[1.25rem]">
                      <span className="px-[0.75rem] py-[0.375rem] bg-primary text-white text-[0.75rem] font-bold rounded-full shadow-lg">조회완료</span>
                    </div>
                  </div>
                  
                  <div className="p-[1.75rem]">
                    <div className="mb-[1.75rem]">
                      <div className="flex items-center gap-[0.5rem] mb-[0.5rem]">
                        <span className="px-[0.5rem] py-[0.125rem] bg-primary/10 text-primary text-[0.75rem] font-bold rounded-md uppercase">Genesis</span>
                      </div>
                      <h3 className="text-[1.5rem] font-black text-foreground tracking-tight">GV80 (2023년형)</h3>
                      <p className="text-muted-foreground text-[1rem] mt-1 font-semibold">{carNum}</p>
                    </div>
                    
                    <div className="flex justify-between items-end pt-[1.75rem] border-t border-gray-100">
                      <div className="flex flex-col gap-[0.25rem]">
                        <span className="text-muted-foreground text-[0.9375rem] font-medium">현재 예상 시세</span>
                        <div className="flex items-center gap-[0.375rem] text-hana-red-500">
                          <TrendingDown size={14} />
                          <span className="text-[0.75rem] font-bold">전월 대비 120만원 하락</span>
                        </div>
                      </div>
                      <span className="text-[1.75rem] font-black text-foreground">7,850만원</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton label="자산 등록 완료" onClick={() => router.push("/asset?tab=car")} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
