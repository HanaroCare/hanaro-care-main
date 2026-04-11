"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Shield, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState, type ReactNode } from "react";

type InsuranceStatus = "needs_check" | "normal";
type IconType = "hana-bank" | "nation-pension" | "default";

const ICON_MAP: Record<IconType, string> = {
	"hana-bank": "/images/asset/hana-bank.svg",
	"nation-pension": "/images/asset/nation-pension.svg",
	default: "",
};

const EMOJI_MAP: Record<string, string> = {
	property: "🏠",
	car: "🚗",
	gold: "🥇",
};

type DetailedAssetCardProps = {
	type: "property" | "car" | "gold";
	title?: string;
	subtitle?: string;
	value?: string;
	change?: string;
	changePercent?: string;
	isPositive?: boolean;
	children?: ReactNode;
};

type InsuranceAssetCardProps = {
	type: "insurance";
	iconType?: IconType;
	company?: string;
	insuranceName?: string;
	monthlyPremium?: string;
	status?: InsuranceStatus;
	children?: ReactNode;
};

type AssetDetailCardProps = DetailedAssetCardProps | InsuranceAssetCardProps;

const DEFAULT_VALUES: Record<"property" | "car" | "gold", DetailedAssetCardProps> = {
	property: {
		type: "property",
		title: "서울 강남구 역삼동 아파트",
		subtitle: "84㎡ (33평)",
		value: "9억 2,000만원",
		change: "1,200만원",
		changePercent: "10%",
		isPositive: true,
	},
	car: {
		type: "car",
		title: "그랜저 IG",
		subtitle: "2021년식 · 37,200km",
		value: "2,850만원",
		change: "15만원",
		changePercent: "0.5%",
		isPositive: false,
	},
	gold: {
		type: "gold",
		title: "골드바 (100g)",
		subtitle: "중량: 100g",
		value: "1,330만원",
		change: "80만원",
		changePercent: "10%",
		isPositive: true,
	},
};

export function AssetDetailCard(props: AssetDetailCardProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	if (props.type === "insurance") {
		const {
			iconType = "hana-bank",
			company = "하나생명",
			insuranceName = "하나 건강보험",
			monthlyPremium = "월 15만원",
			status = "needs_check",
			children,
		} = props;

		return (
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative flex w-81.25 flex-col overflow-hidden rounded-[15px] border-[0.5px] border-border-gray bg-white shadow-sm"
			>
				<div
					onClick={() => setIsExpanded(!isExpanded)}
					className="flex h-[90px] w-full cursor-pointer items-center justify-between px-4.5"
				>
					<div className="flex items-center gap-4.25">
						<div className="flex size-[33px] items-center justify-center rounded-[10px] bg-hana-teal-100">
							{iconType === "default" ? (
								<Shield
									size={18}
									className="text-hana-green-700"
									aria-hidden="true"
								/>
							) : (
								<Image
									src={ICON_MAP[iconType]}
									alt=""
									width={22}
									height={22}
									aria-hidden="true"
								/>
							)}
						</div>
						<div className="flex flex-col">
							<span className="text-[12px] text-hana-black-600 leading-[18px]">
								{company}
							</span>
							<span className="font-semibold text-[16px] text-hana-black-900 leading-[21px]">
								{insuranceName}
							</span>
							<span className="text-[12px] text-hana-black-600 leading-[18px]">
								{monthlyPremium}
							</span>
						</div>
					</div>

					<div className="flex flex-col items-end gap-2">
						{status === "needs_check" ? (
							<div className="flex h-[26px] items-center justify-center rounded-[15px] bg-hana-red-50 px-3">
								<span className="font-medium text-[12px] text-hana-red-500 tracking-tight">
									확인 필요
								</span>
							</div>
						) : (
							<div className="flex h-[26px] items-center justify-center rounded-[15px] bg-hana-blue-50 px-3">
								<span className="font-medium text-[12px] text-hana-blue-500 tracking-tight">
									정상
								</span>
							</div>
						)}
						{status === "needs_check" && (
							<button
								type="button"
								className="font-medium text-[11px] text-hana-black-600 tracking-tight"
							>
								확인하기 &gt;
							</button>
						)}
					</div>
				</div>
				<AnimatePresence>
					{isExpanded && children && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							className="border-t border-border-gray/50 bg-zinc-50/50 p-4.5"
						>
							{children}
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		);
	}

	const defaults = DEFAULT_VALUES[props.type];
	const {
		title = defaults.title,
		subtitle = defaults.subtitle,
		value = defaults.value,
		change = defaults.change,
		changePercent = defaults.changePercent,
		isPositive = defaults.isPositive,
		children,
	} = props;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="relative flex w-81.25 flex-col overflow-hidden rounded-3xl border-[0.5px] border-border-gray bg-white shadow-sm"
		>
			<div
				onClick={() => setIsExpanded(!isExpanded)}
				className="flex h-27.75 w-full cursor-pointer flex-col justify-between p-4.5"
			>
				<div className="flex items-start justify-between">
					<div className="flex flex-col">
						<span className="font-medium text-[15px] text-hana-black-900 leading-5.25">
							{title}
						</span>
						<div className="mt-[3.5px] flex items-center gap-4">
							<span className="text-[25px] leading-none" aria-hidden="true">
								{EMOJI_MAP[props.type]}
							</span>
							<span className="text-[11px] text-hana-black-600 leading-4.5">
								{subtitle}
							</span>
						</div>
					</div>
					<motion.div
						animate={{ rotate: isExpanded ? 180 : 0 }}
						className="mt-1 text-hana-black-400"
					>
						<ChevronDown size={20} />
					</motion.div>
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
			</div>
			<AnimatePresence>
				{isExpanded && children && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="flex flex-col gap-4 border-t border-border-gray/50 bg-zinc-50/50 p-4.5"
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	);
}
