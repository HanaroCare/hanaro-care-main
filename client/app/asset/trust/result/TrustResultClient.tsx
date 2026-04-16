'use client';
import { toPng } from 'html-to-image';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  AmountResultDto,
  SimulationDetailDto,
} from '@/app/asset/actions/trust';
import DualActionFooter from '@/components/modules/DualActionFooter';
import Header from '@/components/navigation/Header';
import { handleReservation } from '../../constants/trustUtils';

function formatWon(amount: number): string {
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);

  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man.toLocaleString()}만원`;
}

function formatPercent(value: number) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

function formatYTick(value: number): string {
  if (value === 0) return '0';
  const eok = value / 100_000_000;
  return `${eok.toFixed(1)}억`;
}

function ProfitBarChart({
  amountResults,
  selectedLabel,
  onSelect,
}: {
  amountResults: AmountResultDto[];
  selectedLabel: string;
  onSelect: (label: string) => void;
}) {
  const maxTotal =
    amountResults.length > 0
      ? Math.max(
          ...amountResults.map((e) => e.principalAmount + e.expectedProfit),
        )
      : 0;
  const yMax =
    maxTotal > 0
      ? Math.ceil(maxTotal / 100_000_000) * 100_000_000
      : 100_000_000;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={amountResults}
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
          tickFormatter={formatYTick}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fill: '#9CA3AF' }}
          width={38}
          domain={[0, yMax]}
        />

        <Bar
          dataKey="principalAmount"
          stackId="a"
          maxBarSize={40}
          radius={[0, 0, 4, 4]}
          onClick={(_, index) => {
            const entry = amountResults[index];
            if (entry) onSelect(entry.label);
          }}
          cursor="pointer"
        >
          {amountResults.map((entry) => (
            <Cell
              key={`principal-${entry.label}`}
              fill={entry.label === selectedLabel ? '#2BBDB4' : '#B2E4E2'}
            />
          ))}
        </Bar>

        <Bar
          dataKey="expectedProfit"
          stackId="a"
          maxBarSize={40}
          radius={[4, 4, 0, 0]}
          onClick={(_, index) => {
            const entry = amountResults[index];
            if (entry) onSelect(entry.label);
          }}
          cursor="pointer"
        >
          {amountResults.map((entry) => (
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

type Props = {
  selectedDetail: SimulationDetailDto;
  amountResults: AmountResultDto[];
};

export default function TrustResultClient({
  selectedDetail,
  amountResults,
}: Props) {
  const router = useRouter();

  // 기본값은 차트 막대 선택 없음 = 내 설계 기준
  const [selectedLabel, setSelectedLabel] = useState('');
  const [isCustomView, setIsCustomView] = useState(false);

  const currentEntry =
    isCustomView && selectedLabel
      ? (amountResults.find((e) => e.label === selectedLabel) ?? null)
      : null;

  const detail: SimulationDetailDto = currentEntry
    ? {
        principalAmount: currentEntry.principalAmount,
        expectedProfit: currentEntry.expectedProfit,
        tax: currentEntry.tax,
        expectedNetAmount: currentEntry.expectedNetAmount,
        profitRate: currentEntry.profitRate,
      }
    : selectedDetail;

  const handleSelectBar = (label: string) => {
    setSelectedLabel(label);
    setIsCustomView(true);
  };

  const handleResetToMyPlan = () => {
    setSelectedLabel('');
    setIsCustomView(false);
  };

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
      link.download = `trust-result-${Date.now()}.png`;
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
          title="맞춤형 신탁 설계 결과"
          showCloseButton
          onClose={() => router.push('/asset/simulator' as Route)}
        />

        <main
          ref={captureRef}
          className="app-main no-scrollbar px-4 py-5 bg-white"
        >
          <div className="rounded-[24px] bg-linear-to-br from-hana-teal-600 to-hana-teal-300 px-6 py-7">
            <p className="text-[13px] leading-5 font-medium text-white/80">
              5년 후
            </p>

            <p className="mt-1 text-[28px] leading-[1.3] font-bold tracking-tight text-white">
              예상 자산 {formatWon(detail.expectedNetAmount)}
            </p>

            <p className="mt-2 text-[14px] leading-5 font-semibold">
              <span className="text-white">원금 대비 </span>
              <span className="text-hana-red-500">
                {formatPercent(detail.profitRate)}
              </span>
            </p>
          </div>

          <div className="mt-4 rounded-4xl border border-[#E5E7EB] bg-white px-6 py-6">
            <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
              상세 내역
            </p>

            <div className="mt-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-5 font-normal text-[#6A7282]">
                  원금
                </span>
                <span className="text-[14px] leading-5 font-medium text-[#1F2937]">
                  {formatWon(detail.principalAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-5 font-normal text-[#6A7282]">
                  예상 총 수익
                </span>
                <span className="text-[14px] leading-5 font-medium text-hana-ez-600">
                  +{formatWon(detail.expectedProfit)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[14px] leading-5 font-normal text-[#6A7282]">
                  세금 (15.4%)
                </span>
                <span className="text-[14px] leading-5 font-medium text-hana-red-500">
                  -{formatWon(detail.tax)}
                </span>
              </div>
            </div>

            <div className="my-5 h-px bg-[#F2F3F5]" />

            <div className="flex items-center justify-between">
              <span className="text-[14px] leading-5 font-semibold text-[#1F2937]">
                예상 실 수령액
              </span>
              <span className="text-[18px] leading-6 font-bold text-hana-ez-600">
                {formatWon(detail.expectedNetAmount)}
              </span>
            </div>
          </div>

          <div className="mt-4 rounded-4xl border border-[#E5E7EB] bg-white px-5 py-6">
            <p className="text-[15px] leading-6 font-semibold tracking-tight text-[#1F2937]">
              다른 투자 금액별 예상 수익
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
                amountResults={amountResults}
                selectedLabel={selectedLabel}
                onSelect={handleSelectBar}
              />
            </div>

            <p className="mt-2 text-center text-[11px] leading-4 font-normal text-[#9CA3AF]">
              {isCustomView
                ? `* 현재 비교: ${selectedLabel}`
                : '* 현재 선택: 내 설계 기준'}
            </p>

            {isCustomView && (
              <button
                type="button"
                onClick={handleResetToMyPlan}
                className="mt-4 w-full rounded-2xl border border-hana-ez-600 py-3 text-[14px] font-semibold text-hana-ez-600 transition active:bg-[#F5FFFE]"
              >
                내 설계 기준으로 돌아가기
              </button>
            )}
          </div>
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
