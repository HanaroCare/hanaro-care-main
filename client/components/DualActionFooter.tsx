import PrimaryButton from "./PrimaryButton";

type DualActionFooterProps = {
	leftLabel: string;
	rightLabel: string;
	onLeftClick?: () => void;
	onRightClick?: () => void;
	leftDisabled?: boolean;
	rightDisabled?: boolean;
	className?: string;
};

export default function DualActionFooter({
	leftLabel,
	rightLabel,
	onLeftClick,
	onRightClick,
	leftDisabled = false,
	rightDisabled = false,
	className = "",
}: DualActionFooterProps) {
	return (
		<footer
			className={`flex shrink-0 gap-3 bg-white px-6 pb-8 pt-10 ${className}`}
		>
			<PrimaryButton
				label={leftLabel}
				variant="secondary"
				disabled={leftDisabled}
				onClick={onLeftClick}
				className="h-14 flex-1 rounded-2xl text-[17px] leading-6"
			/>

			<PrimaryButton
				label={rightLabel}
				variant="primary"
				disabled={rightDisabled}
				onClick={onRightClick}
				className="h-14 flex-1 rounded-2xl text-[17px] leading-6"
			/>
		</footer>
	);
}
