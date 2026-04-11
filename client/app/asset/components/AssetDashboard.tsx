"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

const ASSET_DATA = [
	{ name: "주식", value: "5억 2,000만", percentage: 74.5, color: "#015E5F" },
	{ name: "적금", value: "1억 2,000만", percentage: 63.1, color: "#1EB1B2" },
	{ name: "펀드", value: "3,000만", percentage: 50.6, color: "#8DC8C8" },
	{ name: "연금", value: "2,000만", percentage: 36.4, color: "#C7E4E4" },
	{ name: "계좌", value: "1,000만", percentage: 13.1, color: "#BDAE7F" },
];

export function AssetDashboard() {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="flex flex-col items-center">
			<motion.div
				layout
				onClick={() => !isExpanded && setIsExpanded(true)}
				className={`relative flex cursor-pointer flex-col overflow-hidden rounded-4xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] ${
					isExpanded ? "h-100 w-81.25" : "h-31.5 w-81.25"
				}`}
				style={{
					background: "linear-gradient(135deg, #075558 0%, #0A9293 100%)",
				}}
			>
				<AnimatePresence>
					{isExpanded && (
						<motion.button
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={(e) => {
								e.stopPropagation();
								setIsExpanded(false);
							}}
							className="absolute top-4 right-4 z-50 flex size-6 items-center justify-center rounded-full bg-white/20 text-white outline-none hover:bg-white/30"
						>
							<X size={16} />
						</motion.button>
					)}
				</AnimatePresence>

				<div className="p-6">
					<div className="relative">
						{!isExpanded && (
							<div className="-translate-y-1/2 absolute top-1/2 right-0">
								<ChevronRight size={24} className="text-white/40" />
							</div>
						)}
						<div className="space-y-1">
							<p className="font-medium text-[14px] text-white/80">
								내 총 금융 자산
							</p>
							<motion.h3
								layout="position"
								className="font-bold text-[28px] text-white leading-tight tracking-tight"
							>
								12억 4,830만원
							</motion.h3>
						</div>
						<div className="mt-2 inline-flex h-6 items-center rounded-full bg-white px-3">
							<span className="flex items-center gap-1 font-bold text-[11px] text-hana-red-500">
								230만 ( 1.2% )
								<svg
									width="6"
									height="4"
									viewBox="0 0 6 4"
									fill="none"
									aria-hidden="true"
								>
									<path d="M3 0L6 4L0 4L3 0Z" fill="#D60003" />
								</svg>
							</span>
						</div>
					</div>
				</div>

				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							className="mx-3 mt-auto mb-3 flex flex-col rounded-4xl bg-white p-5 shadow-lg"
						>
							<h4 className="mb-4 font-bold text-[13px] text-hana-black-800">
								자산 구성
							</h4>
							<div className="flex items-center gap-6">
								<div className="relative flex size-25 items-center justify-center">
									<ResponsiveContainer width={100} height={100}>
										<PieChart>
											<Pie
												data={ASSET_DATA}
												cx="50%"
												cy="50%"
												innerRadius={32}
												outerRadius={46}
												startAngle={90}
												endAngle={-270}
												dataKey="percentage"
												strokeWidth={0}
											>
												{ASSET_DATA.map((asset) => (
													<Cell key={asset.name} fill={asset.color} />
												))}
											</Pie>
										</PieChart>
									</ResponsiveContainer>
									<div className="absolute flex flex-col items-center justify-center">
										<span className="font-bold text-[13px] text-hana-black-900">
											12.4억
										</span>
									</div>
								</div>

								<div className="flex-1 space-y-2.5">
									{ASSET_DATA.map((asset) => (
										<div key={asset.name} className="space-y-1">
											<div className="flex items-center justify-between font-bold text-[11px] text-hana-black-800">
												<div className="flex items-center gap-1.5">
													<div
														className="size-1.5 rounded-full"
														style={{ backgroundColor: asset.color }}
													/>
													<span className="opacity-90">{asset.name}</span>
												</div>
												<span className="font-semibold">{asset.value}</span>
											</div>
											<div className="h-[4.5px] w-full rounded-full bg-hana-silver-100">
												<div
													className="h-full rounded-full transition-all duration-1000"
													style={{
														width: `${asset.percentage}%`,
														backgroundColor: asset.color,
													}}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}
