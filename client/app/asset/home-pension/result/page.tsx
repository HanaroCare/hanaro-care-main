'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
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
import DualActionFooter from '@/components/modules/DualActionFooter';
import InfoBox from '@/components/modules/InfoBox';
import Header from '@/components/navigation/Header';
import {
  chartData,
  type PensionType,
  pensionOptions,
  pensionPeriodAmounts,
} from '../../constants/constants';
import { handleReservation } from '../../constants/trustUtils';

function LegendDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-3.5 w-3.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

export default function PensionTypeComparePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<PensionType>('fixed');

  const current = useMemo(
    () => pensionOptions.find((item) => item.key === selectedType)!,
    [selectedType],
  );

  const periodAmount = pensionPeriodAmounts[selectedType];

  const captureRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

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
          className="app-main no-scrollbar px-5 pt-10 pb-6 bg-white"
        >
          <section>
            {/* 상단 추천 섹션 */}
            <div>
              <p className="text-[17px] leading-7 font-semibold tracking-tight text-[#4B5563]">
                {current.recommendTitle}
              </p>
              <p
                className="text-[28px] leading-12 font-bold tracking-tight"
                style={{ color: current.color }}
              >
                {current.recommendHighlight}
              </p>
            </div>

            <InfoBox
              title={current.infoTitle}
              desc={current.infoDesc}
              className="mt-2"
            />

            {/* 탭 버튼 */}
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

            {/* 누적 연금 추이 그래프 (복구 완료) */}
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
                      vertical={true}
                    />
                    <XAxis
                      dataKey="year"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                    />
                    <YAxis
                      domain={[0, 6000]}
                      ticks={[0, 1500, 3000, 4500, 6000]}
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

                    {/* 누적 데이터를 보여주는 Area 컴포넌트들 */}
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

            {/* 하단 기간별 예상 월 수령액 섹션 (제안 디자인 적용) */}
            <div className="mt-10">
              <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937] px-1">
                기간별 예상 월 수령액
              </p>

              <div className="mt-5 flex flex-col gap-4">
                {/* mode를 "popLayout" 또는 "sync"로 변경하여 여러 요소의 동시 애니메이션을 허용합니다. */}
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={selectedType} // 타입이 바뀔 때 리스트 전체가 다시 애니메이션 되도록 래퍼에 key 부여
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
                          delay: index * 0.1, // 순차적으로 나타나는 효과 유지
                          ease: 'easeOut',
                        }}
                        className="rounded-[24px] bg-[#F0FDFD] px-7 py-6 border border-[#CCFBF1] transition-all hover:bg-white hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-2 w-2">
                              <span
                                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                style={{ backgroundColor: current.color }}
                              ></span>
                              <span
                                className="relative inline-flex rounded-full h-2 w-2"
                                style={{ backgroundColor: current.color }}
                              ></span>
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
