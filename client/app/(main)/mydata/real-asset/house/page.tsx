"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import LoginHeader from "../../../../../components/LoginHeader";
import PrimaryButton from "../../../../../components/PrimaryButton";
import { Search, MapPin, Building2, ChevronRight, AlertCircle } from "lucide-react";
import Image from "next/image";

type Step = "search" | "detail" | "result";

/**
 * 부동산 조회 및 등록 플로우 페이지
 */
export default function HouseAssetPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("search");
  const [address, setAddress] = useState("");
  const [houseType, setHouseType] = useState("아파트");

  const handleBack = () => {
    if (step === "search") router.back();
    else if (step === "detail") setStep("search");
    else if (step === "result") setStep("detail");
  };

  return (
    <div className="app-shell bg-background">
      <div className="app-layout relative overflow-hidden">
        <LoginHeader
          title="부동산 조회"
          onBack={handleBack}
          onClose={() => router.push("/asset")}
        />

        <main className="app-main flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            {step === "search" && (
              <motion.div
                key="search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-[1.5rem] pt-[2.5rem] flex flex-1 flex-col"
              >
                <h2 className="text-[1.5rem] font-bold leading-[1.4] mb-[2rem] tracking-tight">
                  살고 계신 <span className="text-primary">집의 주소</span>를<br />입력해 주세요
                </h2>

                <div className="relative mb-[2rem] group">
                  <input
                    type="text"
                    placeholder="도로명 주소 또는 단지명 검색"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full h-[4.25rem] pl-[1.25rem] pr-[3.5rem] rounded-[1.25rem] border border-gray-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-[1.0625rem] font-semibold shadow-sm"
                  />
                  <Search className="absolute right-[1.25rem] top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={24} />
                </div>

                <div className="flex flex-col gap-[1rem]">
                  <p className="text-[0.9375rem] font-bold text-hana-black-900 ml-1">우리 집 특징</p>
                  <div className="flex flex-wrap gap-[0.75rem]">
                    {["아파트", "빌라", "오피스텔", "단독주택"].map(t => (
                      <button
                        key={t}
                        onClick={() => setHouseType(t)}
                        className={`px-[1.25rem] py-[0.75rem] rounded-full border transition-all text-[0.875rem] font-bold ${houseType === t
                          ? "border-primary bg-primary text-white shadow-md"
                          : "border-gray-200 text-gray-500 bg-white"
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton label="다음" disabled={!address} onClick={() => setStep("detail")} />
                </div>
              </motion.div>
            )}

            {step === "detail" && (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="px-[1.5rem] pt-[2.5rem] flex flex-1 flex-col"
              >
                <h2 className="text-[1.5rem] font-bold leading-[1.4] mb-[2.5rem] tracking-tight">
                  <span className="text-primary">상세 정보</span>를<br />확인해 주세요
                </h2>

                <div className="p-[1.75rem] bg-gray-50 rounded-[1.5rem] mb-[2.5rem] flex items-start gap-[1rem] border border-gray-100 shadow-inner">
                  <MapPin className="text-primary shrink-0 mt-1" size={22} />
                  <span className="font-bold text-[1.125rem] text-foreground leading-snug">{address}</span>
                </div>

                <div className="space-y-[2rem]">
                  <div className="flex flex-col gap-[0.75rem]">
                    <label className="text-[0.875rem] font-black text-gray-400 ml-1 uppercase">동/호</label>
                    <div className="flex gap-[1rem]">
                      <div className="flex-1 relative">
                        <input type="text" placeholder="동" className="w-full h-[4rem] px-[1rem] rounded-[1rem] border border-gray-200 outline-none focus:border-primary text-center font-black text-[1.25rem] shadow-sm" />
                      </div>
                      <div className="flex-1 relative">
                        <input type="text" placeholder="호" className="w-full h-[4rem] px-[1rem] rounded-[1rem] border border-gray-200 outline-none focus:border-primary text-center font-black text-[1.25rem] shadow-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-[0.75rem]">
                    <label className="text-[0.875rem] font-black text-gray-400 ml-1 uppercase">면적 (㎡)</label>
                    <button type="button" className="w-full h-[4.25rem] px-[1.5rem] rounded-[1.25rem] border border-gray-200 bg-white flex items-center justify-between text-left group transition-all hover:border-primary shadow-sm">
                      <span className="text-gray-400 group-focus:text-foreground font-bold text-[1.0625rem]">면적을 선택해 주세요</span>
                      <ChevronRight className="text-gray-300" size={20} />
                    </button>
                  </div>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton label="조회하기" onClick={() => setStep("result")} />
                </div>
              </motion.div>
            )}

            {step === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-[1.5rem] pt-[2.5rem] flex flex-1 flex-col"
              >
                <h2 className="text-[1.375rem] font-bold text-foreground mb-[2rem] tracking-tight">
                  <span className="text-primary">조회 결과</span>입니다
                </h2>

                <div className="rounded-[1.75rem] border border-gray-200 bg-white overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.08)]">
                  <div className="h-[12.5rem] bg-[#F1F3F5] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-[1.5rem] left-[1.5rem] right-[1.5rem]">
                      <div className="flex items-center gap-[0.75rem]">
                        <div className="p-[0.5rem] bg-primary text-white rounded-lg">
                          <Building2 size={24} />
                        </div>
                        <h3 className="text-white text-[1.25rem] font-black drop-shadow-md">
                          {address.split(' ').slice(-1)} 101동
                        </h3>
                      </div>
                    </div>
                    <div className="absolute top-[1.25rem] right-[1.25rem]">
                      <span className="px-[0.75rem] py-[0.375rem] bg-primary text-white text-[0.75rem] font-bold rounded-full shadow-lg">조회완료</span>
                    </div>
                  </div>

                  <div className="p-[1.75rem]">
                    <div className="mb-[1.75rem]">
                      <p className="text-muted-foreground text-[0.9375rem] font-semibold">{address}</p>
                    </div>

                    <div className="space-y-[1.25rem] pt-[1.75rem] border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-[0.9375rem] font-medium">최근 실거래가</span>
                        <span className="font-black text-[1.5rem] text-primary tracking-tight">15억 4,000만원</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-[0.9375rem] font-medium">공시지가</span>
                        <span className="font-bold text-[1.125rem] text-foreground">12억 1,000만원</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground text-[0.9375rem] font-medium">전용 면적</span>
                        <span className="font-bold text-[1.125rem] text-foreground">84.98㎡ (33평형)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-[1.5rem] p-[1.25rem] bg-gray-50 rounded-[1.25rem] border border-gray-100 flex items-start gap-[0.75rem]">
                  <AlertCircle size={18} className="text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
                    위 시세는 최근 국토교통부 실거래가 데이터를 기준으로 산정되었습니다. 실거래가와 차이가 있을 수 있습니다.
                  </p>
                </div>

                <div className="mt-auto pb-[3rem]">
                  <PrimaryButton label="자산 등록 완료" onClick={() => router.push("/asset?tab=realestate")} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
