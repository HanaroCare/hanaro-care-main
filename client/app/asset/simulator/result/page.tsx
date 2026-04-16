'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import { SimulationDetailCard } from '../../components/simulator/SimulationDetailCard';
import { SimulationResultChart } from '../../components/simulator/SimulationResultChart';
import { getSimulationSummary } from '../../actions/simulation';
import {SimulationSummaryApiResponse} from "@/app/asset/utils/types";

export default function SimulatorResultPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SimulationSummaryApiResponse | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    localStorage.setItem('has_completed_simulation', 'true');

    const fetchData = async () => {
      try {
        const result = await getSimulationSummary();
        if (result) {
          setData(result);
        }
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-white" />;
  }

  if (!data) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center">
          <p className="text-hana-black-500">시뮬레이션 결과를 찾을 수 없습니다.<br/>다시 시도해주세요.</p>
        </div>
    );
  }

  const isLeeway = data.isSufficient ?? false;

  // shortageAmt = 월 부족/여유 금액 (원 단위). age_segments[0]에서 맥락 표시용 수입/지출 추출
  const firstSeg = data.age_segments?.[0];
  // const monthlyIncomeManwon = firstSeg ? Math.floor(Number(firstSeg.income) / 10000) : null;
  // const monthlyExpenseManwon = firstSeg ? Math.floor(Number(firstSeg.expense) / 10000) : null;
  const shortageManwon = Math.floor(Math.abs(Number(data.shortageAmt) || 0) / 10000);

  const living = Number(data.livingCost) || 0;
  const medical = Number(data.medicalCost) || 0;
  const care = Number(data.careCost) || 0;
  const totalCost = living + medical + care || 1;

  const formatWon = (won: number): string => {
    const manwon = Math.floor(won / 10000);
    if (manwon >= 10000) {
      const uk = Math.floor(manwon / 10000);
      const rem = manwon % 10000;
      return rem > 0 ? `${uk}억 ${rem.toLocaleString()}만원` : `${uk}억원`;
    }
    return `${manwon.toLocaleString()}만원`;
  };

  const detailItems = [
    {
      label: '생활비',
      amount: formatWon(living),
      progress: living / totalCost,
      opacity: 1.0,
    },
    {
      label: '병원비',
      amount: formatWon(medical),
      progress: medical / totalCost,
      opacity: 0.8,
    },
    {
      label: '요양비',
      amount: formatWon(care),
      progress: care / totalCost,
      opacity: 0.6,
    },
  ];

  const chartData = (data.age_segments || []).map(seg => ({
    age: seg.range,
    income: Math.floor(Number(seg.income) / 10000),
    expense: Math.floor(Number(seg.expense) / 10000),
  }));

  const targetAge = typeof window !== 'undefined'
    ? parseInt(localStorage.getItem('simulation_target_age') || '85')
    : 85;

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
                지금 수입으로 <span className="font-bold text-hana-green-700">{targetAge}세</span>까지
              </h1>
              <p className="font-semibold text-[22px] leading-snug">매달 평균</p>
              {isLeeway ? (
                  <p className="font-bold text-[24px] text-hana-gold-500 leading-snug">
                    {shortageManwon.toLocaleString()}만원이 여유로워요
                  </p>
              ) : (
                  <p className="font-bold text-[24px] text-hana-red-500 leading-snug">
                    {shortageManwon.toLocaleString()}만원이 부족해요
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
                      <span className="font-semibold text-hana-gold-500">상속 설계</span>를 통해 가족에게 마음을 전해보세요
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
                    onClick={() => router.push('/asset/housing')}
                    className="mt-1 bg-hana-red-500 text-white shadow-sm active:bg-hana-red-600"
                />
            )}
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-[17px] text-hana-black-800 tracking-tight">
              지출 내역
            </h2>
            <SimulationDetailCard items={detailItems} />
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-[17px] text-hana-black-800 tracking-tight">
              연령대별 월 지출 내역
            </h2>
            <SimulationResultChart data={chartData} />
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
