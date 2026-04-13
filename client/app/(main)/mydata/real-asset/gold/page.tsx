"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LoginHeader from "../../../../../components/LoginHeader";
import PrimaryButton from "../../../../../components/PrimaryButton";
import { Coins, TrendingUp, Info } from "lucide-react";

/**
 * 금 시세 조회 및 등록 페이지
 */
export default function GoldAssetPage() {
  const router = useRouter();
  const [step, setStep] = useState<"input" | "result">("input");
  const [weight, setWeight] = useState("");
  const [purity, setPurity] = useState("24K");

  const handleBack = () => {
    if (step === "result") setStep("input");
    else router.back();
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout relative overflow-hidden">
        <LoginHeader
          title="금 시세 조회"
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
                <h2 className="text-[1.5rem] font-bold leading-[1.4] mb-[2.5rem] tracking-tight text-foreground">
                  보유하신 금의<br />정보를 입력해 주세요
                </h2>

                <div className="flex flex-col gap-[2.5rem]">
                  <div className="flex flex-col gap-[1rem]">
                    <label className="text-[0.9375rem] font-bold text-hana-black-900 ml-1 text-gray-500">금 함량 선택</label>
                    <div className="grid grid-cols-3 gap-[0.75rem]">
                      {["24K", "18K", "14K"].map(k => (
                        <button
                          key={k}
                          onClick={() => setPurity(k)}
                          className={`py-[1.125rem] rounded-[1.25rem] border-2 font-black text-[1.0625rem] transition-all ${k === purity
                            ? "border-primary bg-primary/5 text-primary shadow-md"
                            : "border-gray-100 text-gray-400 bg-white"
                            }`}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-[1rem]">
                    <label className="text-[0.9375rem] font-bold text-hana-black-900 ml-1 text-gray-500">보유 중량 (g)</label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full h-[4.25rem] px-[1.5rem] rounded-[1.25rem] border-2 border-gray-100 outline-none focus:border-primary text-right pr-[4rem] text-[1.75rem] font-black transition-all"
                      />
                      <span className="absolute right-[1.5rem] top-1/2 -translate-y-1/2 font-black text-[1.25rem] text-gray-400">g</span>
                    </div>
                    <p className="text-[0.875rem] text-muted-foreground text-right px-1 font-medium">
                      약 {(Number(weight || 0) / 3.75).toFixed(2)}돈
                    </p>
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton label="시세 확인하기" disabled={!weight} onClick={() => setStep("result")} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-1 flex-col"
              >
                <h2 className="text-[1.375rem] font-bold text-foreground mb-[2rem] tracking-tight">금 보유 현황</h2>

                <div className="rounded-[2rem] bg-gradient-to-br from-[#FFD700] via-[#E6B800] to-[#B8860B] p-[2.25rem] text-white shadow-[0_20px_50px_rgba(230,184,0,0.3)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                  <div className="absolute -right-8 -bottom-8 opacity-20 rotate-[15deg] text-white">
                    <Coins size={180} strokeWidth={1} />
                  </div>

                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-[3.5rem]">
                      <div>
                        <p className="text-[0.9375rem] font-bold text-white/80 mb-[0.5rem] tracking-tight">{purity} Gold</p>
                        <h3 className="text-[2.25rem] font-black leading-none">{weight}g</h3>
                        <p className="mt-2 text-[1rem] font-bold text-white/90">{(Number(weight) / 3.75).toFixed(1)}돈</p>
                      </div>
                      <div className="p-[1rem] bg-white/20 backdrop-blur-md rounded-[1.25rem] border border-white/30 shadow-inner">
                        <Coins size={32} />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-[1.75rem] border-t border-white/20">
                      <span className="text-[1rem] font-bold text-white/80">평가 금액</span>
                      <span className="text-[1.875rem] font-black">3,203,250원</span>
                    </div>
                  </div>
                </div>

                <div className="mt-[2rem] flex flex-col gap-[1rem]">
                  <div className="p-[1.25rem] bg-hana-ez-50 rounded-[1.25rem] flex items-center gap-[0.875rem] border border-hana-ez-100">
                    <div className="p-2 bg-primary rounded-full text-white">
                      <TrendingUp size={18} />
                    </div>
                    <p className="text-[0.875rem] text-primary font-bold tracking-tight">전일 대비 시세가 1.2% 상승했습니다.</p>
                  </div>

                  <div className="flex items-center gap-[0.5rem] px-[0.5rem]">
                    <Info size={14} className="text-gray-400" />
                    <p className="text-[0.75rem] text-gray-400 font-medium">기준 시세: 85,420원/1g (실시간)</p>
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton label="확인" onClick={() => router.push("/asset?tab=gold")} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
