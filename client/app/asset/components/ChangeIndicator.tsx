"use client";

type ChangeIndicatorProps = {
	amount: string;
	percentage: string;
	isUp: boolean;
};

export function ChangeIndicator({
	amount,
	percentage,
	isUp,
}: ChangeIndicatorProps) {
	const color = isUp ? "text-hana-red-500" : "text-hana-blue-500";
	const fill = isUp ? "#D60003" : "#006CFF";
	const path = isUp ? "M3 0L6 4L0 4L3 0Z" : "M3 4L6 0L0 0L3 4Z";

	return (
		<div className="inline-flex h-6 w-fit items-center rounded-full bg-white px-3">
			<span
				className={`flex items-center gap-1 font-bold text-[11px] ${color}`}
			>
				{amount} ( {percentage} )
				<svg
					width="6"
					height="4"
					viewBox="0 0 6 4"
					fill="none"
					aria-hidden="true"
				>
					<path d={path} fill={fill} />
				</svg>
			</span>
		</div>
	);
}
