"use client";

import { motion } from "framer-motion";
import { Car, ChevronRight, Coins, Home, Link2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { formatKoreanCurrency } from "../utils/formatCurrency";
import type { RealAssetCategory, RealAssetSummary } from "../utils/types";

// ─── assetDesc JSON 파서 ──────────────────────────────────────────────────────

type HousingDesc = { housing_type?: string; acquisition_year?: number; has_loan?: boolean };
type VehicleDesc = { brand?: string; model?: string; details?: string };
type GoldDesc    = { purity?: string; weight_g?: string };

function parseRealAssetDesc(
  cateCd: RealAssetCategory,
  assetDesc: string | null | undefined,
): string {
  if (!assetDesc) return '';
  try {
    if (cateCd === 'REAL_ESTATE') {
      const d = JSON.parse(assetDesc) as HousingDesc;
      const parts: string[] = [];
      if (d.acquisition_year) parts.push(`${d.acquisition_year}년 취득`);
      if (d.housing_type)     parts.push(d.housing_type);
      return parts.join(' · ');
    }
    if (cateCd === 'VEHICLE') {
      const d = JSON.parse(assetDesc) as VehicleDesc;
      const label = [d.brand, d.model].filter(Boolean).join(' ');
      const regDt  = d.details?.split(' · ')[0] ?? '';
      return [label, regDt].filter(Boolean).join(' · ');
    }
    if (cateCd === 'GOLD') {
      const d = JSON.parse(assetDesc) as GoldDesc;
      const parts: string[] = [];
      if (d.weight_g) parts.push(`${d.weight_g}g`);
      if (d.purity)   parts.push(`${d.purity}K 순도`);
      return parts.join(' · ');
    }
  } catch {
    // JSON 파싱 실패 시 빈 문자열 반환
  }
  return '';
}

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

const FAKE_ASSETS = [
	{ id: "fake-1", icon: Home, name: "서울 마포구 아파트", desc: "84㎡ · 전세", value: 450000000 },
	{ id: "fake-2", icon: Car, name: "현대 그랜저 IG", desc: "2021년식", value: 28000000 },
	{ id: "fake-3", icon: Coins, name: "KRX 금 현물", desc: "10g · 금 현물", value: 1050000 },
];

const FAKE_CHART_DATA = [
	{ name: "7월", value: 3.8 },
	{ name: "8월", value: 4.1 },
	{ name: "9월", value: 3.9 },
	{ name: "10월", value: 4.3 },
	{ name: "11월", value: 4.6 },
	{ name: "12월", value: 4.8 },
];

type RealAssetCardProps = {
	data?: RealAssetSummary[];
};

export function RealAssetCard({ data }: RealAssetCardProps) {
	const router = useRouter();

	if (!data || data.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="relative flex w-81.25 flex-col rounded-4xl bg-white p-6 shadow-[0_4px_10px_rgba(0,0,0,0.07)] overflow-hidden"
			>
				<div className="mb-5 flex items-center justify-between">
					<h3 className="font-bold text-[15px] text-hana-black-900 tracking-tight">
						실물 자산
					</h3>
				</div>

				{/* 연동 필요 안내 배너 */}
				<button
									type="button"
									className="mb-5 flex w-full items-center justify-between rounded-2xl bg-hana-teal-50 px-4 py-3 text-left"
									onClick={() => router.push("/mydata/house")}
								>
					<div className="flex items-center gap-2">
						<Link2 size={16} className="text-hana-green-700" />
						<span className="font-bold text-[13px] text-hana-green-700">
							실물자산 연동이 필요해요
						</span>
					</div>
					<ChevronRight size={16} className="text-hana-green-700" />
				</button>

				{/* 블러 처리된 가라 리스트 */}
				<div className="relative">
					<div className="flex flex-col gap-4 blur-sm select-none pointer-events-none">
						{FAKE_ASSETS.map((asset, index) => {
							const AssetIcon = asset.icon;
							return (
								<div key={asset.id} className="flex flex-col">
									<div className="flex items-start gap-3">
										<div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-hana-black-800">
											<AssetIcon size={20} strokeWidth={2.5} />
										</div>
										<div className="flex flex-1 flex-col">
											<div className="flex items-center justify-between">
												<span className="font-bold text-[13px] text-hana-black-800">
													{asset.name}
												</span>
												<span className="font-medium text-[13px] text-hana-black-900">
													{formatKoreanCurrency(asset.value)}
												</span>
											</div>
											<div className="mt-1">
												<span className="text-[11px] text-hana-black-500">
													{asset.desc}
												</span>
											</div>
										</div>
									</div>
									{index !== FAKE_ASSETS.length - 1 && (
										<div className="mt-4 h-px w-full bg-border-gray" />
									)}
								</div>
							);
						})}
					</div>
				</div>
			</motion.div>
		);
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
											{parseRealAssetDesc(asset.assetCateCd, asset.assetDesc)}
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
