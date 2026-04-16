'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  getPayoutComparison,
  type PensionPayoutComparisonResponse,
  type PensionPayoutPlan,
} from '@/app/asset/actions/pension';
import { getMyInfo, type MyInfo } from '@/app/dev/actions/admin';
import DualActionFooter from '@/components/modules/DualActionFooter';
import InfoBox from '@/components/modules/InfoBox';
import Header from '@/components/navigation/Header';
import { type PensionType, pensionOptions } from '../../constants/constants';
import { handleReservation } from '../../constants/trustUtils';

const COMPLETION_PENSION_KEY = 'has_completed_pension';
function LegendDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-3.5 w-3.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

function mapApiTypeToUiType(type: string): PensionType {
  if (type === 'FIXED') return 'fixed';
  if (type === 'FRONT_LOADED') return 'boosted';
  return 'growing';
}

function formatManwon(value: number) {
  return `${Math.round(value / 10_000).toLocaleString()}만원`;
}

type Props = {
  realAssetId: number;
};

export default function HomePensionResultClient({ realAssetId }: Props) {
  const router = useRouter();

  const [comparison, setComparison] =
    useState<PensionPayoutComparisonResponse | null>(null);
  const [selectedType, setSelectedType] = useState<PensionType>('fixed');
  const [myInfo, setMyInfo] = useState<MyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!realAssetId) {
      setErrorMessage('대상 주택 정보를 확인할 수 없어요.');
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const comparisonData = await getPayoutComparison(realAssetId);
        setComparison(comparisonData);
        setSelectedType(mapApiTypeToUiType(comparisonData.recommendedType));

        localStorage.setItem(COMPLETION_PENSION_KEY, 'true');

        try {
          const myInfoData = await getMyInfo();
          setMyInfo(myInfoData);
        } catch (error) {
          console.error('내 정보 조회 실패', error);
          setMyInfo(null);
        }
      } catch (error) {
        console.error('수령 방식 비교 조회 실패', error);
        setErrorMessage('수령 방식 비교 정보를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [realAssetId]);

  const current = useMemo(
    () => pensionOptions.find((item) => item.key === selectedType)!,
    [selectedType],
  );

  const planMap = useMemo(() => {
    const result: Record<PensionType, PensionPayoutPlan | null> = {
      fixed: null,
      boosted: null,
      growing: null,
    };

    comparison?.plans.forEach((plan) => {
      result[mapApiTypeToUiType(plan.type)] = plan;
    });

    return result;
  }, [comparison]);

  const selectedPlan = planMap[selectedType];

  const chartData = useMemo(() => {
    const yearMap = new Map<
      number,
      { year: number; fixed?: number; boosted?: number; growing?: number }
    >();

    comparison?.plans.forEach((plan) => {
      const uiType = mapApiTypeToUiType(plan.type);

      plan.yearlyData.forEach((item) => {
        const existing = yearMap.get(item.year) ?? { year: item.year };

        existing[uiType] = Number((item.cumulativeAmount / 10_000).toFixed(0));

        yearMap.set(item.year, existing);
      });
    });

    return Array.from(yearMap.values()).sort((a, b) => a.year - b.year);
  }, [comparison]);

  const periodAmount = useMemo(() => {
    if (!selectedPlan) {
      return {
        year10: '-',
        year20: '-',
        year30: '-',
      };
    }

    const getAmountByYear = (targetYear: number) => {
      const found = selectedPlan.yearlyData.find(
        (item) => item.year === targetYear,
      );
      return found ? formatManwon(found.monthlyAmount) : '-';
    };

    return {
      year10: getAmountByYear(10),
      year20: getAmountByYear(20),
      year30: getAmountByYear(30),
    };
  }, [selectedPlan]);

  const handleSaveImage = async () => {
    if (!captureRef.current) return;

    try {
      setIsSaving(true);

      const node = captureRef.current;
      const width = node.scrollWidth;
      const height = node.scrollHeight;

      const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        canvasWidth: width,
        canvasHeight: height,
        width,
        height,
        style: {
          width: `${width}px`,
          height: `${height}px`,
        },
      });

      const link = document.createElement('a');
      link.download = `pension-result-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('이미지 저장 실패', error);
    } finally {
      setIsSaving(false);
    }
  };

  const ageBasedHint = useMemo(() => {
    const age = myInfo?.userAge;

    if (!age) return null;

    if (age <= 59) {
      return {
        suggestedType: 'boosted' as PensionType,
        message:
          '자녀 결혼, 생활비 전환 등 초반 지출이 크다면 초기증액형이 도움이 될 수 있어요.',
      };
    }

    if (age >= 70) {
      return {
        suggestedType: 'growing' as PensionType,
        message:
          '초반보다 후반 생활비/의료비 부담이 더 커질 것 같을 때 정기증가형도 함께 살펴보세요.',
      };
    }

    return {
      suggestedType: 'fixed' as PensionType,
      message:
        '매달 일정한 금액으로 안정적으로 받고 싶다면 정액형도 잘 맞을 수 있어요.',
    };
  }, [myInfo]);

  if (isLoading) {
    return (
      <div className="app-shell bg-white">
        <div className="app-layout bg-white">
          <Header title="맞춤형 수령 방식 추천" showBackButton />
          <main className="app-main px-5 pt-10">
            <p className="text-[14px] text-[#9CA3AF]">불러오는 중...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!comparison || errorMessage) {
    return (
      <div className="app-shell bg-white">
        <div className="app-layout bg-white">
          <Header title="맞춤형 수령 방식 추천" showBackButton />
          <main className="app-main px-5 pt-10">
            <p className="text-[14px] text-[#EF4444]">
              {errorMessage ?? '비교 결과가 없어요.'}
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <Header
          title="맞춤형 수령 방식 추천"
          showCloseButton
          onClose={() => router.push('/asset/simulator' as Route)}
        />

        <main
          ref={captureRef}
          className="app-main no-scrollbar bg-white px-5 pt-10 pb-6"
        >
          <section>
            <div>
              <p className="text-[17px] leading-7 font-semibold tracking-tight text-[#4B5563]">
                AI가 추천한 수령 방식
              </p>
              <p
                className="text-[28px] leading-12 font-bold tracking-tight"
                style={{ color: current.color }}
              >
                {comparison.recommendedLabel}
              </p>
            </div>

            <InfoBox
              title={`${comparison.recommendedLabel}이 가장 적합해요`}
              desc="주택 평가액을 기준으로 정액형, 초기증액형, 정기증가형을 비교한 결과예요."
              className="mt-2"
            />
            {ageBasedHint && ageBasedHint.suggestedType !== selectedType && (
              <div className="mt-4 rounded-[20px] border border-[#E5E7EB] bg-[#F9FAFB] px-5 py-4">
                <p className="text-[14px] leading-6 font-semibold text-[#1F2937]">
                  함께 살펴보면 좋은 방식
                </p>
                <p className="mt-1 text-[14px] leading-6 font-medium text-[#4B5563]">
                  {ageBasedHint.message}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {pensionOptions.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedType(item.key)}
                  className="flex items-center gap-2"
                >
                  <LegendDot color={item.color} />
                  <span
                    className="text-[14px] leading-5 font-medium"
                    style={{
                      color: selectedType === item.key ? '#374151' : '#6B7280',
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-[24px] border border-[#E5E7EB] bg-white px-5 py-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                수령 방식별 누적 연금
              </p>

              <div className="mt-5 h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke="#E5E7EB"
                      strokeDasharray="3 3"
                      vertical
                    />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      width={58}
                      tickFormatter={(value) => `${value}만원`}
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                    />
                    <Tooltip
                      formatter={(value, name) => [`${value}만원`, name]}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #E5E7EB',
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      height={0}
                      content={() => null}
                    />

                    <Area
                      type="linear"
                      dataKey="fixed"
                      name="정액형"
                      stroke={pensionOptions[0].color}
                      strokeWidth={selectedType === 'fixed' ? 4 : 3}
                      strokeOpacity={selectedType === 'fixed' ? 1 : 0.8}
                      strokeDasharray={
                        selectedType === 'fixed' ? undefined : '6 6'
                      }
                      fill={pensionOptions[0].color}
                      fillOpacity={selectedType === 'fixed' ? 0.18 : 0}
                      dot={false}
                      activeDot={{ r: 4 }}
                      isAnimationActive
                    />
                    <Area
                      type="linear"
                      dataKey="boosted"
                      name="초기증액형"
                      stroke={pensionOptions[1].color}
                      strokeWidth={selectedType === 'boosted' ? 4 : 3}
                      strokeOpacity={selectedType === 'boosted' ? 1 : 0.8}
                      strokeDasharray={
                        selectedType === 'boosted' ? undefined : '6 6'
                      }
                      fill={pensionOptions[1].color}
                      fillOpacity={selectedType === 'boosted' ? 0.18 : 0}
                      dot={false}
                      activeDot={{ r: 4 }}
                      isAnimationActive
                    />
                    <Area
                      type="linear"
                      dataKey="growing"
                      name="정기증가형"
                      stroke={pensionOptions[2].color}
                      strokeWidth={selectedType === 'growing' ? 4 : 3}
                      strokeOpacity={selectedType === 'growing' ? 1 : 0.8}
                      strokeDasharray={
                        selectedType === 'growing' ? undefined : '6 6'
                      }
                      fill={pensionOptions[2].color}
                      fillOpacity={selectedType === 'growing' ? 0.18 : 0}
                      dot={false}
                      activeDot={{ r: 4 }}
                      isAnimationActive
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="mt-10">
              <p className="px-1 text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                기간별 예상 월 수령액
              </p>

              <div className="mt-5 flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={selectedType}
                    className="flex flex-col gap-4"
                  >
                    {[
                      { year: '10', amount: periodAmount.year10 },
                      { year: '20', amount: periodAmount.year20 },
                      { year: '30', amount: periodAmount.year30 },
                    ].map((item, index) => (
                      <motion.div
                        key={`${selectedType}-${item.year}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{
                          duration: 0.35,
                          delay: index * 0.1,
                          ease: 'easeOut',
                        }}
                        className="rounded-[24px] border border-[#CCFBF1] bg-[#F0FDFD] px-7 py-6 transition-all hover:bg-white hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-2 w-2">
                              <span
                                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                                style={{ backgroundColor: current.color }}
                              />
                              <span
                                className="relative inline-flex h-2 w-2 rounded-full"
                                style={{ backgroundColor: current.color }}
                              />
                            </div>
                            <span className="text-[17px] leading-7 font-bold tracking-tight text-[#111827]">
                              {item.year}년 뒤
                            </span>
                          </div>

                          <span
                            className="text-[19px] font-black tracking-tight"
                            style={{ color: current.color }}
                          >
                            {item.amount}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>
        </main>

        <DualActionFooter
          leftLabel={isSaving ? '저장 중...' : '결과 저장하기'}
          rightLabel="상담 예약하기"
          onLeftClick={handleSaveImage}
          onRightClick={handleReservation}
        />
      </div>
    </div>
  );
}
