export function AssetSummaryCard() {
	return (
		<div className="rounded-[24px] bg-linear-to-br from-hana-teal-600 to-hana-teal-300 px-6 py-7">
			<p className="text-[13px] font-medium leading-5 text-white/80">5년 후</p>
			<p className="mt-1 text-[28px] font-bold leading-[1.3] tracking-tight text-white">
				현 자산 5,846만원
			</p>
			<p className="mt-2 text-[14px] font-semibold leading-5">
				<span className="text-white">원금 대비 </span>
				<span className="text-hana-red-500">+20.0%</span>
			</p>
		</div>
	);
}
