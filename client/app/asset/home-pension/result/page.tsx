'use client';

import { motion } from 'framer-motion';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
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

type PensionType = 'fixed' | 'boosted' | 'growing';

const pensionOptions = [
  {
    key: 'fixed' as const,
    label: '정액형',
    color: '#0B666A',
    infoTitle: '정액형이란?',
    infoDesc: '고정된 금액을 평생 수령하는 방식이에요',
    monthlyAmount: '300만원',
    recommendTitle: '권하나님의 주택 연금 수령 방식은',
    recommendHighlight: '정액형',
    recommendSuffix: '으로 추천드립니다.',
  },
  {
    key: 'boosted' as const,
    label: '초기증액형',
    color: '#1098A0',
    infoTitle: '초기증액형이란?',
    infoDesc: '초기 몇 년간 더 많이 받고 이후에는 줄어드는 방식이에요',
    monthlyAmount: '280만원',
    recommendTitle: '권하나님의 주택 연금 수령 방식은',
    recommendHighlight: '초기증액형',
    recommendSuffix: '으로 추천드립니다.',
  },
  {
    key: 'growing' as const,
    label: '정기증가형',
    color: '#13C2C9',
    infoTitle: '정기증가형이란?',
    infoDesc: '시간이 지날수록 월 수령액이 점차 증가하는 방식이에요',
    monthlyAmount: '350만원',
    recommendTitle: '권하나님의 주택 연금 수령 방식은',
    recommendHighlight: '정기증가형',
    recommendSuffix: '으로 추천드립니다.',
  },
];

const chartData = [
  { year: '1년', fixed: 100, boosted: 800, growing: 100 },
  { year: '4년', fixed: 1000, boosted: 1300, growing: 700 },
  { year: '7년', fixed: 1900, boosted: 1800, growing: 1300 },
  { year: '10년', fixed: 2800, boosted: 2300, growing: 1900 },
  { year: '13년', fixed: 3600, boosted: 2800, growing: 2500 },
  { year: '16년', fixed: 4400, boosted: 3300, growing: 3100 },
  { year: '19년', fixed: 5100, boosted: 3900, growing: 3800 },
];

function LegendDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block h-3.5 w-3.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
}

function MonthlyAmountCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <motion.div
      key={label}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="rounded-4xl bg-[#EAF8F7] px-6 py-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="h-3.5 w-3.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-[16px] leading-6 font-semibold tracking-tight text-[#0F172A]">
            {label}
          </span>
        </div>

        <span
          className="text-[18px] leading-7 font-bold tracking-tight"
          style={{ color }}
        >
          {value}
        </span>
      </div>
    </motion.div>
  );
}

function AnimatedRangeBar({ color }: { color: string }) {
  return (
    <div className="mt-4">
      <div className="h-4 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '22%' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-[14px] leading-5 font-medium text-[#6B7280]">
        <span>1년 후</span>
        <span>20년 후</span>
      </div>
    </div>
  );
}

export default function PensionTypeComparePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<PensionType>('fixed');

  const current = useMemo(
    () => pensionOptions.find((item) => item.key === selectedType)!,
    [selectedType],
  );

  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <Header
          title="주택 연금"
          showCloseButton
          onClose={() => router.push('/asset/simulator' as Route)}
        />
        <main className="app-main no-scrollbar px-5 pt-10 pb-6">
          <section>
            <div>
              <p className="text-[17px] leading-7 font-semibold tracking-tight text-[#4B5563]">
                {current.recommendTitle}
              </p>
              <p
                className="text-[28px] leading-10 font-bold tracking-tight"
                style={{ color: current.color }}
              >
                {current.recommendHighlight}
              </p>
              <p className="text-[17px] leading-7 font-medium tracking-tight text-[#4B5563]">
                {current.recommendSuffix}
              </p>
            </div>

            <InfoBox
              title={current.infoTitle}
              desc={current.infoDesc}
              className="mt-6"
            />

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

            <div className="mt-6 rounded-[24px] border border-[#E5E7EB] bg-white px-5 py-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                수령 방식별 추이
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

            <div className="mt-5 rounded-[24px] border border-[#E5E7EB] bg-white px-5 py-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                방식별 예상 월 수령액
              </p>

              <AnimatedRangeBar color={current.color} />

              <div className="mt-7">
                <MonthlyAmountCard
                  label={current.label}
                  value={current.monthlyAmount}
                  color={current.color}
                />
              </div>
            </div>
          </section>
        </main>
        <DualActionFooter
          leftLabel="결과 저장하기"
          rightLabel="상담 예약하기"
          onLeftClick={() => {
            // TODO: 저장 로직
          }}
          onRightClick={() => {
            // TODO: 상담 페이지 이동
            // router.push('/some-path' as Route);
          }}
        />
      </div>
    </div>
  );
}
