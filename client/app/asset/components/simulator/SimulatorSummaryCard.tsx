'use client';

import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

type SummaryItemProps = {
  label: string;
  value: string;
};

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-[14px] bg-white/20 py-4 px-2">
      <span className="mb-1 text-[13px] font-medium text-white/90">
        {label}
      </span>
      <span className="text-[17px] font-bold text-[#FF4D4D]">
        {value}
      </span>
    </div>
  );
}

export function SimulatorSummaryCard() {
  const router = useRouter();

  return (
    <div
      className="relative flex w-full flex-col overflow-hidden rounded-[24px] p-6 text-white shadow-lg"
      style={{
        background: 'linear-gradient(135deg, #00A8A6 0%, #4AFEF1 100%)',
      }}
    >
      <div className="mb-6 flex flex-col gap-1">
        <span className="text-[14px] font-medium text-white/90">
          시뮬레이터 결과
        </span>
        <h3 className="text-[22px] font-bold leading-tight">
          ~85세까지 자금 현황
        </h3>
      </div>

      <div className="mb-8 flex gap-3">
        <SummaryItem label="총 필요" value="6.2억" />
        <SummaryItem label="총 확보" value="5.1억" />
        <SummaryItem label="월 부족" value="42만원" />
      </div>

      <div className="h-px w-full bg-white/20" />

      <button
        type="button"
        onClick={() => router.push('/asset/simulator/result')}
        className="mt-5 flex items-center justify-between text-[15px] font-semibold text-white outline-none"
      >
        <span>상세 결과 보기</span>
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
