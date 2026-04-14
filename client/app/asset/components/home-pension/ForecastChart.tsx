import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DataPoint } from '../../constants/constants';

type ForecastChartProps = {
  data: DataPoint[];
};

export function ForecastChart({ data }: ForecastChartProps) {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -4, bottom: 0 }}
        >
          <CartesianGrid
            stroke="#E5E7EB"
            strokeDasharray="3 3"
            vertical={false}
          />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
          />
          <YAxis
            domain={[6, 15]}
            ticks={[6, 8, 10, 12, 14]}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}억`}
            tick={{ fontSize: 11, fill: '#9CA3AF' }}
            width={40}
          />
          <Tooltip
            formatter={(value) => `${value}억`}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #E5E7EB',
              fontSize: 12,
            }}
          />

          <Area
            type="monotone"
            dataKey="past"
            name="과거 KB시세 추이 (실거래)"
            stroke="#9CA3AF"
            fill="#9CA3AF"
            fillOpacity={0.08}
            strokeWidth={2}
            connectNulls
            isAnimationActive
          />
          <Area
            type="monotone"
            dataKey="bull"
            name="낙관 +4%/년"
            stroke="#00C4CC"
            fill="#00C4CC"
            fillOpacity={0.05}
            strokeWidth={3}
            connectNulls
            isAnimationActive
          />
          <Area
            type="monotone"
            dataKey="base"
            name="중립 +2%/년"
            stroke="#008C95"
            fill="#008C95"
            fillOpacity={0.04}
            strokeWidth={3}
            connectNulls
            isAnimationActive
          />
          <Area
            type="monotone"
            dataKey="bear"
            name="비관 0%/년"
            stroke="#064E3B"
            fill="#064E3B"
            fillOpacity={0.04}
            strokeWidth={3}
            connectNulls
            isAnimationActive
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
