"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronDown } from "lucide-react";
import CancelModal from "./components/CancelModal";
import CardView from "../components/Cardview";

const MIN = 100000;
const MAX = 2000000;
const STEP = 100000;

export default function CardSettingsPage() {
  const router = useRouter();
  const [limitAmt, setLimitAmt] = useState(600000);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const percent = ((limitAmt - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="relative min-h-screen bg-white">
      {/* 헤더 */}
      <div className="flex justify-between items-center px-4 h-[65px] border-b border-black/10 sticky top-0 bg-white z-10">
        <button className="p-1" onClick={() => router.back()}>
          <ChevronLeft size={24} color="#0A0A0A" />
        </button>
        <span className="text-base font-medium tracking-tight text-[#0A0A0A]">카드 관리</span>
        <div className="w-8" />
      </div>

      {/* 카드 미리보기 */}
      <div className="flex justify-center mt-6">
        <CardView cardNm="요양보호사1 카드" />
      </div>

      {/* 설정 섹션 */}
      <div className="px-10 mt-8 flex flex-col gap-12">
        {/* 월 충전 한도 변경 */}
        <div>
          <p className="text-base font-medium tracking-tight text-black">월 충전 한도를 변경해주세요</p>
          <div className="mt-4 relative">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-medium text-hana-black-700">월 충전 한도</span>
              <span className="text-xs font-medium text-hana-green-700">
                {(limitAmt / 10000).toFixed(0)}만원
              </span>
            </div>
            <div className="relative h-[14px] flex items-center">
              <div
                className="absolute h-[14px] rounded-full w-full"
                style={{
                  background: `linear-gradient(90deg, rgba(13,148,136,0.8) 0%, rgba(13,148,136,0.8) ${percent}%, #E5E7EB ${percent}%, #E5E7EB 100%)`,
                }}
              />
              <input
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={limitAmt}
                onChange={(e) => setLimitAmt(Number(e.target.value))}
                className="relative w-full appearance-none bg-transparent cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-hana-green-700
                  [&::-webkit-slider-thumb]:shadow-md"
              />
            </div>
          </div>
        </div>

        {/* 충전 계좌 변경 */}
        <div>
          <p className="text-base font-medium tracking-tight text-black mb-3">충전 계좌를 변경해주세요</p>
          <div className="flex items-center justify-between w-[291px] h-[50px] px-4 border border-[#E3E5E8] rounded-xl bg-white">
            <span className="text-sm font-medium tracking-tight text-hana-black-600">
              하나은행 123-123456-12345
            </span>
            <ChevronDown size={16} color="#E5E5E5" />
          </div>
        </div>
      </div>

      {/* 해지하기 버튼 */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowCancelModal(true)}
          className="w-[120px] h-10 rounded-xl bg-hana-red-500 text-white text-sm font-semibold"
        >
          해지하기
        </button>
      </div>

      {/* 변경 완료 버튼 */}
      <div className="absolute bottom-8 left-0 right-0 px-6">
        <button
          onClick={() => router.back()}
          className="w-full h-[53px] rounded-xl bg-hana-ez-600 text-white text-base font-medium hover:bg-hana-green-700 transition-colors"
        >
          변경 완료
        </button>
      </div>

      {/* 해지 완료 모달 */}
      {showCancelModal && (
        <CancelModal onClose={() => {
          setShowCancelModal(false);
          router.push("/card");
        }} />
      )}
    </div>
  );
}