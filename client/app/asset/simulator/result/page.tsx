'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import { SimulationDetailCard } from '../../components/simulator/SimulationDetailCard';
import { SimulationResultChart } from '../../components/simulator/SimulationResultChart';

const MOCK_SIMULATION_DATA = [
  { age: '65세', income: 250, expense: 180 },
  { age: '70세', income: 250, expense: 180 },
  { age: '75세', income: 250, expense: 180 },
  { age: '80세', income: 250, expense: 180 },
  { age: '85세', income: 250, expense: 180 },
];

const MOCK_DETAIL_DATA = [
  { label: '생활비', amount: '5억원', progress: 1.0, opacity: 1.0 },
  { label: '병원비', amount: '3000만원', progress: 0.6, opacity: 0.8 },
  { label: '요양비', amount: '5000만원', progress: 0.35, opacity: 0.6 },
];

export default function SimulatorResultPage() {
  const router = useRouter();
  // 여유 자금 여부를 판단하기 위한 상태 (실제 서비스에서는 데이터 기반)
  const [isLeeway, setIsLeeway] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    localStorage.setItem('has_completed_simulation', 'true');
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
            {isLeeway ? (
              <p className="font-bold text-[24px] text-hana-gold-500 leading-snug">
                72만원이 여유로워요
              </p>
            ) : (
              <p className="font-bold text-[24px] text-hana-red-500 leading-snug">
                67만원이 부족해요
              </p>
            )}
          </div>

          {isLeeway ? (
            <div className="flex flex-col gap-4 rounded-[24px] border border-hana-green-700/20 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[18px] text-hana-black-900">
                  남는 자산은 어떻게 할까요?
                </span>
                <p className="text-[14px] text-hana-black-500 leading-snug">
                  병원비 걱정은 덜고, <br />
                  <span className="font-semibold text-hana-gold-500">
                    상속 설계
                  </span>
                  를 통해 가족에게 마음을 전해보세요
                </p>
              </div>
              <PrimaryButton
                label="상속 설계 시작하기 >"
                onClick={() => router.push('/inheritance/intro')}
                className="bg-hana-gold-500 text-white shadow-sm active:bg-hana-gold-600"
              />
            </div>
          ) : (
            <PrimaryButton
              label="부족한 자금 해결하러 가기 >"
              onClick={() => router.push('/asset/simulator')}
              className="mt-1 bg-hana-red-500 text-white shadow-sm active:bg-hana-red-600"
            />
          )}
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
