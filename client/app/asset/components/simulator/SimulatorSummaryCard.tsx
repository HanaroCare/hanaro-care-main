'use client';

import { ChevronRight } from 'lucide-react';
import { Route } from 'next';
import { useRouter } from 'next/navigation';

type SummaryItemProps = {
  label: string;
  value: string;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-[14px] bg-white/20 px-2 py-4">
      <span className="mb-1 font-medium text-[13px] text-white/90">
        {label}
      </span>
      <span className="font-bold text-[#FF4D4D] text-[17px]">{value}</span>
    </div>
  );
}

export function SimulatorSummaryCard() {
  const router = useRouter();

  return (
    <div
      className="relative flex w-full flex-col overflow-hidden rounded-[24px] p-6 text-white shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #0C8585 0%, #58C7C7 100%)',
      }}
    >
      <div className="mb-4 flex flex-col gap-1">
        <span className="font-medium text-[14px] text-white/90">
          시뮬레이터 결과
        </span>
        <h3 className="font-bold text-[22px] leading-tight">
          ~85세까지 의료비 준비 현황
        </h3>
      </div>

      <div className="mb-5 flex gap-3">
        <SummaryItem label="필요 비용" value="6.2억" />
        <SummaryItem label="확보 자금" value="5.1억" />
        <SummaryItem label="월 부족액" value="42만원" />
      </div>

      <div className="h-px w-full bg-white/20" />

      <button
        type="button"
        onClick={() => router.push('/asset/simulator/result' as Route)}
        className="mt-3 flex items-center justify-between rounded-lg font-semibold text-[15px] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00A8A6]"
      >
        <span>상세 결과 보기</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
