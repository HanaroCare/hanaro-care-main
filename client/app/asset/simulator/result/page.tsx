'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PrimaryButton from '@/components/button/PrimaryButton';
import Header from '@/components/Header';
import { SimulationDetailCard } from '../../components/simulator/SimulationDetailCard';
import { SimulationResultChart } from '../../components/simulator/SimulationResultChart';

const MOCK_SIMULATION_DATA = [
  { age: '65세', income: 200, expense: 180 },
  { age: '70세', income: 200, expense: 180 },
  { age: '75세', income: 200, expense: 180 },
  { age: '80세', income: 200, expense: 180 },
  { age: '85세', income: 200, expense: 180 },
];

const MOCK_DETAIL_DATA = [
  { label: '생활비', amount: '5억원', progress: 1.0, opacity: 0.8 },
  { label: '병원비', amount: '3000만원', progress: 0.57, opacity: 0.6 },
  { label: '요양비', amount: '5000만원', progress: 0.34, opacity: 0.4 },
];

export default function SimulatorResultPage() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-[#F0FDFA] via-[#EFF6FF] to-[#ECFEFF]">
      <Header title="진단 결과" onBack={() => router.back()} />

      <main className="flex flex-col gap-8 px-6 pt-10 pb-25">
        <div className="flex flex-col gap-2">
          <h1 className="page-center-text text-hana-black-900">
            미래 병원비 계산 결과
          </h1>
          <p className="text-center text-[14px] text-hana-black-500">
            85세까지 약{' '}
            <span className="font-bold text-hana-red-500">2억 4천만원</span>이
            <br />
            필요할 것으로 예상됩니다.
          </p>
        </div>

        <SimulationResultChart data={MOCK_SIMULATION_DATA} />

        <SimulationDetailCard items={MOCK_DETAIL_DATA} />

        <div className="flex flex-col gap-4 rounded-2xl border border-white bg-white/50 p-5 shadow-sm">
          <SummaryRow label="준비된 자산" value="6억 2,000만원" color="green" />
          <SummaryRow label="예상 총 지출" value="2억 4,000만원" color="red" />
          <div className="h-px w-full bg-hana-black-100 opacity-50" />
          <SummaryRow
            label="최종 여유 자금"
            value="3억 8,000만원"
            color="green"
            isBold
          />
        </div>

        <div className="mt-auto pt-4">
          <PrimaryButton
            label="상담 신청하기"
            onClick={() => console.log('상담 신청')}
          />
        </div>
      </main>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  color,
  isBold = false,
}: {
  label: string;
  value: string;
  color: 'green' | 'red';
  isBold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`${isBold ? 'font-bold text-[15px]' : 'text-[14px]'} text-hana-black-600`}
      >
        {label}
      </span>
      <span
        className={`${isBold ? 'font-bold text-[18px]' : 'font-semibold text-[16px]'} ${color === 'green' ? 'text-hana-green-700' : 'text-hana-red-500'}`}
      >
        {value}
      </span>
    </div>
  );
}
