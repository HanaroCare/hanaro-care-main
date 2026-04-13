'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
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
  { label: '생활비', amount: '5억원', progress: 1.0, opacity: 1.0 },
  { label: '병원비', amount: '3000만원', progress: 0.6, opacity: 0.8 },
  { label: '요양비', amount: '5000만원', progress: 0.35, opacity: 0.6 },
];

export default function SimulatorResultPage() {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
    localStorage.setItem('has_completed_simulation', 'true');
  }, []);

  return (
    /* 🛠 리팩토링 포인트: 그라데이션 배경 적용 */
    <div
      className="flex min-h-screen flex-col font-sans"
      style={{
        background:
          'linear-gradient(174deg, var(--color-hana-green-50) 0%, var(--color-hana-blue-50) 49.4%, var(--color-hana-teal-50) 98.8%)',
      }}
    >
      <Header
        title="진단 결과"
        onBack={() => router.back()}
        className="border-none bg-transparent"
      />

      <main className="flex flex-col gap-9 px-6 pt-6 pb-20">
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 text-hana-black-900 tracking-snug">
            <h1 className="font-semibold text-[22px] leading-snug">
              지금 수입으로{' '}
              <span className="font-bold text-hana-green-700">85세</span>까지
            </h1>
            <p className="font-semibold text-[22px] leading-snug">매달 평균</p>
            <p className="font-bold text-[24px] text-hana-red-500 leading-snug">
              67만원이 부족해요
            </p>
          </div>

          <PrimaryButton
            label="부족한 자금 해결하러 가기 >"
            onClick={() => router.push('/asset/simulator')}
            className="mt-1 bg-hana-red-500 text-white shadow-sm active:bg-hana-red-600"
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-bold text-[17px] text-hana-black-800 tracking-tight">
            지출 내역
          </h2>
          <SimulationDetailCard items={MOCK_DETAIL_DATA} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-bold text-[17px] text-hana-black-800 tracking-tight">
            연령대별 월 지출 내역
          </h2>
          <SimulationResultChart data={MOCK_SIMULATION_DATA} />
        </section>

        <div className="mt-4">
          <PrimaryButton
            label="연령별로 결과 자세히 보기"
            onClick={() => router.push('/asset/simulator/result/detail')}
            variant="primary"
          />
        </div>
      </main>
    </div>
  );
}
