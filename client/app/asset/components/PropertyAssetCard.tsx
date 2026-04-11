"use client";

import { motion } from "framer-motion";

type PropertyAssetCardProps = {
	address?: string;
	details?: string;
	value?: string;
	change?: string;
	changePercent?: string;
	isPositive?: boolean;
};

export function PropertyAssetCard({
	address = "서울 강남구 역삼동 아파트",
	details = "84㎡ (33평)",
	value = "9억 2,000만원",
	change = "1,200만원",
	changePercent = "10%",
	isPositive = true,
}: PropertyAssetCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="relative flex h-27.75 w-81.25 flex-col justify-between overflow-hidden rounded-3xl border border-border-gray bg-white p-4.5 shadow-sm"
		>
			<div className="flex flex-col">
				<span className="font-medium text-[15px] text-hana-black-900 leading-5.25">
					{address}
				</span>
				<div className="mt-[3.5px] flex items-center gap-4">
					<span className="text-[25px] leading-none" aria-hidden="true">
						🏠
					</span>
					<span className="text-[11px] text-hana-black-600 leading-4.5">
						{details}
					</span>
				</div>
			</div>

			<div className="mt-[8.5px] flex items-center justify-between">
				<span className="font-medium text-[18px] text-hana-black-900 leading-6">
					{value}
				</span>
				{change && changePercent && (
					<div
						className={`flex items-center gap-1 font-medium text-[13px] ${
							isPositive ? "text-hana-red-500" : "text-hana-blue-500"
						}`}
					>
						<svg
							width="7"
							height="6"
							viewBox="0 0 7 6"
							fill="none"
							aria-hidden="true"
							className={isPositive ? "" : "rotate-180"}
						>
							<path d="M3.5 0L7 6L0 6L3.5 0Z" fill="currentColor" />
						</svg>
						<span>
							{change} ({changePercent})
						</span>
					</div>
				)}
			</div>
		</motion.div>
	);
}
