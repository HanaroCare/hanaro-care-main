"use client";

import { motion } from "framer-motion";

type MedicalBudgetCardProps = {
	// TODO: GET /api/asset/simulation 에서 받아와야 함
	usedAmount: number;
	totalAmount: number;
	usagePercent: number;
	yearsLeft: number;
};

export function MedicalBudgetCard({
	usedAmount,
	totalAmount,
	usagePercent,
	yearsLeft,
}: MedicalBudgetCardProps) {
	return (
		<div className="w-81.25 rounded-4xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
			<div className="flex items-center justify-between">
				<h3 className="font-semibold text-[15px] text-hana-black-900">
					나의 의료비 예산
				</h3>
				<div className="flex items-baseline gap-1">
					<span className="font-bold text-[16px] text-hana-black-900">
						{usedAmount}억
					</span>
					<span className="font-medium text-[10px] text-hana-black-400">
						/ {totalAmount}억
					</span>
				</div>
			</div>

			<div className="mt-4 h-[11px] w-full overflow-hidden rounded-full bg-hana-silver-100">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${usagePercent}%` }}
					transition={{ duration: 1, ease: "easeOut" }}
					className="h-full rounded-full"
					style={{
						background: "linear-gradient(90deg, #2D4F50 0%, #66B5B6 100%)",
					}}
				/>
			</div>

			<div className="mt-4 flex flex-col gap-1">
				<p className="font-medium text-[15px] text-hana-black-600">
					총 예산의 {usagePercent}% 사용
				</p>
				<p className="font-medium text-[12px] text-hana-red-500">
					{yearsLeft}년 뒤에 다 떨어져요
				</p>
			</div>
		</div>
	);
}
