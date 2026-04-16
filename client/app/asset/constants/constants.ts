export type DataPoint = {
  year: number | string;
  bull?: number;
  base?: number;
  bear?: number;
  past?: number;
  fixed?: number;
  boosted?: number;
  growing?: number;
};

export type PeriodKey = '5' | '10' | '20';
export type ScenarioKey = 'bull' | 'base' | 'bear';

export const periodOptions = [
  { key: '5', label: '5년' },
  { key: '10', label: '10년' },
  { key: '20', label: '20년' },
] as const;

export const fullForecastChartData: DataPoint[] = [
  { year: 2020, bull: 6.0, base: 6.0, bear: 6.0, past: 6.0 },
  { year: 2021, bull: 6.4, base: 6.4, bear: 6.4, past: 6.4 },
  { year: 2022, bull: 6.9, base: 6.9, bear: 6.9, past: 6.9 },
  { year: 2023, bull: 7.3, base: 7.3, bear: 7.3, past: 7.3 },
  { year: 2024, bull: 8.0, base: 8.0, bear: 8.0, past: 8.0 },
  { year: 2025, bull: 8.3, base: 8.2, bear: 8.0 },
  { year: 2026, bull: 8.7, base: 8.4, bear: 8.0 },
  { year: 2027, bull: 9.0, base: 8.6, bear: 8.0 },
  { year: 2028, bull: 9.5, base: 8.7, bear: 8.0 },
  { year: 2029, bull: 9.8, base: 8.8, bear: 8.0 },
  { year: 2030, bull: 10.2, base: 9.0, bear: 8.0 },
  { year: 2031, bull: 10.6, base: 9.2, bear: 8.0 },
  { year: 2032, bull: 10.9, base: 9.4, bear: 8.0 },
  { year: 2033, bull: 11.3, base: 9.6, bear: 8.0 },
  { year: 2034, bull: 11.8, base: 9.8, bear: 8.0 },
  { year: 2035, bull: 12.1, base: 10.0, bear: 8.0 },
  { year: 2036, bull: 12.5, base: 10.2, bear: 8.0 },
  { year: 2037, bull: 12.9, base: 10.4, bear: 8.0 },
  { year: 2038, bull: 13.3, base: 10.6, bear: 8.0 },
  { year: 2039, bull: 13.6, base: 10.8, bear: 8.0 },
  { year: 2040, bull: 14.0, base: 11.0, bear: 8.0 },
  { year: 2041, bull: 14.4, base: 11.2, bear: 8.0 },
  { year: 2042, bull: 14.8, base: 11.4, bear: 8.0 },
  { year: 2043, bull: 15.2, base: 11.6, bear: 8.0 },
  { year: 2044, bull: 15.6, base: 11.8, bear: 8.0 },
];

export const periodYearMap: Record<PeriodKey, number> = {
  '5': 2029,
  '10': 2034,
  '20': 2044,
};

export const scenarioMeta: Record<
  ScenarioKey,
  { label: string; color: string; bgColor: string }
> = {
  bull: { label: '낙관', color: '#00D0CB', bgColor: '#EAF8F7' },
  base: { label: '중립', color: '#00A8A6', bgColor: '#EAF8F7' },
  bear: { label: '비관', color: '#0A5657', bgColor: '#EAF8F7' },
};

export const scenarioDescriptionMap: Record<
  ScenarioKey,
  { title: string; desc: string; recommendation: string }
> = {
  bull: {
    title: '낙관 (집값 상승)',
    desc: '부동산 시장의 활성화와 주변 개발 호재로 인해 상승세가 예상됩니다.',
    recommendation:
      '자산 가치가 높게 평가될 때 가입하여\n높은 월 수령액을 확정하세요',
  },
  base: {
    title: '중립 (현상 유지)',
    desc: '시장 분위기가 차분해지면서 안정적인 흐름이 예상됩니다.',
    recommendation:
      '안정적인 자산 유지가 예상되므로,\n가입을 통해 높은 수령 금액을 확보하는 것이\n유리합니다.',
  },
  bear: {
    title: '비관 (집값 정체)',
    desc: '금리 상황과 대외 변수로 인해 보합세가 이어질 수 있습니다.',
    recommendation:
      '집값 하락 시에도 연금액은 줄어들지 않으므로,\n지금 바로 자산 가치를 보존하세요',
  },
};

export const summaryCardMap: Record<
  PeriodKey,
  { line1: string; line2: string; highlight: string }
> = {
  '5': {
    line1: '5년 뒤 집값이',
    line2: '8.8억~9.0억일 확률이',
    highlight: '가장 높아요!',
  },
  '10': {
    line1: '10년 뒤 집값이',
    line2: '9.8억~10.2억일 확률이',
    highlight: '가장 높아요!',
  },
  '20': {
    line1: '20년 뒤 집값이',
    line2: '11.6억~12.0억일 확률이',
    highlight: '가장 높아요!',
  },
};

export const aiPredictionLabel: Record<PeriodKey, ScenarioKey> = {
  '5': 'base',
  '10': 'base',
  '20': 'base',
};

export const aiDescriptionMap: Record<
  PeriodKey,
  Record<ScenarioKey, { title: string; desc1: string; desc2: string }>
> = {
  '5': {
    bull: {
      title: '낙관 시나리오 · 예상 확률: 20%',
      desc1: '최근 흐름보다 상승 폭이 큰 경우를 가정한 결과예요.',
      desc2: '매도 가능성을 참고용으로 함께 살펴보세요.',
    },
    base: {
      title: '중립 시나리오 · 예상 확률: 50%',
      desc1: '현재와 비슷한 흐름이 이어질 가능성이 가장 높아요.',
      desc2: '주택연금 설계값을 함께 비교해보는 것이 좋아요.',
    },
    bear: {
      title: '비관 시나리오 · 예상 확률: 30%',
      desc1: '상승이 크지 않거나 정체되는 흐름을 가정한 결과예요.',
      desc2: '주택연금처럼 안정적인 선택지를 같이 볼 수 있어요.',
    },
  },
  '10': {
    bull: {
      title: '낙관 (집값 상승) · 예상 확률: 25%',
      desc1: '장기적으로 상승 여력이 커지는 경우를 반영했어요.',
      desc2: '매도 시점 비교와 함께 보는 것이 좋아요.',
    },
    base: {
      title: '중립 (현상 유지) · 예상 확률: 45%',
      desc1: '완만한 상승 흐름이 이어질 가능성이 높아요.',
      desc2: '주택연금과 매도 비교를 함께 참고해보세요.',
    },
    bear: {
      title: '비관 (집값 정체) · 예상 확률: 30%',
      desc1: '장기적으로 시장이 둔화되는 경우를 가정한 결과예요.',
      desc2: '안정적인 현금 흐름 확보 관점에서 해석할 수 있어요.',
    },
  },
  '20': {
    bull: {
      title: '낙관 (집값 상승) · 예상 확률: 30%',
      desc1: '장기 상승이 이어질 경우의 예측 결과예요.',
      desc2: '자산 가치 관점에서 참고할 수 있어요.',
    },
    base: {
      title: '중립 (현상 유지) · 예상 확률: 40%',
      desc1: '장기적으로 완만한 상승이 이어질 가능성이 높아요.',
      desc2: '현재 기준 가장 무난한 흐름으로 볼 수 있어요.',
    },
    bear: {
      title: '비관 (집값 정체) · 예상 확률: 30%',
      desc1: '장기적으로 정체 또는 하락 가능성을 함께 반영했어요.',
      desc2: '시장 변동 리스크를 고려한 참고 시나리오예요.',
    },
  },
};

export type PensionType = 'fixed' | 'boosted' | 'growing';

export const pensionPeriodAmounts: Record<
  PensionType,
  { year10: string; year20: string; year30: string }
> = {
  fixed: { year10: '300만원', year20: '300만원', year30: '300만원' },
  boosted: { year10: '450만원', year20: '320만원', year30: '240만원' },
  growing: { year10: '240만원', year20: '360만원', year30: '550만원' },
};

// 하단에 중복 선언되어 있던 pensionOptions 하나로 통일
export const pensionOptions = [
  {
    key: 'fixed' as const,
    label: '정액형',
    color: '#0B666A',
    infoTitle: '정액형이란?',
    infoDesc: '고정된 금액을 평생 수령하는 방식이에요',
    recommendTitle: '권하나님의 추천 주택 연금 수령 방식은',
    recommendHighlight: '정액형',
  },
  {
    key: 'boosted' as const,
    label: '초기증액형',
    color: '#1098A0',
    infoTitle: '초기증액형이란?',
    infoDesc: '초기 몇 년간 더 많이 받고 이후에는 줄어드는 방식이에요',
    recommendTitle: '권하나님의 추천 주택 연금 수령 방식은',
    recommendHighlight: '초기증액형',
  },
  {
    key: 'growing' as const,
    label: '정기증가형',
    color: '#13C2C9',
    infoTitle: '정기증가형이란?',
    infoDesc: '시간이 지날수록 월 수령액이 점차 증가하는 방식이에요',
    recommendTitle: '권하나님의 추천 주택 연금 수령 방식은',
    recommendHighlight: '정기증가형',
  },
];

export const chartData: DataPoint[] = [
  { year: '1년', fixed: 100, boosted: 800, growing: 100 },
  { year: '4년', fixed: 1000, boosted: 1300, growing: 700 },
  { year: '7년', fixed: 1900, boosted: 1800, growing: 1300 },
  { year: '10년', fixed: 2800, boosted: 2300, growing: 1900 },
  { year: '13년', fixed: 3600, boosted: 2800, growing: 2500 },
  { year: '16년', fixed: 4400, boosted: 3300, growing: 3100 },
  { year: '19년', fixed: 5100, boosted: 3900, growing: 3800 },
];
