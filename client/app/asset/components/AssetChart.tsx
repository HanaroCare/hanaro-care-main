"use client";

import { motion } from "framer-motion";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

type ChartDataItem = {
	name: string;
	value: number;
};

type BarChartConfig = {
	type: "bar";
	activeColor?: string;
	inactiveColor?: string;
	domain?: [number, number];
	ticks?: number[];
};

type LineChartConfig = {
	type: "line";
	color?: string;
	domain?: [number, number];
	ticks?: number[];
};

type AssetChartProps = {
	title: string;
	subtitle?: string;
	data: ChartDataItem[];
	config: BarChartConfig | LineChartConfig;
};

const TICK_STYLE = { fontSize: 11, fill: "#888988" } as const;

export function AssetChart({ title, subtitle, data, config }: AssetChartProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="w-81.25 rounded-3xl border-[0.5px] border-border-gray bg-white p-6 shadow-sm"
		>
			<div className="mb-6 flex flex-col gap-1">
				<h3 className="font-bold text-[15px] text-hana-black-900 tracking-tight">
					{title}
				</h3>
				{subtitle && (
					<p className="text-[12px] text-hana-black-500 tracking-tight">
						{subtitle}
					</p>
				)}
			</div>

			<div className="h-[200px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					{config.type === "bar" ? (
						<BarChart
							data={data}
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
								dataKey="name"
								axisLine={false}
								tickLine={false}
								tick={TICK_STYLE}
								dy={10}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={TICK_STYLE}
								domain={config.domain}
								ticks={config.ticks}
							/>
							<Bar
								dataKey="value"
								radius={[4, 4, 0, 0]}
								animationDuration={1500}
							>
								{data.map((_, index) => (
									<Cell
										key={data[index].name}
										fill={
											index === data.length - 1
												? (config.activeColor ?? "#008485")
												: (config.inactiveColor ?? "#E5E5E5")
										}
									/>
								))}
							</Bar>
						</BarChart>
					) : (
						<LineChart
							data={data}
							margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
						>
							<CartesianGrid vertical={false} stroke="#F2F4F7" />
							<XAxis
								dataKey="name"
								axisLine={false}
								tickLine={false}
								tick={TICK_STYLE}
								dy={10}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={TICK_STYLE}
								domain={config.domain}
								ticks={config.ticks}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: "12px",
									border: "none",
									boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
									fontSize: "12px",
								}}
							/>
							<Line
								type="monotone"
								dataKey="value"
								stroke={config.color ?? "#008485"}
								strokeWidth={3}
								dot={{ r: 4, fill: config.color ?? "#008485", strokeWidth: 0 }}
								activeDot={{ r: 6, strokeWidth: 0 }}
							/>
						</LineChart>
					)}
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
}
