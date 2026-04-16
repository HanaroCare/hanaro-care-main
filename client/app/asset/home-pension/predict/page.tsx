'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import { ForecastChart } from '../../components/home-pension/ForecastChart';
import { ForecastLegend } from '../../components/home-pension/ForecastLegend';
import { ScenarioValueCard } from '../../components/home-pension/ScenarioValueCard';
import {
  aiDescriptionMap,
  aiPredictionLabel,
  fullForecastChartData,
  type PeriodKey,
  periodOptions,
  periodYearMap,
  type ScenarioKey,
  scenarioDescriptionMap,
  scenarioMeta,
} from '../../constants/constants';

function formatEok(value?: number) {
  if (typeof value !== 'number') return '-';
  return Number.isInteger(value) ? `${value}억` : `${value.toFixed(1)}억`;
}

export default function HomeValueForecastPage() {
  const router = useRouter();
  const [period, setPeriod] = useState<PeriodKey>('5');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('bull');

  const chartData = fullForecastChartData;

  const selectedPoint = useMemo(() => {
    const targetYear = periodYearMap[period];
    return chartData.find((item) => item.year === targetYear);
  }, [period, chartData]);

  const currentValues = useMemo(() => {
    return {
      bull: formatEok(selectedPoint?.bull),
      base: formatEok(selectedPoint?.base),
      bear: formatEok(selectedPoint?.bear),
    };
  }, [selectedPoint]);

  // ─── AI 기준 데이터 추출 ───
  const fixedAiScenario = aiPredictionLabel[period]; // 'bull' | 'base' | 'bear'
  const fixedAiSummary = aiDescriptionMap[period][fixedAiScenario];
  const aiMainValue = currentValues[fixedAiScenario];

  // ─── 추천 문구는 AI가 예측한 시나리오(fixedAiScenario)를 따라가야 함 ───
  const aiScenarioGuide = scenarioDescriptionMap[fixedAiScenario];

  // 사용자가 클릭해서 보고 있는 시나리오 설명 (중간 박스용)
  const selectedGuide = scenarioDescriptionMap[selectedScenario];

  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <Header title="집값 예측" showBackButton />

        <main className="app-main no-scrollbar px-5 pt-1 pb-6">
          <section>
            {/* 기간 선택 탭 */}
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
                          ? 'bg-hana-ez-600 text-white shadow-sm'
                          : 'bg-white text-[#6B7280]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI 예측 핵심 대시보드 */}
            <div className="mt-5 overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="px-6 py-5.5 text-center border-b border-[#F3F4F6]">
                <p className="text-[17px] font-semibold text-[#6B7280]">
                  AI가 예측하는 우리집 미래 가치는?
                </p>
                <div className="mt-1 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[40px] font-black tracking-tighter text-[#111827]">
                      {aiMainValue.replace('억', '')}
                    </span>
                    <span className="text-[22px] font-bold text-[#111827]">
                      억 원
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 차트 영역 */}
            <div className="mt-4">
              <ForecastChart data={chartData} />
              <div className="mt-2 border-t border-[#F3F4F6] pt-2">
                <ForecastLegend />
              </div>
            </div>

            {/* 시나리오 선택 섹션 */}
            <div className="mt-8">
              <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                {period}년 후 예상 시세
              </p>
              <div className="mt-3 flex gap-3">
                {(['bull', 'base', 'bear'] as ScenarioKey[]).map((key) => (
                  <ScenarioValueCard
                    key={key}
                    label={scenarioMeta[key].label}
                    value={currentValues[key]}
                    color={scenarioMeta[key].color}
                    bgColor={scenarioMeta[key].bgColor}
                    selected={selectedScenario === key}
                    onClick={() => setSelectedScenario(key)}
                    badge={fixedAiScenario === key ? 'AI 예상' : undefined}
                  />
                ))}
              </div>
            </div>

            {/* 시나리오 상세 설명 박스 (사용자가 클릭한 것 보여주기) */}
            <div
              className="mt-4 rounded-[18px] px-5 py-5 transition-all duration-300"
              style={{
                backgroundColor: scenarioMeta[selectedScenario].bgColor,
              }}
            >
              <p
                className="text-[15px] font-bold"
                style={{ color: scenarioMeta[selectedScenario].color }}
              >
                {selectedGuide.title}
              </p>
              <p
                className="mt-2 text-[13px] leading-5 font-medium whitespace-pre-wrap opacity-90"
                style={{ color: scenarioMeta[selectedScenario].color }}
              >
                {selectedGuide.desc}
              </p>
            </div>

            {/* AI 예측 근거 (고정 시나리오 기준) */}
            <div className="mt-8">
              <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                AI 예측 근거
              </p>
              <div className="mt-4 rounded-[20px] px-6 py-6 bg-[#F3F4F6] border border-[#E5E7EB]">
                <p className="text-[17px] leading-7 font-bold text-[#111827]">
                  {fixedAiSummary.title}
                </p>
                <p className="mt-3 text-[14px] leading-6 font-medium text-[#4B5563] opacity-90">
                  {fixedAiSummary.desc1}
                  <br />
                  {fixedAiSummary.desc2}
                </p>
              </div>
            </div>

            {/* ─── 하단 추천 박스: AI 예측 결과(fixedAiScenario)에 따라 고정 ─── */}
            <div className="mt-6 rounded-[20px] bg-[#FFF1F2] px-6 py-4 text-center border border-[#FECDD3]">
              <p className="text-[15px] leading-6 font-bold text-hana-red-500 whitespace-pre-wrap">
                {aiScenarioGuide.recommendation}
              </p>
            </div>
          </section>
        </main>

        <footer className="sticky bottom-0 shrink-0 bg-white/95 backdrop-blur-sm px-5 pb-8 pt-4 border-t border-[#F3F4F6]">
          <PrimaryButton
            label="최적화된 주택 연금 수령방식 보기"
            className="h-14 rounded-2xl text-[16px] leading-6 font-bold"
            onClick={() => router.push('/asset/home-pension/result')}
          />
        </footer>
      </div>
    </div>
  );
}
