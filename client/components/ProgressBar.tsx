type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
  className?: string;
  barClassName?: string;
};

/**
 * 공통 프로그레스 바 컴포넌트
 */
export default function ProgressBar({
  currentStep,
  totalSteps,
  className = "",
  barClassName = "",
}: ProgressBarProps) {
  const progress = totalSteps > 0 ? Math.min(Math.max((currentStep / totalSteps) * 100, 0), 100) : 0;

  return (
    <div className={`h-[0.25rem] w-full shrink-0 bg-border ${className}`}>
      <div
        className={`h-full bg-primary transition-all duration-300 ${barClassName}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
