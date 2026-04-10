type TrustSkipNextFooterProps = {
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext?: () => void;
  onSkip?: () => void;
};

export default function TrustSkipNextFooter({
  nextLabel = "다음으로",
  nextDisabled = false,
  onNext,
  onSkip,
}: TrustSkipNextFooterProps) {
  return (
    <footer className="shrink-0 bg-white px-6 pb-8 pt-8">
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onSkip}
          className="h-18 flex-1 rounded-2xl bg-[#E9F8F9] text-[16px] leading-6 font-semibold tracking-tight text-hana-ez-600"
        >
          지금 안할래요
        </button>

        <button
          type="button"
          disabled={nextDisabled}
          onClick={onNext}
          className={`h-18 flex-1 rounded-2xl text-[16px] leading-6 font-semibold tracking-tight transition ${
            nextDisabled
              ? "bg-[#E5E7EB] text-[#9CA3AF]"
              : "bg-hana-ez-600 text-white"
          }`}
        >
          {nextLabel}
        </button>
      </div>
    </footer>
  );
}
