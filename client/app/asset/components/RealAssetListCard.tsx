"use client";

import { motion } from "framer-motion";
import { Car, ChevronRight, Coins, Home } from "lucide-react";
import type { RealAssetSummary } from "../utils/types";
import { formatKoreanCurrency } from "../utils/formatCurrency";
import {useRouter} from "next/navigation";

const ASSET_ICON_MAP = {
	REAL_ESTATE: Home,
	VEHICLE: Car,
	GOLD: Coins,
};

const TAB_MAPPING = {
	REAL_ESTATE: "realestate",
	VEHICLE: "car",
	GOLD: "gold",
};

type RealAssetCardProps = {
	data?: RealAssetSummary[];
};

export function RealAssetCard({ data }: RealAssetCardProps) {
	const router = useRouter();

	// 데이터가 없으면 표시하지 않거나 빈 상태를 보여줄 수 있음
	if (!data || data.length === 0) {
		return null;
	}

	const handleCardClick = (category: keyof typeof TAB_MAPPING) => {
		const tabId = TAB_MAPPING[category];
		router.push(`/asset?tab=${tabId}`);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileTap={{ scale: 0.98 }}
			onClick={() => handleCardClick(data[0].assetCateCd)}
			className="relative flex w-81.25 flex-col rounded-4xl bg-white p-6 shadow-[0_4px_10px_rgba(0,0,0,0.07)]"
		>
			<div className="mb-5 flex items-center justify-between">
				<h3 className="font-bold text-[15px] text-hana-black-900 tracking-tight">
					실물 자산
				</h3>
				<ChevronRight size={20} className="text-border-gray" />
			</div>

			<div className="flex flex-col gap-4">
				{data.map((asset, index) => {
					const AssetIcon = ASSET_ICON_MAP[asset.assetCateCd] || Home;
					return (
						<div key={asset.realAssetId} className="flex flex-col" onClick={(e) => {
							e.stopPropagation();
							handleCardClick(asset.assetCateCd);
						}}>
							<div className="flex items-start gap-3">
								<div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-hana-black-800">
									<AssetIcon size={20} strokeWidth={2.5} />
								</div>

								<div className="flex flex-1 flex-col">
									<div className="flex items-center justify-between">
										<span className="font-bold text-[13px] text-hana-black-800">
											{asset.assetNm}
										</span>
										<span className="font-medium text-[13px] text-hana-black-900">
											{formatKoreanCurrency(asset.evalAmt ?? 0)}
										</span>
									</div>

									<div className="mt-1 flex items-center justify-between">
										<span className="text-[11px] text-hana-black-500">
											{asset.assetCateCd === "REAL_ESTATE" && (asset.assetSize ?? 0) > 0
												? `${asset.assetSize}㎡ · `
												: ""}
											{asset.assetCateCd === "GOLD" &&
											(asset.assetSize ?? 0) > 0 &&
											!asset.assetNm.includes(`${asset.assetSize}g`)
												? `${asset.assetSize}g · `
												: ""}
											{asset.assetDesc}
										</span>
									</div>
								</div>
							</div>

							{index !== data.length - 1 && (
								<div className="mt-4 h-px w-full bg-border-gray" />
							)}
						</div>
					);
				})}
			</div>
		</motion.div>
	);
}
