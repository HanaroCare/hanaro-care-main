"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import SectionCard from "../trust/SectionCard";

type PortfolioItem = {
	name: string;
	value: number;
	valueLabel: string;
	returnRate: string;
	color: string;
};

const portfolioData: PortfolioItem[] = [
	{
		name: "A 펀드",
		value: 2250,
		valueLabel: "2,250만원",
		returnRate: "수익률 45%",
		color: "#006B6B",
	},
	{
		name: "B 펀드",
		value: 1500,
		valueLabel: "1,500만원",
		returnRate: "수익률 45%",
		color: "#25B7C0",
	},
	{
		name: "A 주식",
		value: 750,
		valueLabel: "750만원",
		returnRate: "수익률 45%",
		color: "#C1AE72",
	},
];

export function PortfolioCard() {
	return (
		<SectionCard>
			<p className="mb-4 text-[15px] font-semibold leading-6 tracking-tight text-[#1F2937]">
				운용중인 포트폴리오
			</p>

			<div className="mb-5 flex justify-center">
				<div className="h-[132px] w-[132px]">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={portfolioData}
								dataKey="value"
								nameKey="name"
								cx="50%"
								cy="50%"
								innerRadius={34}
								outerRadius={52}
								paddingAngle={0}
								stroke="none"
								isAnimationActive
								animationBegin={0}
								animationDuration={1100}
								animationEasing="ease-out"
							>
								{portfolioData.map((entry) => (
									<Cell key={entry.name} fill={entry.color} />
								))}
							</Pie>
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>

			<ul className="space-y-2.5">
				{portfolioData.map((item) => (
					<li
						key={item.name}
						className="flex items-center justify-between gap-3"
					>
						<div className="flex min-w-0 items-center gap-2">
							<span
								className="h-2.5 w-2.5 shrink-0 rounded-full"
								style={{ backgroundColor: item.color }}
							/>
							<span className="text-[14px] leading-5 text-[#1F2937]">
								{item.name}
							</span>
						</div>

						<div className="flex shrink-0 items-center gap-2">
							<span className="text-[14px] leading-5 font-medium text-hana-ez-600">
								{item.valueLabel}
							</span>
							<span className="text-[12px] leading-[18px] font-medium text-hana-red-500">
								{item.returnRate}
							</span>
						</div>
					</li>
				))}
			</ul>
		</SectionCard>
	);
}
