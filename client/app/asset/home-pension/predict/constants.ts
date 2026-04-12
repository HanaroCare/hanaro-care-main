export type PeriodKey = '5' | '10' | '20';
export type ScenarioKey = 'bull' | 'base' | 'bear';

export type DataPoint = {
  year: string;
  past?: number;
  bull?: number;
  base?: number;
  bear?: number;
};

export const periodOptions: { key: PeriodKey; label: string }[] = [
  { key: '5', label: '5년' },
  { key: '10', label: '10년' },
  { key: '20', label: '20년' },
];

export const scenarioMeta: Record<
  ScenarioKey,
  {
    label: string;
    share: string;
    value: string;
    color: string;
    bgColor: string;
  }
> = {
  bull: {
    label: '낙관',
    share: '50%',
    value: '9.7억',
    color: '#00C4CC',
    bgColor: '#EAF8F7',
  },
  base: {
    label: '중립',
    share: '30%',
    value: '8.8억',
    color: '#008C95',
    bgColor: '#EAF8F7',
  },
  bear: {
    label: '비관',
    share: '20%',
    value: '8억',
    color: '#064E3B',
    bgColor: '#EAF8F7',
  },
};

export const chartDataByPeriod: Record<PeriodKey, DataPoint[]> = {
  '5': [
    { year: '2020', past: 6.0 },
    { year: '2022', past: 6.7 },
    { year: '2024', past: 7.3 },
    { year: '2026', past: 8.0, bull: 8.0, base: 8.0, bear: 8.0 },
    { year: '2028', bull: 8.4, base: 8.2, bear: 8.0 },
    { year: '2030', bull: 8.9, base: 8.5, bear: 8.0 },
    { year: '2032', bull: 9.5, base: 8.7, bear: 8.0 },
    { year: '2034', bull: 10.5, base: 9.1, bear: 8.0 },
    { year: '2035', bull: 9.7, base: 8.8, bear: 8.0 },
  ],
  '10': [
    { year: '2020', past: 6.0 },
    { year: '2022', past: 6.7 },
    { year: '2024', past: 7.3 },
    { year: '2026', past: 8.0, bull: 8.0, base: 8.0, bear: 8.0 },
    { year: '2028', bull: 8.5, base: 8.2, bear: 8.0 },
    { year: '2030', bull: 9.1, base: 8.5, bear: 8.0 },
    { year: '2032', bull: 9.7, base: 8.8, bear: 8.0 },
    { year: '2034', bull: 10.4, base: 9.2, bear: 8.0 },
    { year: '2036', bull: 11.0, base: 9.5, bear: 8.0 },
    { year: '2038', bull: 11.7, base: 9.8, bear: 8.0 },
  ],
  '20': [
    { year: '2020', past: 6.0 },
    { year: '2022', past: 6.7 },
    { year: '2024', past: 7.3 },
    { year: '2026', past: 8.0, bull: 8.0, base: 8.0, bear: 8.0 },
    { year: '2030', bull: 9.2, base: 8.5, bear: 8.0 },
    { year: '2034', bull: 10.6, base: 9.1, bear: 8.0 },
    { year: '2038', bull: 12.0, base: 9.8, bear: 8.0 },
    { year: '2042', bull: 13.1, base: 10.4, bear: 8.0 },
    { year: '2046', bull: 14.2, base: 11.0, bear: 8.0 },
  ],
};
