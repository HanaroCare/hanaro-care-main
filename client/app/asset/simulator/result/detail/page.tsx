'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SimulationExpenseAccordion } from '@/app/asset/components/simulator/SimulationExpenseAccordion';
import { SimulationIncomeCard } from '@/app/asset/components/simulator/SimulationIncomeCard';
import { SimulationTrendChart } from '@/app/asset/components/simulator/SimulationTrendChart';
import Header from '@/components/navigation/Header';

const MOCK_INCOME_DATA = [
  { label: '국민 연금', amount: '80만원' },
  { label: '퇴직 연금', amount: '80만원' },
  {
    label: '지자체 지원',
    amount: '월 33만원',
    subLabel: '(OO지자체 기준)',
    subLabel2: '(OO년 환산)',
  },
];

export default function SimulationDetailPage() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col font-sans"
      style={{
        background:
          'linear-gradient(174deg, var(--color-hana-green-50) 0%, var(--color-hana-blue-50) 49.4%, var(--color-hana-teal-50) 98.8%)',
      }}
    >
      <Header
        title="상세 분석 결과"
        onBack={() => router.back()}
        className="border-none bg-transparent"
      />

      <main className="flex flex-col gap-10 px-6 pt-6 pb-20">
        {/* 1. 수입 상세 내역 섹션 */}
        <section className="flex flex-col gap-4">
          <h2 className="font-bold text-[17px] text-hana-black-900 tracking-tight">
            매달 확보한 금융 자산
          </h2>
          <SimulationIncomeCard
            items={MOCK_INCOME_DATA}
            totalAvailable="193만원"
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-bold text-[17px] text-hana-black-900 tracking-tight">
            월 지출 추이 상세
          </h2>
          <SimulationTrendChart />

          <div className="mt-4 rounded-[20px] border border-hana-silver-100 bg-white p-6 shadow-sm">
            <p className="text-[14px] text-hana-black-500 leading-relaxed">
              전문가 분석 결과,{' '}
              <span className="font-bold text-hana-red-500">
                70세에서 75세 사이
              </span>
              에 의료비 지출이 급격히 증가할 것으로 예상됩니다. 이 시기를 대비한
              추가적인 자산 확보 전략이 필요합니다.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4.5">
          <h2 className="font-bold text-[17px] text-hana-black-900 tracking-tight">
            연령대별 월 지출 내역
          </h2>
          <SimulationExpenseAccordion />
        </section>
      </main>
    </div>
  );
}
