"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Route } from "next";
import { SimulationSummaryApiResponse } from "@/app/asset/utils/types";

function SummaryItem({ label, value, colorClass = "text-white" }: { label: string; value: string; colorClass?: string }) {
  return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-[14px] bg-white/20 px-2 py-4">
        <span className="mb-1 font-medium text-[13px] text-white/90">{label}</span>
        <span className={`font-bold text-[17px] ${colorClass}`}>{value}</span>
      </div>
  );
}

export function SimulatorSummaryCard({ data }: { data: SimulationSummaryApiResponse | null }) {
  const router = useRouter();

  if (!data) return <div className="h-62.5 w-full animate-pulse rounded-[24px] bg-gray-200" />;

  /** 1. 데이터 파싱 및 개월 수 계산 **/
  const segments = data.age_segments || [];
  let totalMonths = 1;
  let displayTargetAge = 85;

  if (segments.length > 0) {
    const startAge = parseInt(segments[0].range.split('-')[0]) || 65;
    const lastRange = segments[segments.length - 1].range;
    displayTargetAge = parseInt(lastRange.split('-')[1].replace(/[^0-9]/g, '')) || 85;
    totalMonths = Math.max(1, (displayTargetAge - startAge) * 12);
  }

  const isShortage = !data.isSufficient;
  const absGapAmt = Math.abs(data.shortageAmt);

  const avgMonthlyLiving = Math.floor((data.livingCost / totalMonths) / 10000);
  const avgMonthlyMedical = Math.floor((data.medicalCost / totalMonths) / 10000);

  const monthlyGapDisplay = Math.floor(absGapAmt / 10000);

  return (
      <div
          className="relative flex w-full flex-col overflow-hidden rounded-[24px] p-6 text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #00A8A6 0%, #4AFEF1 100%)" }}
      >
        <div className="mb-6 flex flex-col gap-1">
          <span className="font-medium text-[14px] text-white/90">시뮬레이터 결과</span>
          <h3 className="font-bold text-[22px] leading-tight">
            ~{displayTargetAge}세까지 노후 자금 준비 현황
          </h3>
        </div>

        <div className="mb-8 flex gap-3">
          <SummaryItem label="월 생활비" value={`${avgMonthlyLiving.toLocaleString()}만`} />
          <SummaryItem label="월 의료비" value={`${avgMonthlyMedical.toLocaleString()}만`} />

          <SummaryItem
              label={isShortage ? "월 부족액" : "월 여유자금"}
              value={`${monthlyGapDisplay.toLocaleString()}만원`}
              colorClass={isShortage ? "text-hana-red-500" : "text-hana-gold-400"}
          />
        </div>

        <div className="h-px w-full bg-white/20" />

        <button
            type="button"
            onClick={() => router.push("/asset/simulator/result" as Route)}
            className="mt-5 flex items-center justify-between rounded-lg font-semibold text-[15px] text-white focus:outline-none"
        >
          <span>상세 결과 보기</span>
          <ChevronRight size={20} />
        </button>
      </div>
  );
}
