"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, X } from "lucide-react";
import BlockModal from "../components/BlockModal";
import ShareSheet from "@/components/modules/ShareSheet";
import KakaoAddressMap from "../components/KakaoAddressMap";
import { CardUsageDetail } from "../../actions/card";

interface Props {
  usage: CardUsageDetail | null;
}

export default function CardUsageDetailClient({ usage }: Props) {
  const router = useRouter();
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showEvidenceSheet, setShowEvidenceSheet] = useState(false);

  if (!usage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-hana-black-500">내역을 찾을 수 없어요</p>
      </div>
    );
  }

  const isAbnormal = usage.abnmlYn === "Y";
  const isCharge = usage.usageTypeCd === "CHARGE";

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear().toString().slice(2)}.${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  };

  return (
      <div
          className="relative min-h-screen"
          style={{ background: isAbnormal ? "#FFF1F1" : "#FFFFFF" }}
      >
        {/* 1. 상단 액션 바 영역 (높이를 명시적으로 잡아줌) */}
        <div className="flex items-center justify-end px-4 h-14">
          <button
              className="w-9 h-9 bg-hana-black-50/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-active active:scale-95"
              onClick={() => router.back()}
          >
            <X size={18} color="#0A0A0A" />
          </button>
        </div>

      <div className="px-6 mt-6">
        <p className="text-xl text-hana-black-900">{usage.usageNm}</p>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-[28px] font-semibold tracking-tight text-hana-black-900">
            {usage.usageAmt.toLocaleString()}원
          </p>
          {isAbnormal && (
            <span className="px-2 py-0.5 bg-hana-red-200 rounded-full text-xs text-hana-red-500">
              이상
            </span>
          )}
        </div>
      </div>

      <div className="px-6 mt-8">
        <p className="text-base font-semibold text-black mb-4">결제 정보</p>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <span className="text-base font-medium text-black">결제 일자</span>
            <span className="text-base font-medium text-black">
              {formatDateTime(usage.createdAt)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-base font-medium text-black">승인상태</span>
            <span className="text-base font-medium text-black">
              {usage.aprvlYn === "Y" ? "정상" : "차단"}
            </span>
          </div>
        </div>
      </div>

      {/* 충전이 아닐 때만 위치/지도 표시 */}
      {!isCharge && usage.usageLoc && (
        <>
          <div className="px-6 mt-6">
            <p className="text-sm font-medium text-black leading-5">
              {usage.usageLoc}
            </p>
          </div>
          <div className="mx-6 mt-4 h-[257px] bg-hana-silver-50 rounded-xl overflow-hidden">
            <KakaoAddressMap address={usage.usageLoc} />
          </div>
        </>
      )}

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

      {showBlockModal && (
        <BlockModal
          cardId={usage.cardId}
          cardNm={usage.usageNm}
          onClose={() => setShowBlockModal(false)}
          onConfirm={() => setShowBlockModal(false)}
        />
      )}

      {showEvidenceSheet && (
        <ShareSheet
          title="증빙 요청 보내기"
          onClose={() => setShowEvidenceSheet(false)}
        />
      )}
    </div>
  );
}
