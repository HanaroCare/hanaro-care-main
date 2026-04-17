import PrimaryButton from '../baseelements/PrimaryButton';

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
  className = '',
}: DualActionFooterProps) {
  const isLeftDisabled = leftDisabled || !onLeftClick;
  const isRightDisabled = rightDisabled || !onRightClick;
  return (
    <footer
      className={`flex shrink-0 gap-3 bg-white px-6 pt-10 pb-8 ${className}`}
    >
      <PrimaryButton
        label={leftLabel}
        variant="warning"
        disabled={isLeftDisabled}
        onClick={onLeftClick}
        className="h-14 flex-1 rounded-2xl text-[17px] leading-6"
      />

      <PrimaryButton
        label={rightLabel}
        variant="primary"
        disabled={isRightDisabled}
        onClick={onRightClick}
        className="h-14 flex-1 rounded-2xl text-[17px] leading-6"
      />
    </footer>
  );
}
