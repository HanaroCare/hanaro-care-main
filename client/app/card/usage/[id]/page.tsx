"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Share, X } from "lucide-react";
import EvidenceSheet from "../components/EvidenceSheet";

const MOCK_USAGE = {
  id: 1,
  usageNm: "삼성서울병원",
  usageAmt: 180000,
  createdAt: "26.4.8 11:58:43",
  usageLoc: "서울 강남구 테헤란로34길 6, 9,10층 (역삼동, 태광타워)",
  aprvlYn: "Y" as "Y" | "N",
  abnmlYn: "Y" as "Y" | "N",
};

export default function CardUsageDetailPage() {
  const router = useRouter();
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showEvidenceSheet, setShowEvidenceSheet] = useState(false);

  const isAbnormal = MOCK_USAGE.abnmlYn === "Y";

  return (
    <div
      className="relative min-h-screen"
      style={{ background: isAbnormal ? "#FFF1F1" : "#FFFFFF" }}
    >
      {/* 핸들 */}
      <div className="flex justify-center pt-3">
        <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
      </div>

      {/* 상단 액션 버튼 */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button className="w-[35px] h-[35px] bg-[#E5E5E5] rounded-full flex items-center justify-center">
          <Share size={16} color="#0A0A0A" />
        </button>
        <button
          className="w-[35px] h-[35px] bg-[#E5E5E5] rounded-full flex items-center justify-center"
          onClick={() => router.back()}
        >
          <X size={16} color="#0A0A0A" />
        </button>
      </div>

      {/* 가맹점명 */}
      <div className="px-6 mt-6">
        <p className="text-xl text-hana-black-900">{MOCK_USAGE.usageNm}</p>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-[28px] font-semibold tracking-tight text-hana-black-900">
            {MOCK_USAGE.usageAmt.toLocaleString()}원
          </p>
          {isAbnormal && (
            <span className="px-2 py-0.5 bg-hana-red-200 rounded-full text-xs text-hana-red-500">
              이상
            </span>
          )}
        </div>
      </div>

      {/* 결제 정보 */}
      <div className="px-6 mt-8">
        <p className="text-base font-semibold text-black mb-4">결제 정보</p>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="text-base font-medium text-black">결제 일자</span>
            <span className="text-base font-medium text-black">{MOCK_USAGE.createdAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-base font-medium text-black">승인상태</span>
            <span className="text-base font-medium text-black">
              {MOCK_USAGE.aprvlYn === "Y" ? "정상" : "차단"}
            </span>
          </div>
        </div>
      </div>

      {/* 위치 */}
      <div className="px-6 mt-6">
        <p className="text-sm font-medium text-black leading-5">{MOCK_USAGE.usageLoc}</p>
      </div>

      {/* 지도 영역 */}
      <div className="mx-6 mt-4 h-[257px] bg-hana-silver-50 rounded-xl flex items-center justify-center">
        <p className="text-sm text-hana-black-500">지도</p>
      </div>

      {/* 이상 감지 시 하단 버튼 */}
      {isAbnormal && (
        <div className="flex gap-2 px-6 mt-8">
          <button
            onClick={() => setShowBlockModal(true)}
            className="flex-1 h-11 rounded-xl bg-hana-red-500 text-white text-base font-semibold"
          >
            카드 즉시 차단하기
          </button>
          <button
            onClick={() => setShowEvidenceSheet(true)}
            className="flex-1 h-11 rounded-xl bg-hana-red-100 text-hana-red-500 text-base font-semibold"
          >
            증빙 요청 보내기
          </button>
        </div>
      )}

      {/* 차단 확인 팝업 (인라인) */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="w-[283px] bg-white rounded-3xl p-6 relative">
            <button
              onClick={() => setShowBlockModal(false)}
              className="absolute top-4 right-4 text-lg text-hana-black-800"
            >
              ✕
            </button>
            <p className="text-base font-medium text-hana-black-900 text-center mt-8 leading-6 tracking-tight">
              요양보호사1 카드의 지출 이상 내역이 감지되었어요
            </p>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowBlockModal(false)}
                className="flex-1 h-10 rounded-xl bg-hana-red-50 text-hana-red-500 text-sm font-semibold"
              >
                카드 관리하기
              </button>
              <button
                onClick={() => {
                  setShowBlockModal(false);
                  router.push("/card");
                }}
                className="flex-1 h-10 rounded-xl bg-hana-red-500 text-white text-sm font-semibold"
              >
                내역 확인하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 증빙 요청 바텀시트 */}
      {showEvidenceSheet && (
        <EvidenceSheet onClose={() => setShowEvidenceSheet(false)} />
      )}
    </div>
  );
}