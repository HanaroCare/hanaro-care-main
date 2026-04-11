'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

type ChartDataItem = {
  month: string;
  value: number;
};

const CHART_DATA: ChartDataItem[] = [
  { month: '7월', value: 11.8 },
  { month: '8월', value: 12.1 },
  { month: '9월', value: 11.5 },
  { month: '10월', value: 12.3 },
  { month: '11월', value: 12.6 },
  { month: '12월', value: 12.8 },
];

const TICK_STYLE = { fontSize: 11, fill: '#888988' } as const;

export function AssetChangeChart() {
  return (
    <div className="w-81.25 rounded-3xl border border-border-gray bg-white p-5 shadow-sm">
      <h3 className="mb-6 font-semibold text-[14px] text-hana-black-900">
        6개월 자산 변화
      </h3>

      <div className="h-45 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={CHART_DATA}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
            barSize={30}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E5E5"
              opacity={0.5}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={TICK_STYLE}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={TICK_STYLE}
              domain={[11, 13.5]}
              ticks={[11, 11.5, 12, 12.5, 13]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} animationDuration={1500}>
              {CHART_DATA.map((entry, index) => (
                <Cell
                  key={entry.month}
                  fill={index === CHART_DATA.length - 1 ? '#008485' : '#E5E5E5'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
