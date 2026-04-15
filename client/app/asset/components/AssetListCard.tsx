"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import type { FinancialAssetResponse } from "../utils/types";
import { formatKoreanCurrency } from "../utils/formatCurrency";

const INSTITUTION_LOGO: Record<string, string> = {
	하나은행: "/images/asset/hana-bank.svg",
	하나증권: "/images/asset/hana-bank.svg",
	하나카드: "/images/asset/hana-bank.svg",
	국민연금: "/images/asset/nation-pension.svg",
};

// 타입을 DB 카테고리에 맞춰 매핑
const ICON_STYLES: Record<string, string> = {
	CASH: "bg-hana-teal-100",
	STOCK: "bg-hana-teal-100",
	PENSION: "bg-hana-yellow-100",
	CARD: "bg-hana-teal-100",
};

export function AssetListCard({ data }: { data: FinancialAssetResponse[] }) {
	return (
		<div className="w-81.25 rounded-3xl border-[0.5px] border-border-gray bg-white p-5 shadow-sm">
			<div className="flex flex-col gap-6">
				{data.map((item) => (
					<div key={item.accountId} className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className={`flex size-8 shrink-0 items-center justify-center rounded-[10px] ${ICON_STYLES[item.assetCateCd] || "bg-hana-teal-100"}`}>
								<Image
									src={INSTITUTION_LOGO[item.instNm] || "/images/asset/hana-bank.svg"}
									alt="" width={20} height={20} className="object-contain"
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
