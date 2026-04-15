'use client';

import { motion } from 'framer-motion';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
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
      <div className="h-55 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 40, right: 20, left: 20, bottom: 0 }}
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
              interval={0}
              padding={{ left: 20, right: 20 }}
            />

            <Line
              type="monotone"
              dataKey="expense"
              stroke="var(--color-hana-red-500)"
              strokeWidth={3}
              dot={{ r: 5, fill: 'var(--color-hana-red-500)', strokeWidth: 0 }}
              activeDot={{ r: 7, fill: 'var(--color-hana-red-500)' }}
            >
              <LabelList
                dataKey="expense"
                position="top"
                offset={12}
                formatter={(v: any) => `${v}만원`}
                style={{ fontSize: 12, fontWeight: 500, fill: 'var(--color-hana-red-500)' }}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-center font-medium text-[13px] text-hana-black-500">
        구간별 월 지출 추이 (만원)
      </p>
    </motion.div>
  );
}
