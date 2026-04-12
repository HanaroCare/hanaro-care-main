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
      className="w-full rounded-[24px] border border-[#F3F4F6] bg-white px-[20px] py-[28px] shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
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
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="age"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              interval={1}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              domain={[0, 200]}
              ticks={[0, 50, 100, 150, 200]}
            />
            <ReferenceArea
              x1="70세"
              x2="75세"
              fill="#FEE2E2"
              fillOpacity={0.3}
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="#E94E5A"
              strokeWidth={3}
              dot={{ r: 4, fill: '#E94E5A', strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#E94E5A' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-center font-medium text-[#6B7280] text-[13px]">
        구간별 월 지출 추이 (만원)
      </p>
    </motion.div>
  );
}
