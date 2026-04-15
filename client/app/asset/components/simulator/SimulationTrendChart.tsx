'use client';

import { motion } from 'framer-motion';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

type TrendData = {
  age: string;
  expense: number;
};

type SimulationTrendChartProps = {
  data: TrendData[];
};

export function SimulationTrendChart({ data }: SimulationTrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full rounded-[24px] border border-hana-silver-100 bg-white px-5 py-7 shadow-sm"
    >
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
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
              domain={[0, 250]}
              ticks={[0, 50, 100, 150, 200, 250]}
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
