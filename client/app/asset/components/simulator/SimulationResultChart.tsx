'use client';

import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
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

const TICK_STYLE = { fontSize: 12, fill: '#9CA3AF', fontWeight: 400 } as const;

export function SimulationResultChart({ data }: SimulationResultChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full rounded-[20px] border border-border-gray bg-white p-[21px] shadow-[0_2px_2px_rgba(0,0,0,0.25)]"
    >
      <div className="mb-6 flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-hana-red-500" />
          <span className="font-medium text-[#364153] text-[12px]">지출</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-hana-green-700" />
          <span className="font-medium text-[#364153] text-[12px]">수입</span>
        </div>
      </div>

      <div className="h-55 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
            barGap={8}
          >
            <XAxis
              dataKey="age"
              axisLine={false}
              tickLine={false}
              tick={TICK_STYLE}
              dy={10}
            />
            <YAxis hide domain={[0, 'dataMax + 40']} />
            <Bar
              dataKey="income"
              fill="#008485"
              radius={[2, 2, 0, 0]}
              barSize={17}
              fillOpacity={0.5}
            >
              <LabelList
                dataKey="income"
                position="top"
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  fill: '#008485',
                  fontFamily: 'Pretendard',
                }}
                offset={8}
              />
            </Bar>
            <Bar
              dataKey="expense"
              fill="#F04452"
              radius={[2, 2, 0, 0]}
              barSize={17}
              fillOpacity={0.5}
            >
              <LabelList
                dataKey="expense"
                position="top"
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  fill: '#F04452',
                  fontFamily: 'Pretendard',
                }}
                offset={8}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
