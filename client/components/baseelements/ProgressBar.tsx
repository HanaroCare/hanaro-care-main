type ProgressBarProps = {
  step: number;
  total?: number;
};

export default function ProgressBar({ step, total = 6 }: ProgressBarProps) {
  const progress = (step / total) * 100;
  return (
    <div className="bg-[#F4F3ED] h-1 rounded-full w-full">
      <div
        className="bg-hana-ez-600 h-1 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}