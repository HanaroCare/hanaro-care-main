import PrimaryButton from "@/components/baseelements/PrimaryButton";

type StackedActionFooterProps = {
	consultLabel?: string;
	nextLabel?: string;
	onConsultClick?: () => void;
	onNextClick?: () => void;
	consultDisabled?: boolean;
	nextDisabled?: boolean;
	className?: string;
};

export default function StackedActionFooter({
	consultLabel = "상담 예약하기",
	nextLabel = "다음으로",
	onConsultClick,
	onNextClick,
	consultDisabled = false,
	nextDisabled = false,
	className = "",
}: StackedActionFooterProps) {
	return (
		<footer className={`shrink-0 bg-white px-6 py-4 ${className}`}>
			<div className="flex flex-col gap-3">
				<PrimaryButton
					label={consultLabel}
					disabled={consultDisabled}
					onClick={onConsultClick}
					className="h-14 rounded-2xl text-[16px] leading-6"
				/>
				<PrimaryButton
					label={nextLabel}
					disabled={nextDisabled}
					onClick={onNextClick}
					className="h-14 rounded-2xl text-[16px] leading-6"
				/>
			</div>
		</footer>
	);
}
