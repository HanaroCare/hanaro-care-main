type TrustProgressBarProps = {
  step: number;
  total?: number;
};

export default function TrustProgressBar({ step, total = 6 }: TrustProgressBarProps) {
  const progress = (step / total) * 100;
  return (
    <div className="h-1 w-full rounded-full bg-[#F4F3ED]">
      <div
        className="h-1 rounded-full bg-hana-ez-600 transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
