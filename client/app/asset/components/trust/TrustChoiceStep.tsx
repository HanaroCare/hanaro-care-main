import type { ReactNode } from "react";
import TrustChoiceCard from "./TrustChoiceCard";

type ChoiceItem = {
	id: string;
	emoji: string;
	title: string;
	desc: string;
	subDesc?: string;
	highlight?: string;
	recommended?: boolean;
};

type TrustChoiceStepProps = {
	question: ReactNode;
	options: readonly ChoiceItem[];
	selected: string | null;
	onSelect: (id: string) => void;
	infoBox?: {
		title: string;
		desc: string;
	};
};

export default function TrustChoiceStep({
	question,
	options,
	selected,
	onSelect,
	infoBox,
}: TrustChoiceStepProps) {
	return (
		<>
			<div className="mt-14">
				<h2 className="text-[22px] leading-[1.45] font-bold tracking-tight text-black">
					{question}
				</h2>
			</div>

			<div className="mt-28 grid grid-cols-2 gap-4">
				{options.map((option) => (
					<TrustChoiceCard
						key={option.id}
						emoji={option.emoji}
						title={option.title}
						desc={option.desc}
						subDesc={option.subDesc}
						highlight={option.highlight}
						recommended={option.recommended}
						selected={selected === option.id}
						onClick={() => onSelect(option.id)}
					/>
				))}
			</div>

			{infoBox ? (
				<div className="mt-8 rounded-4xl bg-[#EDF8F8] px-6 py-5">
					<p className="text-[14px] leading-5 font-semibold tracking-tight text-hana-ez-600">
						{infoBox.title}
					</p>
					<p className="mt-3 text-[12px] leading-5 font-normal tracking-snug text-hana-ez-600">
						{infoBox.desc}
					</p>
				</div>
			) : null}
		</>
	);
}
