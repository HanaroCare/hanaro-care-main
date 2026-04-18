'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  getPensionForecast,
  type PensionForecastResponse,
} from '@/app/asset/actions/pension';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import Header from '@/components/navigation/Header';
import { ForecastChart } from '../../components/home-pension/ForecastChart';
import { ForecastLegend } from '../../components/home-pension/ForecastLegend';
import { ScenarioValueCard } from '../../components/home-pension/ScenarioValueCard';
import {
  type PeriodKey,
  periodOptions,
  type ScenarioKey,
  scenarioDescriptionMap,
  scenarioMeta,
} from '../../constants/constants';

const PENSION_FORECAST_RESULT_KEY = 'pensionForecastResult';

const periodYearMap: Record<PeriodKey, number> = {
  '5': 5,
  '10': 10,
  '20': 20,
};

function formatEokFromWon(value?: number) {
  if (typeof value !== 'number') return '-';
  const eok = value / 100_000_000;
  return `${eok.toFixed(1)}억`;
}

function mapScenarioTypeToKey(type: string): ScenarioKey {
  if (type === 'UP') return 'bull';
  if (type === 'DOWN') return 'bear';
  return 'base';
}

type Props = {
  realAssetId: string;
};

export default function HomeValueForecastClient({ realAssetId }: Props) {
  const router = useRouter();

  const [period, setPeriod] = useState<PeriodKey>('5');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey>('bull');
  const [forecast, setForecast] = useState<PensionForecastResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem(PENSION_FORECAST_RESULT_KEY);

    if (!saved) {
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as PensionForecastResponse;
      if (parsed.realAssetId === realAssetId) {
        setForecast(parsed);
        setPeriod(String(parsed.periodYears) as PeriodKey);
        setSelectedScenario(mapScenarioTypeToKey(parsed.recommendedScenario));
      }
    } catch (error) {
      console.error('예측 결과 파싱 실패', error);
      setErrorMessage('예측 결과를 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  }, [realAssetId]);

  useEffect(() => {
    if (!realAssetId) {
      setIsLoading(false);
      setErrorMessage('잘못된 주택 정보예요.');
      return;
    }

    startTransition(async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const data = await getPensionForecast(
          realAssetId,
          periodYearMap[period],
        );
        setForecast(data);
        setSelectedScenario(mapScenarioTypeToKey(data.recommendedScenario));
        sessionStorage.setItem(
          PENSION_FORECAST_RESULT_KEY,
          JSON.stringify(data),
        );
      } catch (error) {
        console.error('집값 예측 조회 실패', error);
        setErrorMessage('집값 예측 정보를 불러오지 못했어요.');
      } finally {
        setIsLoading(false);
      }
    });
  }, [realAssetId, period]);

  const chartData = useMemo(() => {
    if (!forecast?.chartPoints) return [];

    return forecast.chartPoints.map((point) => ({
      year: point.year,
      bull: Number((point.upPrice / 100_000_000).toFixed(1)),
      base: Number((point.basePrice / 100_000_000).toFixed(1)),
      bear: Number((point.downPrice / 100_000_000).toFixed(1)),
    }));
  }, [forecast]);

  const scenarioMap = useMemo(() => {
    if (!forecast?.scenarios) {
      return {
        bull: null,
        base: null,
        bear: null,
      };
    }

    const result = {
      bull: null as null | PensionForecastResponse['scenarios'][number],
      base: null as null | PensionForecastResponse['scenarios'][number],
      bear: null as null | PensionForecastResponse['scenarios'][number],
    };

    forecast.scenarios.forEach((scenario) => {
      const key = mapScenarioTypeToKey(scenario.scenarioType);
      result[key] = scenario;
    });

    return result;
  }, [forecast]);

  const currentValues = useMemo(() => {
    return {
      bull: formatEokFromWon(scenarioMap.bull?.predictedPrice),
      base: formatEokFromWon(scenarioMap.base?.predictedPrice),
      bear: formatEokFromWon(scenarioMap.bear?.predictedPrice),
    };
  }, [scenarioMap]);

  const fixedAiScenario = useMemo<ScenarioKey>(() => {
    if (!forecast) return 'base';
    return mapScenarioTypeToKey(forecast.recommendedScenario);
  }, [forecast]);

  const aiMainValue = useMemo(() => {
    if (!forecast) return '-';

    const key = mapScenarioTypeToKey(forecast.recommendedScenario);

    const scenario = forecast.scenarios.find(
      (s) => mapScenarioTypeToKey(s.scenarioType) === key,
    );

    return formatEokFromWon(scenario?.predictedPrice);
  }, [forecast]);

  const aiScenarioGuide = scenarioDescriptionMap[fixedAiScenario];

  const selectedGuide = useMemo(() => {
    if (selectedScenario === 'bull') {
      return {
        title: '낙관 시나리오',
        desc: '입지와 수요, 시장 분위기가 긍정적으로 작용해 상대적으로 높은 상승 흐름을 보이는 경우예요.',
      };
    }

    if (selectedScenario === 'bear') {
      return {
        title: '비관 시나리오',
        desc: '시장 둔화나 거래 위축이 반영되어 상승폭이 제한되거나 현재 수준에 가깝게 유지되는 경우예요.',
      };
    }

    return {
      title: '중립 시나리오',
      desc: '현재 시장 흐름과 지역 특성을 반영했을 때 가장 안정적으로 참고할 수 있는 기준 시나리오예요.',
    };
  }, [selectedScenario]);

  if (isLoading && !forecast) {
    return (
      <div className="app-shell bg-white">
        <div className="app-layout bg-white">
          <Header title="집값 예측" showBackButton />
          <main className="app-main px-5 pt-6">
            <p className="text-[14px] text-[#9CA3AF]">불러오는 중...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!forecast) {
    return (
      <div className="app-shell bg-white">
        <div className="app-layout bg-white">
          <Header title="집값 예측" showBackButton />
          <main className="app-main px-5 pt-6">
            <p className="text-[14px] text-[#EF4444]">
              {errorMessage ?? '예측 결과가 없어요.'}
            </p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <Header title="집값 예측" showBackButton />

        <main className="app-main no-scrollbar px-5 pt-1 pb-6">
          <section>
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
                      {item.label} 후
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[28px] border border-[#E5E7EB] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="border-b border-[#F3F4F6] px-6 py-5.5 text-center">
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

            <div className="mt-4">
              <ForecastChart data={chartData} />
              <div className="mt-2 border-t border-[#F3F4F6] pt-2">
                <ForecastLegend />
              </div>
            </div>

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
                className="mt-2 whitespace-pre-wrap text-[13px] leading-5 font-medium opacity-90"
                style={{ color: scenarioMeta[selectedScenario].color }}
              >
                {selectedGuide.desc}
              </p>
            </div>

            <div className="mt-8">
              <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                AI 예측 근거
              </p>
              <div className="mt-4 rounded-[20px] border border-[#E5E7EB] bg-[#F3F4F6] px-6 py-6">
                <p className="text-[17px] leading-7 font-bold text-[#111827]">
                  {forecast.assetNm} · {forecast.periodYears}년 기준 분석
                </p>
                <p className="mt-3 text-[14px] leading-6 font-medium text-[#4B5563] opacity-90">
                  {forecast.marketSummary}
                  <br />
                  {forecast.locationSummary}
                </p>
                {forecast.recommendedReason && (
                  <>
                    <div className="my-4 border-t border-[#E5E7EB]" />
                    <p className="text-[14px] font-semibold text-[#374151]">
                      AI 추천 이유
                    </p>
                    <p className="mt-2 text-[14px] leading-6 font-medium text-[#4B5563] opacity-90">
                      {forecast.recommendedReason}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-[20px] border border-[#FECDD3] bg-[#FFF1F2] px-6 py-4 text-center">
              <p className="whitespace-pre-wrap text-[15px] leading-6 font-bold text-hana-red-500">
                {aiScenarioGuide.recommendation}
              </p>
            </div>

            {errorMessage && (
              <p className="mt-4 text-center text-[13px] text-[#EF4444]">
                {errorMessage}
              </p>
            )}
          </section>
        </main>

        <footer className="sticky bottom-0 shrink-0 border-t border-[#F3F4F6] bg-white/95 px-5 pt-4 pb-8 backdrop-blur-sm">
          <PrimaryButton
            label={
              isPending ? '불러오는 중...' : '최적화된 주택 연금 수령방식 보기'
            }
            className="h-14 rounded-2xl text-[16px] leading-6 font-bold"
            onClick={() =>
              router.push(`/asset/home-pension/result?id=${realAssetId}`)
            }
            disabled={isPending}
          />
        </footer>
      </div>
    </div>
  );
}
