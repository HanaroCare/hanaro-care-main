"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

type ChangeType = "up" | "down";

type RealAsset = {
	id: number;
	icon: string;
	name: string;
	value: string;
	subText: string;
	change: string;
	changeType: ChangeType;
};

const REAL_ASSETS: RealAsset[] = [
	{
		id: 1,
		icon: "🏠",
		name: "안양시 동안구 00 아파트",
		value: "10억 2,000만",
		subText: "45㎡ · 2025년 6월 매입",
		change: "230만 (1.2%)",
		changeType: "up",
	},
	{
		id: 2,
		icon: "🚗",
		name: "그랜저 IG 2021",
		value: "2,850만",
		subText: "37,200km",
		change: "15만 (1.2%)",
		changeType: "down",
	},
	{
		id: 3,
		icon: "🥇",
		name: "금 · 37.5g",
		value: "438만",
		subText: "KRX 금시장 기준",
		change: "22만 (10.2%)",
		changeType: "up",
	},
];

type ChangeIndicatorProps = {
	change: string;
	changeType: ChangeType;
};

function ChangeIndicator({ change, changeType }: ChangeIndicatorProps) {
	const isUp = changeType === "up";
	return (
		<div className="flex items-center gap-0.5">
			<span
				className={`font-medium text-[11px] ${isUp ? "text-hana-red-500" : "text-hana-blue-500"}`}
			>
				{change}
			</span>
			<svg
				width="7"
				height="6"
				viewBox="0 0 7 6"
				fill="none"
				aria-hidden="true"
				className={isUp ? "" : "rotate-180"}
			>
				<path d="M3.5 0L7 6H0L3.5 0Z" fill={isUp ? "#D60003" : "#3135FF"} />
			</svg>
		</div>
	);
}

export function RealAssetCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="relative flex w-81.25 flex-col rounded-4xl bg-white p-6 shadow-[0_4px_10px_rgba(0,0,0,0.07)]"
		>
			<div className="mb-5 flex items-center justify-between">
				<h3 className="font-bold text-[15px] text-hana-black-900 tracking-tight">
					실물 자산
				</h3>
				<ChevronRight size={20} className="text-border-gray" />
			</div>

			<div className="flex flex-col gap-4">
				{REAL_ASSETS.map((asset, index) => (
					<div key={asset.id} className="flex flex-col">
						<div className="flex items-start gap-3">
							<span className="text-[25px] leading-none" aria-hidden="true">
								{asset.icon}
							</span>

							<div className="flex flex-1 flex-col">
								<div className="flex items-center justify-between">
									<span className="font-bold text-[13px] text-hana-black-800">
										{asset.name}
									</span>
									<span className="font-medium text-[13px] text-hana-black-900">
										{asset.value}
									</span>
								</div>

								<div className="mt-1 flex items-center justify-between">
									<span className="text-[11px] text-hana-black-500">
										{asset.subText}
									</span>
									<ChangeIndicator
										change={asset.change}
										changeType={asset.changeType}
									/>
								</div>
							</div>
						</div>

						{index !== REAL_ASSETS.length - 1 && (
							<div className="mt-4 h-px w-full bg-border-gray" />
						)}
					</div>
				))}
			</div>
		</motion.div>
	);
}
