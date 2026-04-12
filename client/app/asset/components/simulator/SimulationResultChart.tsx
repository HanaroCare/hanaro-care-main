'use client';

import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

type SimulationData = {
  age: string;
  income: number;
  expense: number;
};

type SimulationResultChartProps = {
  data: SimulationData[];
};

export function SimulationResultChart({ data }: SimulationResultChartProps) {
  // 데이터 가공 로직
  const chartData = data.map((d) => ({
    age: d.age,
    expense: d.expense,
    remaining: Math.max(0, d.income - d.expense),
    incomeLabel: d.income,
    expenseLabel: d.expense,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full rounded-[24px] border border-hana-silver-100 bg-white px-5 py-6 shadow-sm"
    >
      <div className="mb-10 flex items-center justify-end gap-4 px-2">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-hana-red-500" />
          <span className="font-semibold text-[13px] text-hana-black-500">
            지출
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-hana-green-700" />
          <span className="font-semibold text-[13px] text-hana-black-500">
            수입
          </span>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 30, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--color-hana-silver-100)"
            />
            <XAxis dataKey="age" hide />
            <YAxis hide domain={[0, 'dataMax + 20']} />

            <Bar
              dataKey="expense"
              stackId="a"
              fill="var(--color-hana-red-200)"
              barSize={18}
            />

            <Bar
              dataKey="remaining"
              stackId="a"
              fill="var(--color-hana-green-200)"
              barSize={18}
              radius={[2, 2, 0, 0]}
            >
              <LabelList
                dataKey="incomeLabel"
                position="top"
                offset={16}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  fill: 'var(--color-hana-green-700)',
                  fontFamily: 'Pretendard',
                }}
              />
              <LabelList
                dataKey="expenseLabel"
                position="top"
                offset={2}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  fill: 'var(--color-hana-red-500)',
                  fontFamily: 'Pretendard',
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
