import SectionCard from "../trust/SectionCard";

export function AssetDetailCard() {
	return (
		<SectionCard>
			<p className="font-semibold mb-4">신탁</p>

			<div className="space-y-3 text-sm">
				<Row label="원금" value="5,000만원" />
				<Row label="이번달 집행" value="-143만원" red />
				<Row label="누적 수익" value="+380만원" green />
			</div>

			<div className="my-4 h-px bg-[#F2F3F5]" />

			<Row label="실 수령액" value="5,846만원" highlight />
		</SectionCard>
	);
}

type RowProps = {
	label: string;
	value: string;
	red?: boolean;
	green?: boolean;
	highlight?: boolean;
};

function Row({
	label,
	value,
	red = false,
	green = false,
	highlight = false,
}: RowProps) {
	return (
		<div className="flex justify-between">
			<span className="text-[#6A7282]">{label}</span>
			<span
				className={`
					${red ? "text-red-500" : ""}
					${green ? "text-hana-ez-600" : ""}
					${highlight ? "font-bold text-hana-ez-600" : ""}
				`}
			>
				{value}
			</span>
		</div>
	);
}
