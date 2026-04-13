import SectionCard from "../trust/SectionCard";

export function ExecutionListCard() {
	return (
		<SectionCard>
			<p className="mb-4 font-semibold">이번달 집행 내역</p>

			<div className="space-y-3 text-sm">
				<Item />
				<Item />
				<Item />
			</div>
		</SectionCard>
	);
}

function Item() {
	return (
		<div className="flex items-start justify-between">
			<span className="w-12 text-[13px] text-[#9CA3AF]">04.03</span>

			<div className="flex-1">
				<p className="text-[14px] text-[#1F2937]">삼성서울병원</p>
				<p className="text-[12px] text-[#9CA3AF]">병원비 자동 집행</p>
			</div>

			<span className="text-[14px] text-red-500 font-medium">-43만원</span>
		</div>
	);
}
