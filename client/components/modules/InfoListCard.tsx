"use client";

import { motion } from "framer-motion";

type InfoItem = {
	label: string;
	value: string;
};

type InfoListCardProps = {
	title: string;
	items: InfoItem[];
};

export function InfoListCard({ title, items }: InfoListCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex w-81.25 flex-col gap-3 rounded-3xl border-[0.5px] border-border-gray bg-white p-4 shadow-sm"
		>
			<h4 className="font-semibold text-[14px] text-hana-black-900 tracking-tight">
				{title}
			</h4>
			<div className="flex flex-col gap-2.5">
				{items.map((item) => (
					<div key={item.label} className="flex justify-between">
						<span className="text-[13px] text-hana-black-500 tracking-tight">
							{item.label}
						</span>
						<span className="font-medium text-[13px] text-hana-black-900 tracking-tight">
							{item.value}
						</span>
					</div>
				))}
			</div>
		</motion.div>
	);
}
