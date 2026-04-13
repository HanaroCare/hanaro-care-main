'use client';

import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import DualActionFooter from '@/components/modules/DualActionFooter';
import Header from '@/components/navigation/Header';

type ChartEntry = {
  label: string;
  principal: number;
  profit: number;
};

const chartData: ChartEntry[] = [
  { label: '1천만', principal: 1_000, profit: 230 },
  { label: '3천만', principal: 3_000, profit: 690 },
  { label: '5천만', principal: 5_000, profit: 1_150 },
  { label: '1억', principal: 10_000, profit: 2_300 },
  { label: '1.5억', principal: 15_000, profit: 3_450 },
  { label: '2억', principal: 20_000, profit: 4_600 },
];

const Y_TICKS = [0, 7_000, 13_000, 19_000, 26_000];

function formatYTick(value: number) {
  return `${(value / 10_000).toFixed(1)}억`;
}

function formatMoneyFromManwon(value: number) {
  if (value >= 10_000) {
    const eok = Math.floor(value / 10_000);
    const man = value % 10_000;
    return man > 0 ? `${eok}억 ${man.toLocaleString()}만원` : `${eok}억원`;
  }
  return `${value.toLocaleString()}만원`;
}

function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function ProfitBarChart({
  selectedLabel,
  onSelect,
}: {
  selectedLabel: string;
  onSelect: (label: string) => void;
}) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={chartData}
        margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
        barCategoryGap="20%"
        accessibilityLayer={false}
      >
        <CartesianGrid vertical={false} stroke="#E5E7EB" strokeWidth={0.5} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: '#6A7282' }}
          dy={4}
        />
        <YAxis
          ticks={Y_TICKS}
          tickFormatter={formatYTick}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: '#9CA3AF' }}
          width={38}
          domain={[0, 26_000]}
        />

        <Bar
          dataKey="principal"
          stackId="a"
          maxBarSize={40}
          radius={[0, 0, 4, 4]}
          onClick={(_, index) => {
            const entry = chartData[index];
            if (entry) onSelect(entry.label);
          }}
          cursor="pointer"
        >
          {chartData.map((entry) => (
            <Cell
              key={`principal-${entry.label}`}
              fill={entry.label === selectedLabel ? '#2BBDB4' : '#B2E4E2'}
            />
          ))}
        </Bar>

        <Bar
          dataKey="profit"
          stackId="a"
          maxBarSize={40}
          radius={[4, 4, 0, 0]}
          onClick={(_, index) => {
            const entry = chartData[index];
            if (entry) onSelect(entry.label);
          }}
          cursor="pointer"
        >
          {chartData.map((entry) => (
            <Cell
              key={`profit-${entry.label}`}
              fill={entry.label === selectedLabel ? '#F59E9E' : '#FBBFBF'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function TrustResultPage() {
  const [selectedLabel, setSelectedLabel] = useState('5천만');

  const selectedEntry = useMemo(() => {
    return (
      chartData.find((item) => item.label === selectedLabel) ?? chartData[2]
    );
  }, [selectedLabel]);

  const principal = selectedEntry.principal;
  const grossProfit = selectedEntry.profit;
  const tax = Math.round(grossProfit * 0.154);
  const finalAmount = principal + grossProfit - tax;
  const profitRate = (grossProfit / principal) * 100;

  const router = useRouter();
  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <Header
          title="내맘대로신탁"
          showCloseButton
          onClose={() => router.push('/asset/simulator' as Route)}
        />
        <main className="app-main no-scrollbar px-4 py-5">
          <div className="rounded-[24px] bg-linear-to-br from-hana-teal-600 to-hana-teal-300 px-6 py-7">
            <p className="text-[13px] font-medium leading-5 text-white/80">
              5년 후
            </p>
            <p className="mt-1 text-[28px] font-bold leading-[1.3] tracking-tight text-white">
              예상 자산 {formatMoneyFromManwon(finalAmount)}
            </p>
            <p className="mt-2 text-[14px] font-semibold leading-5">
              <span className="text-white">원금 대비 </span>
              <span className="text-hana-red-500">
                {formatPercent(profitRate)}
              </span>
            </p>
          </div>

          <div className="mt-4 rounded-4xl border border-[#E5E7EB] bg-white px-6 py-6">
            <p className="text-[16px] font-semibold leading-6 tracking-tight text-[#1F2937]">
              상세 내역
            </p>
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-5 font-normal text-[#6A7282]">
                  원금
                </span>
                <span className="text-[14px] leading-5 font-medium text-[#1F2937]">
                  {formatMoneyFromManwon(principal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-5 font-normal text-[#6A7282]">
                  예상 총 수익
                </span>
                <span className="text-[14px] leading-5 font-medium text-hana-ez-600">
                  +{formatMoneyFromManwon(grossProfit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-5 font-normal text-[#6A7282]">
                  세금 (15.4%)
                </span>
                <span className="text-[14px] leading-5 font-medium text-hana-red-500">
                  -{formatMoneyFromManwon(tax)}
                </span>
              </div>
            </div>
            <div className="my-5 h-px bg-[#F2F3F5]" />
            <div className="flex items-center justify-between">
              <span className="text-[14px] leading-5 font-semibold text-[#1F2937]">
                예상 실 수령액
              </span>
              <span className="text-[18px] leading-6 font-bold text-hana-ez-600">
                {formatMoneyFromManwon(finalAmount)}
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-4xl border border-[#E5E7EB] bg-white px-5 py-6">
            <p className="text-[15px] font-semibold leading-6 tracking-tight text-[#1F2937]">
              예치 금액별 수익 비교
            </p>

            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#B2E4E2]" />
                <span className="text-[11px] leading-4 font-normal text-[#6A7282]">
                  원금
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#FBBFBF]" />
                <span className="text-[11px] leading-4 font-normal text-[#6A7282]">
                  수익
                </span>
              </div>
            </div>

            <div className="mt-4 [&_*:focus]:outline-none [&_*:focus-visible]:outline-none">
              <ProfitBarChart
                selectedLabel={selectedLabel}
                onSelect={setSelectedLabel}
              />
            </div>

            <p className="mt-2 text-center text-[11px] leading-4 font-normal text-[#9CA3AF]">
              * 현재 선택: {selectedLabel}
            </p>
          </div>
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
