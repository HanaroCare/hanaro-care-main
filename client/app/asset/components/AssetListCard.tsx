"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import type { FinancialAssetResponse } from "../utils/types";
import { formatKoreanCurrency } from "../utils/formatCurrency";

const GET_LOGO_BY_NAME = (instNm: string): string => {
	if (instNm.includes("하나")) return "/images/asset/hana-bank.svg";
	if (instNm.includes("현대")) return "/images/asset/hd-card.svg";
	if (instNm.includes("기업")) return "/images/asset/ibk-bank.svg";
	if (instNm.includes("국민은행")) return "/images/asset/kb-bank.svg";
	if (instNm.includes("국민연금")) return "/images/asset/nation-pension.svg";
	if (instNm.includes("삼성")) return "/images/asset/samsung.svg";
	if (instNm.includes("신한")) return "/images/asset/shinhan-bank.svg";

	return "/images/asset/hana-bank.svg"; // 기본 로고
};

const ICON_STYLES: Record<string, string> = {
	CASH:             "bg-hana-teal-100",
	STOCK:            "bg-hana-teal-100",
	PENSION:          "bg-hana-yellow-100",
	PENSION_NATIONAL: "bg-hana-yellow-100",
	PENSION_RETIRE:   "bg-hana-yellow-100",
	PENSION_PERSONAL: "bg-hana-yellow-100",
	CARD:             "bg-hana-teal-100",
};

export function AssetListCard({ data }: { data: FinancialAssetResponse[] }) {
	return (
		<div className="w-81.25 rounded-3xl border-[0.5px] border-border-gray bg-white p-5 shadow-sm">
			<div className="flex flex-col gap-6">
				{data.map((item, index) => (
					<div key={`${item.assetCateCd}-${item.accountId}-${index}`} className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className={`flex size-8 shrink-0 items-center justify-center rounded-[10px] ${ICON_STYLES[item.assetCateCd] || "bg-hana-teal-100"}`}>
								<Image
									src={GET_LOGO_BY_NAME(item.instNm)}
									alt=""
									width={20}
									height={20}
									className="object-contain"
								/>
							</div>
							<div className="flex flex-col">
								<span className="text-[12px] text-hana-black-500 leading-tight">{item.instNm}</span>
								<span className="font-medium text-[15px] text-hana-black-900 leading-tight">{item.accountNm}</span>
							</div>
						</div>

						<div className="flex flex-col items-end">
                      <span className="font-medium text-[15px] text-hana-black-900 leading-tight">
                         {formatKoreanCurrency(item.balanceAmt)}
                      </span>
							{item.profitRate > 0 && (
								<div className="flex items-center gap-1 font-medium text-[12px] text-hana-red-500">
									<svg width="7" height="6" viewBox="0 0 7 6" fill="none"><path d="M3.5 0L7 6L0 6L3.5 0Z" fill="currentColor" /></svg>
									<span>{formatKoreanCurrency(Math.floor(item.balanceAmt * (item.profitRate / 100)))} ({item.profitRate}%)</span>
								</div>
							)}
						</div>
					</div>
				))}
			</div>
			<button type="button" className="mt-6 flex w-full items-center justify-center gap-1 py-1 text-[13px] text-hana-black-500">
				더보기 <ChevronRight size={14} />
			</button>
		</div>
	);
}
