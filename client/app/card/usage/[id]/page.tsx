"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, X } from "lucide-react";
import BlockModal from "../components/BlockModal";
import EvidenceSheet from "../components/EvidenceSheet";

// TODO: 백엔드 연동 시 useParams로 id 받아서 GET /api/cards/usages/{id} 호출로 교체
const MOCK_USAGE = {
  id: 1,
  usageNm: "삼성서울병원",
  usageAmt: 180000,
  createdAt: "26.4.8 11:58:43",
  // TODO: 백엔드 연동 시 실제 위치 데이터로 교체
  usageLoc: "서울 강남구 테헤란로34길 6, 9,10층 (역삼동, 태광타워)",
  // TODO: 백엔드 연동 시 네이버맵 API로 교체. 현재는 /images/card/ 하위 샘플 이미지 사용
  mapImageUrl: "/images/card/map-sample.png" as string | null,
  aprvlYn: "Y" as "Y" | "N",
};

export default function CardUsageDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAbnormal = searchParams.get("abnml") === "Y";

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showEvidenceSheet, setShowEvidenceSheet] = useState(false);

  return (
    <div
      className="relative min-h-screen"
      style={{ background: isAbnormal ? "#FFF1F1" : "#FFFFFF" }}
    >
      {/* 상단 액션 버튼 */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* TODO: 백엔드 연동 시 영수증 다운로드 기능 구현 */}
        <button className="w-[35px] h-[35px] bg-[#E5E5E5] rounded-full flex items-center justify-center">
          <Download size={16} color="#0A0A0A" />
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

      {/* 지도 영역 - TODO: 백엔드 연동 시 네이버맵 API로 교체 */}
      <div className="mx-6 mt-4 h-[257px] bg-hana-silver-50 rounded-xl overflow-hidden">
        {MOCK_USAGE.mapImageUrl ? (
          <img src={MOCK_USAGE.mapImageUrl} alt="지도" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <p className="text-sm text-hana-black-500">지도 준비 중</p>
            <p className="text-xs text-hana-black-500 opacity-50">{MOCK_USAGE.usageLoc}</p>
          </div>
        )}
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

      {/* 차단 확인 팝업 */}
      {showBlockModal && (
        <BlockModal
          onClose={() => setShowBlockModal(false)}
          onConfirm={() => {
            setShowBlockModal(false);
            router.push("/card");
          }}
        />
      )}

      {/* 증빙 요청 바텀시트 */}
      {showEvidenceSheet && (
        <EvidenceSheet onClose={() => setShowEvidenceSheet(false)} />
      )}
    </div>
  );
}