"use client";

import { motion } from "framer-motion";
import { Car, ChevronRight, Coins, Home, Shield } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type InsuranceStatus = "needs_check" | "normal";
type IconType = "hana-bank" | "nation-pension" | "default";
type AssetType = "property" | "car" | "gold";

const ICON_MAP: Record<IconType, string> = {
	"hana-bank": "/images/asset/hana-bank.svg",
	"nation-pension": "/images/asset/nation-pension.svg",
	default: "",
};

const ASSET_ICON_MAP = {
	property: Home,
	car: Car,
	gold: Coins,
};

type DetailedAssetCardProps = {
	type: AssetType;
	// TODO: 서버에서 아래 데이터를 받아와야 함
	// GET /api/asset/real?category={type}
	// response: { title, subtitle, value, change, changePercent, isPositive }
	title: string;
	subtitle: string;
	value: string;
	change?: string;
	changePercent?: string;
	isPositive?: boolean;
	href?: string;
};

type InsuranceAssetCardProps = {
	type: "insurance";
	// TODO: 서버에서 아래 데이터를 받아와야 함
	// GET /api/asset/financial?category=INSURANCE
	// response: { iconType, company, insuranceName, monthlyPremium, status }
	iconType?: IconType;
	company: string;
	insuranceName: string;
	monthlyPremium: string;
	status?: InsuranceStatus;
	href?: string;
};

type AssetDetailCardProps = DetailedAssetCardProps | InsuranceAssetCardProps;

export function AssetDetailCard(props: AssetDetailCardProps) {
	const router = useRouter();

	const handleCardClick = () => {
		if (props.href) {
			router.push(props.href);
		}
	};

	if (props.type === "insurance") {
		const {
			iconType = "hana-bank",
			company,
			insuranceName,
			monthlyPremium,
			status = "needs_check",
		} = props;

		return (
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				onClick={handleCardClick}
				className="relative flex h-22.5 w-81.25 cursor-pointer items-center justify-between rounded-[15px] border-[0.5px] border-border-gray bg-white px-4.5 shadow-sm active:bg-zinc-50"
			>
				<div className="flex items-center gap-4.25">
					<div className="flex size-8.25 items-center justify-center rounded-[10px] bg-hana-teal-100">
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
						<span className="text-[12px] text-hana-black-600 leading-4.5">
							{company}
						</span>
						<span className="font-semibold text-[16px] text-hana-black-900 leading-5.25">
							{insuranceName}
						</span>
						<span className="text-[12px] text-hana-black-600 leading-4.5">
							{monthlyPremium}
						</span>
					</div>
				</div>

				<div className="flex flex-col items-end gap-2">
					{status === "needs_check" ? (
						<div className="flex h-6.5 items-center justify-center rounded-[15px] bg-hana-red-50 px-3">
							<span className="font-medium text-[12px] text-hana-red-500 tracking-tight">
								확인 필요
							</span>
						</div>
					) : (
						<div className="flex h-6.5 items-center justify-center rounded-[15px] bg-hana-blue-50 px-3">
							<span className="font-medium text-[12px] text-hana-blue-500 tracking-tight">
								정상
							</span>
						</div>
					)}
					{status === "needs_check" && (
						<span className="font-medium text-[11px] text-hana-black-600 tracking-tight">
							확인하기 &gt;
						</span>
					)}
				</div>
			</motion.div>
		);
	}

	const { title, subtitle, value, change, changePercent, isPositive } = props;
	const AssetIcon = ASSET_ICON_MAP[props.type];

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			onClick={handleCardClick}
			className="relative flex h-32 w-81.25 cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border-[0.5px] border-border-gray bg-white p-5 shadow-sm active:bg-zinc-50"
		>
			<div className="flex items-start justify-between">
				<div className="flex items-start gap-3">
					{/* 2. 아이콘을 타이틀 왼쪽으로 배치 */}
					<div className="mt-0.5 flex size-10 items-center justify-center rounded-xl bg-gray-50 text-hana-black-800">
						<AssetIcon size={24} strokeWidth={2} />
					</div>

					<div className="flex flex-col">
						<span className="font-bold text-[16px] text-hana-black-900 leading-tight">
							{title}
						</span>
						{/* 3. 아래에는 상세 정보만 위치 */}
						<span className="mt-1 text-[12px] text-hana-black-500 font-medium">
							{subtitle}
						</span>
					</div>
				</div>
				<div className="mt-1 text-hana-black-300">
					<ChevronRight size={20} />
				</div>
			</div>

			{/* 4. 금액 섹션 (간격을 넓히기 위해 mt-auto 활용) */}
			<div className="mt-auto flex items-center justify-between">
				<span className="font-semi-bold text-[18px] text-hana-black-900 tracking-tight">
					{value}
				</span>
				{change && changePercent && (
					<div
						className={`flex items-center gap-1 font-semi-bold text-[13px] ${
							isPositive ? "text-hana-red-500" : "text-hana-blue-500"
						}`}
					>
						<svg
							width="8"
							height="7"
							viewBox="0 0 7 6"
							fill="none"
							className={isPositive ? "" : "rotate-180"}
							aria-hidden="true"
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
