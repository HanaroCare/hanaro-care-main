'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Header from '@/components/navigation/Header';
import { getInheritanceContext, type InheritanceContext } from '../actions/plan';

import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { InfoListCard } from '@/components/modules/InfoListCard';
import PageHeading from '@/components/typography/PageHeading';
import PageDescription from '@/components/typography/PageDescription';

const COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-hana-green-300)',
  'var(--color-chart-3)',
];

export default function InheritancePlanPage() {
  const [context, setContext] = useState<InheritanceContext | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getInheritanceContext();
        setContext(data);
      } catch (error) {
        console.error('Failed to fetch inheritance context:', error);
        if (error instanceof Error && error.message.includes('Unauthorized')) {
          router.replace('/login');
          return;
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const { chartData, infoItems } = useMemo(() => {
    if (!context) return { chartData: [], infoItems: [] };
    const { assetSummary } = context;

    const data = [
      { name: '예·적금', value: assetSummary.savingsAndDeposits, color: COLORS[0] },
      { name: '주식·펀드', value: assetSummary.stocksAndFunds, color: COLORS[1] },
      { name: '연금', value: assetSummary.pensions, color: COLORS[2] },
      { name: '기타자산', value: assetSummary.otherAssets, color: COLORS[3] },
    ].filter(item => item.value > 0);

    const items = data.map(item => ({
      label: item.name,
      value: `${(item.value / 10000).toLocaleString()}만원`
    }));

    return { chartData: data, infoItems: items };
  }, [context]);

  if (loading) {
    return (
        <div className="app-shell bg-white flex items-center justify-center">
          <div className="animate-pulse text-hana-ez-600 font-bold">자산 정보를 분석하고 있습니다...</div>
        </div>
    );
  }

  if (!context) {
    return (
        <div className="app-shell bg-white flex items-center justify-center">
          <PageDescription>자산 정보를 불러오는데 실패했습니다.</PageDescription>
        </div>
    );
  }

  const totalAssetBillion = (context.assetSummary.totalAsset / 100000000).toFixed(1);

  return (
      <div className="app-shell bg-white">
        <div className="app-layout">
          <Header title="상속 설계" showBackButton={true} />

          <div className="app-main no-scrollbar px-6">
            <header className="mt-8 mb-6">
              <PageDescription className="!text-left text-base mb-1">
                손님의 상속설계를 도와드릴게요
              </PageDescription>
              <PageHeading className="!text-left text-2xl font-bold">
                상속할 자산을 확인해주세요
              </PageHeading>
            </header>

            <section className="relative mb-8 flex h-[220px] w-full items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1000}
                  >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                <span className="text-[13px] text-hana-black-500 font-medium">총 자산</span>
                <span className="text-[20px] font-bold text-hana-ez-600">{totalAssetBillion}억</span>
              </div>
            </section>

            <div className="flex flex-col gap-4 mb-10">
              <InfoListCard
                  title={`연동 총 자산 (${totalAssetBillion}억원)`}
                  items={infoItems}
              />

              <InfoListCard
                  title="부동산 자산"
                  items={[
                    {
                      label: '보유 부동산 합계',
                      value: `${(context.assetSummary.realEstate / 100000000).toFixed(1)}억원`
                    }
                  ]}
              />
            </div>
          </div>

          <footer className="shrink-0 bg-white px-6 pb-10 pt-4">
            <PrimaryButton
                label="다음으로"
                variant="primary"
                onClick={() => router.push('/inheritance/plan/1')}
            />
          </footer>
        </div>
      </div>
  );
}