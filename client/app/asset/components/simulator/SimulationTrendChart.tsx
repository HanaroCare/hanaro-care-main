'use client';

import { motion } from 'framer-motion';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

type TrendData = {
  age: string;
  expense: number;
};

const MOCK_TREND_DATA: TrendData[] = [
  { age: '65세', expense: 98 },
  { age: '67.5세', expense: 102 },
  { age: '70세', expense: 110 },
  { age: '72.5세', expense: 130 },
  { age: '75세', expense: 155 },
  { age: '77.5세', expense: 170 },
  { age: '80세', expense: 185 },
  { age: '82.5세', expense: 195 },
  { age: '85세', expense: 205 },
];

export function SimulationTrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full rounded-[24px] border border-hana-silver-100 bg-white px-5 py-7 shadow-sm"
    >
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={MOCK_TREND_DATA}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-hana-silver-100)"
            />
            <XAxis
              dataKey="age"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-hana-black-500)' }}
              interval={1}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-hana-black-500)' }}
              domain={[0, 200]}
              ticks={[0, 50, 100, 150, 200]}
            />

            <ReferenceArea
              x1="70세"
              x2="75세"
              fill="var(--color-hana-red-50)"
              fillOpacity={0.6}
              stroke="none"
            />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="var(--color-hana-red-500)"
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--color-hana-red-500)', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: 'var(--color-hana-red-500)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-center font-medium text-[13px] text-hana-black-500">
        구간별 월 지출 추이 (만원)
      </p>
    </motion.div>
  );
}
