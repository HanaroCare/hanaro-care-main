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
    expense: d.expense,
    remaining: Math.max(0, d.income - d.expense),
    incomeLabel: d.income,
    expenseLabel: d.expense,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full rounded-[24px] bg-white px-[20px] py-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#F3F4F6]"
    >
      <div className="mb-[40px] flex items-center justify-end gap-4 px-2">
        <div className="flex items-center gap-1.5">
          <div className="h-[12px] w-[12px] rounded-full bg-[#E94E5A]" />
          <span className="font-semibold text-[#4B5563] text-[13px]">지출</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-[12px] w-[12px] rounded-full bg-[#138586]" />
          <span className="font-semibold text-[#4B5563] text-[13px]">수입</span>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 30, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="age" hide={true} />
            <YAxis hide domain={[0, 'dataMax + 20']} />
            <Bar
              dataKey="expense"
              stackId="a"
              fill="#C28287"
              barSize={18}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="remaining"
              stackId="a"
              fill="#76C1BE"
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
                  fill: '#138586',
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
                  fill: '#E94E5A',
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
