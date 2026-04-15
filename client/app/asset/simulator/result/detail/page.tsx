'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SimulationExpenseAccordion } from '@/app/asset/components/simulator/SimulationExpenseAccordion';
import { SimulationTrendChart } from '@/app/asset/components/simulator/SimulationTrendChart';
import Header from '@/components/navigation/Header';
import { getSimulationDetail } from '@/app/asset/actions/simulation';
import { SimulationDetailApiResponse } from '@/app/asset/utils/types';

export default function SimulationDetailPage() {
  const router = useRouter();
  const [data, setData] = useState<SimulationDetailApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const targetAge = parseInt(localStorage.getItem('simulation_target_age') || '85');
    const careType = localStorage.getItem('simulation_care_type') || 'CENTER';

    const fetchData = async () => {
      try {
        const result = await getSimulationDetail({ target_age: targetAge, care_type: careType });
        if (result) {
          setData(result);
        }
      } catch (error) {
        console.error('상세 데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-white" />;
  }

  const ageSegments = data?.age_segments ?? [];

  const trendData = ageSegments.map(seg => ({
    age: seg.range,
    expense: Math.floor(Number(seg.expense) / 10000),
  }));

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
        <section className="flex flex-col gap-4">
          <h2 className="font-bold text-[17px] text-hana-black-900 tracking-tight">
            월 지출 추이 상세
          </h2>
          <SimulationTrendChart data={trendData} />
        </section>

        <section className="flex flex-col gap-4.5">
          <h2 className="font-bold text-[17px] text-hana-black-900 tracking-tight">
            연령대별 수입 · 지출 내역
          </h2>
          <SimulationExpenseAccordion items={ageSegments} />
        </section>

        {data?.ai_opinion && (
            <div className="mt-4 rounded-[20px] border border-hana-silver-100 bg-white p-6 shadow-sm">
              <p className="whitespace-pre-wrap break-keep text-[14px] text-hana-black-500 leading-relaxed">
                {data.ai_opinion}
              </p>
            </div>
        )}
      </main>
    </div>
  );
}
