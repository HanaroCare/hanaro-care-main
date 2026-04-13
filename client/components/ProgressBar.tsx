type ProgressBarProps = {
  progress: number; // 0 to 100
  className?: string;
  barClassName?: string;
};

/**
 * 공통 프로그레스 바 컴포넌트
 */
export default function ProgressBar({
  progress,
  className = "",
  barClassName = "",
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`h-[0.5rem] w-full overflow-hidden rounded-full bg-border ${className}`}>
      <div
        className={`h-full bg-primary transition-all duration-300 ${barClassName}`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
}
