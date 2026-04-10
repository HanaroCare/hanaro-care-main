type TrustChoiceCardProps = {
	emoji: string;
	title: string;
	desc: string;
	subDesc?: string;
	highlight?: string;
	selected?: boolean;
	recommended?: boolean;
	onClick?: () => void;
};

export default function TrustChoiceCard({
	emoji,
	title,
	desc,
	subDesc,
	highlight,
	selected = false,
	recommended = false,
	onClick,
}: TrustChoiceCardProps) {
	return (
		<div className="relative">
			{recommended ? (
				<div className="absolute -top-11 left-1/2 -translate-x-1/2">
					<span className="rounded-full bg-[#FDECEC] px-3 py-1 text-[12px] leading-4.5 font-medium tracking-snug text-hana-red-500">
						추천
					</span>
				</div>
			) : null}

			<button
				type="button"
				onClick={onClick}
				aria-pressed={selected}
				className={`flex min-h-42.5 w-full flex-col items-center justify-center rounded-[24px] px-4 py-6 text-center shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition ${
					selected
						? "border border-[#CDEEEE] bg-[#EDF8F8]"
						: "border border-[#F2F3F5] bg-[#F3F4F6]"
				}`}
			>
				<div className="text-[32px] leading-none">{emoji}</div>

				<p className="mt-4 text-[16px] leading-6 font-semibold tracking-tight text-hana-ez-600">
					{title}
				</p>

				{highlight ? (
					<p className="mt-1 text-[12px] leading-4.5 font-semibold tracking-snug text-hana-red-500">
						{highlight}
					</p>
				) : null}

				<p className="mt-1 text-[12px] leading-4.5 font-medium tracking-snug text-hana-black-700">
					{desc}
				</p>

				{subDesc ? (
					<p className="mt-1 text-[12px] leading-4.5 font-normal tracking-snug text-[#6A7282]">
						{subDesc}
					</p>
				) : null}
			</button>
		</div>
	);
}
