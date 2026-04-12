"use client";

type AssetType = "total" | "property" | "car" | "gold" | "insurance";

type AssetSummaryHeaderProps = {
	type: AssetType;
	title?: string;
	amount: string;
};

const LABEL_MAP: Record<string, string> = {
	total: "총 금융자산",
	property: "부동산 총액",
	car: "자동차 총액",
	gold: "금 총액",
};

export function AssetSummaryHeader({
	type,
	title,
	amount,
}: AssetSummaryHeaderProps) {
	if (type === "insurance") return null;

	const displayLabel = title || LABEL_MAP[type] || "자산 가치";

	return (
		<div className="w-full bg-white px-6 py-8">
			<div className="flex flex-col">
				<span className="font-normal text-[14px] text-hana-black-500 mb-1">
					{displayLabel}
				</span>
				<h1 className="font-bold text-[28px] text-hana-black-900 leading-tight tracking-tight">
					{amount}
				</h1>
			</div>
		</div>
	);
}
