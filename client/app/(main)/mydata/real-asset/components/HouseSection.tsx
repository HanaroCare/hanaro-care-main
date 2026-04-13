"use client";

import { useState } from "react";
import PrimaryButton from "../../../../../components/PrimaryButton";
import { Search, Building2 } from "lucide-react";

/**
 * 부동산 자산 등록 및 결과 섹션
 */
export default function HouseSection({ step, onComplete }: { step: string; onComplete: () => void }) {
  const [address, setAddress] = useState("");
  const [selectedHouseType, setSelectedHouseType] = useState("아파트");

  if (step === "result") {
    return (
      <div className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem] pb-[3rem]">
        <div className="mb-[2rem]">
          <h2 className="text-[1.375rem] font-bold text-foreground">등록된 부동산 정보</h2>
        </div>

        <div className="rounded-[1.5rem] border border-gray-200 bg-white p-[1.75rem] shadow-sm">
          <div className="flex items-center gap-[1.25rem] mb-[1.5rem]">
            <div className="p-[0.875rem] bg-hana-green-50 rounded-2xl text-primary">
              <Building2 size={28} />
            </div>
            <div>
              <p className="font-bold text-[1.125rem]">자이아파트 101동</p>
              <p className="text-[0.875rem] text-muted-foreground mt-0.5">서울시 강남구 테헤란로 123</p>
            </div>
          </div>
          <div className="space-y-[1rem] pt-[1.5rem] border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-[0.9375rem]">최근 실거래가</span>
              <span className="font-bold text-[1.125rem] text-foreground">15억 4,000만원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground text-[0.9375rem]">전용 면적</span>
              <span className="font-semibold text-[1rem] text-hana-black-800">84.98㎡</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <PrimaryButton label="자산 목록으로" onClick={() => { }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem] pb-[3rem]">
      <div className="mb-[2.5rem]">
        <h2 className="text-[1.5rem] font-bold leading-[1.4] text-foreground tracking-tight">
          살고 계신 집의<br />주소를 입력해 주세요
        </h2>
      </div>

      <div className="relative group">
        <input
          type="text"
          placeholder="도로명 주소 또는 단지명 검색"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full h-[3.75rem] pl-[1.25rem] pr-[3.5rem] rounded-[1rem] border border-gray-200 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-[1rem]"
        />
        <div className="absolute right-[1.25rem] top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
          <Search size={22} />
        </div>
      </div>

      <div className="mt-[2.5rem] flex flex-col gap-[1rem]">
        <p className="text-[0.9375rem] font-bold text-hana-black-900">우리 집 특징</p>
        <div className="flex flex-wrap gap-[0.75rem]">
          {["아파트", "빌라", "오피스텔", "단독주택"].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedHouseType(type)}
              className={`px-[1.125rem] py-[0.625rem] rounded-full border transition-all text-[0.875rem] font-medium ${selectedHouseType === type
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-gray-200 text-hana-black-700 bg-white"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <PrimaryButton label="조회하기" disabled={!address} onClick={onComplete} />
      </div>
    </div>
  );
}
