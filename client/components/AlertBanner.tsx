"use client";

import { motion } from "framer-motion";
import { AlertCircle, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

type AlertVariant = "warning" | "info" | "success";

type AlertBannerProps = {
	message: string;
	actionText?: string;
	onActionAction?: () => void;
	variant?: AlertVariant;
	icon?: ReactNode;
};

const VARIANTS: Record<AlertVariant, { bg: string; text: string }> = {
	warning: {
		bg: "bg-hana-red-50",
		text: "text-hana-red-500",
	},
	info: {
		bg: "bg-hana-blue-50",
		text: "text-hana-blue-500",
	},
	success: {
		bg: "bg-hana-green-50",
		text: "text-hana-green-700",
	},
};

export function AlertBanner({
	message,
	actionText,
	onActionAction,
	variant = "warning",
	icon,
}: AlertBannerProps) {
	const { bg, text } = VARIANTS[variant];

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className={`flex h-[70px] w-81.25 items-center justify-between rounded-[14px] px-4.5 ${bg}`}
		>
			<div className="flex items-center gap-2.5">
				<div className={text}>
					{icon ?? <AlertCircle size={22} aria-hidden="true" />}
				</div>
				<span className={`font-semibold text-[15px] tracking-tight ${text}`}>
					{message}
				</span>
			</div>

			{actionText && (
				<button
					type="button"
					onClick={onActionAction}
					className={`flex items-center font-medium text-[12px] tracking-tight transition-opacity hover:opacity-80 ${text}`}
				>
					{actionText}
					<ChevronRight size={14} aria-hidden="true" />
				</button>
			)}
		</motion.div>
	);
}
