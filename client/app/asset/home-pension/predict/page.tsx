'use client';

import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import PrimaryButton from '@/components/PrimaryButton';
import SubHeader from '@/components/SubHeader';
import { ForecastChart } from '../../components/home-pension/ForecastChart';
import { ForecastLegend } from '../../components/home-pension/ForecastLegend';
import { ScenarioValueCard } from '../../components/home-pension/ScenarioValueCard';
import {
  chartDataByPeriod,
  type PeriodKey,
  periodOptions,
  type ScenarioKey,
  scenarioMeta,
} from './constants';

function formatEok(value?: number) {
  if (typeof value !== 'number') return '-';
  return Number.isInteger(value) ? `${value}억` : `${value.toFixed(1)}억`;
}

export default function HomeValueForecastPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<PeriodKey>('5');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('bull');

  const chartData = useMemo(() => chartDataByPeriod[period], [period]);

  const currentValues = useMemo(() => {
    const last = chartData[chartData.length - 1];

    return {
      bull: formatEok(last?.bull),
      base: formatEok(last?.base),
      bear: formatEok(last?.bear),
    };
  }, [chartData]);

  const summaryText = useMemo(() => {
    if (selectedScenario === 'bull') {
      return {
        title: '낙관 (집값 상승)',
        desc1: `${period}년 후 매도 → 약 ${currentValues.bull} 예상돼요!`,
        desc2: `${period}년 후 매각을 추천해요!`,
      };
    }

    if (selectedScenario === 'base') {
      return {
        title: '중립 (현상 유지)',
        desc1: '안정 수입을 원하시면',
        desc2: '연금을 추천해요!',
      };
    }

    return {
      title: '비관 (집값 정체)',
      desc1: '매도보다 연금 총액이 더 많아요',
      desc2: '연금이 유리해요!',
    };
  }, [selectedScenario, period, currentValues]);

  const currentScenario = scenarioMeta[selectedScenario];

  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <SubHeader
          title="집값 예측"
          backUrl="/asset/home-pension/check-home"
          closeUrl="/asset"
        />
        <main className="app-main no-scrollbar px-5 pt-7 pb-6">
          <section>
            <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
              하나 AI 기반 예측
            </p>

            <div className="mt-4 rounded-[14px] border border-[#D8DCE3] p-1">
              <div className="grid grid-cols-3 gap-0">
                {periodOptions.map((item) => {
                  const active = period === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setPeriod(item.key)}
                      className={`h-10 rounded-[10px] text-[14px] leading-5 font-semibold transition ${
                        active
                          ? 'bg-hana-ez-600 text-white'
                          : 'bg-white text-[#6B7280]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6">
              <ForecastChart data={chartData} />
              <ForecastLegend />
            </div>

            {
              <div className="mt-5 rounded-[24px] bg-[#EAF8F7] px-6 py-6 text-center">
                <p className="text-[14px] leading-5 font-medium text-hana-ez-600">
                  {period}년 뒤 집값이
                </p>
                <p className="mt-2 text-[20px] leading-7 font-bold text-hana-ez-600">
                  8.8억~9.0억일 확률이
                </p>
                <p className="text-[20px] leading-7 font-bold text-hana-red-500">
                  가장 높아요!
                </p>
              </div>
            }

            <div className="mt-6">
              <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                {period}년 후 예상 시세
              </p>

              <div className="mt-3 flex gap-3">
                {(['bull', 'base', 'bear'] as ScenarioKey[]).map((key) => (
                  <ScenarioValueCard
                    key={key}
                    label={scenarioMeta[key].label}
                    share={scenarioMeta[key].share}
                    value={currentValues[key]}
                    color={scenarioMeta[key].color}
                    bgColor={scenarioMeta[key].bgColor}
                    selected={selectedScenario === key}
                    onClick={() => setSelectedScenario(key)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                AI 추천
              </p>

              <div className="mt-3">
                <div className="inline-flex items-center rounded-full bg-[#EFE7C8] px-3 py-1">
                  <span className="text-[11px] leading-4 font-medium text-[#8B7441]">
                    • 부정확할 수 있어요
                  </span>
                </div>
              </div>

              <div
                className="mt-4 rounded-[20px] px-5 py-5"
                style={{ backgroundColor: currentScenario.bgColor }}
              >
                <p
                  className="text-[18px] leading-7 font-bold tracking-tight"
                  style={{ color: currentScenario.color }}
                >
                  {summaryText.title}
                </p>

                <p
                  className="mt-3 text-[14px] leading-6 font-medium"
                  style={{ color: currentScenario.color }}
                >
                  {summaryText.desc1}
                  <br />
                  {summaryText.desc2}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[20px] border border-[#E5E7EB] bg-white px-5 py-5">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hana-ez-600 text-white">
                  <AlertCircle size={12} />
                </div>

                <div className="flex-1">
                  <p className="text-[13px] leading-5 font-medium text-[#4B5563]">
                    매각이랑 주택연금을 서로 비교해보고 싶나요?
                  </p>

                  <button
                    type="button"
                    className="mt-3 rounded-full bg-[#EAF8F7] px-4 py-2 text-[13px] leading-5 font-semibold text-hana-ez-600"
                    onClick={() => {
                      router.push('/asset/home-pension/compare');
                    }}
                  >
                    → 주택 매각 vs 연금 비교해보러 가기
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="shrink-0 bg-white px-5 pb-6 pt-3">
          <PrimaryButton
            label="주택 연금 시뮬레이션"
            className="h-14 rounded-2xl text-[16px] leading-6"
            onClick={() => {
              router.push('/asset/home-pension/result');
            }}
          />
        </footer>
      </div>
    </div>
  );
}
