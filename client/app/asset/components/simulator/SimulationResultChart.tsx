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
  const chartData = data.map((d) => ({
    age: d.age,
    income: d.income,
    expense: d.expense,
    incomeLabel: `${d.income}만`,
    expenseLabel: `${d.expense}만`,
  }));

  if (chartData.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-[180px] w-full items-center justify-center rounded-[24px] border border-hana-silver-100 bg-white shadow-sm"
      >
        <p className="text-[14px] text-hana-black-500">표시할 데이터가 없습니다.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full rounded-[24px] bg-white px-5 py-6 shadow-sm"
    >
      <div className="mb-6 flex items-center justify-end gap-4 px-2">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-hana-red-500" />
          <span className="font-semibold text-[13px] text-hana-black-500">지출</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-hana-green-700" />
          <span className="font-semibold text-[13px] text-hana-black-500">수입</span>
        </div>
      </div>

      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 28, right: 8, left: 8, bottom: 20 }}
            barCategoryGap="30%"
            barGap={4}
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
              tick={{ fontSize: 11, fill: 'var(--color-hana-black-500)', fontFamily: 'Pretendard' }}
            />
            <YAxis hide domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.25)]} />

            <Bar dataKey="income" fill="var(--color-hana-green-700)" fillOpacity={0.3} barSize={16} radius={[3, 3, 0, 0]}>
              <LabelList
                dataKey="incomeLabel"
                position="top"
                style={{ fontSize: '11px', fontWeight: 600, fill: 'var(--color-hana-green-700)', fontFamily: 'Pretendard' }}
              />
            </Bar>

            <Bar dataKey="expense" fill="var(--color-hana-red-500)" fillOpacity={0.3} barSize={16} radius={[3, 3, 0, 0]}>
              <LabelList
                dataKey="expenseLabel"
                position="top"
                style={{ fontSize: '11px', fontWeight: 600, fill: 'var(--color-hana-red-500)', fontFamily: 'Pretendard' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
