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
  const isLarge = data.length >= 6;
  const bottomMargin = isLarge ? 30 : 0;

  const renderExpenseLabel = (props: any) => {
    const { x, y, value, index } = props;
    if (isLarge && index % 2 !== 0) return null;
    return (
      <text
        x={x}
        y={y - 12}
        textAnchor="middle"
        fontSize={12}
        fontWeight={500}
        fill="var(--color-hana-red-500)"
      >
        {`${value}만원`}
      </text>
    );
  };

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
            margin={{ top: 40, right: 20, left: 20, bottom: bottomMargin }}
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
              tick={
                isLarge
                  ? { fontSize: 11, fill: 'var(--color-hana-black-500)', textAnchor: 'end' }
                  : { fontSize: 12, fill: 'var(--color-hana-black-500)' }
              }
              angle={isLarge ? -35 : 0}
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
              <LabelList dataKey="expense" content={renderExpenseLabel} />
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
