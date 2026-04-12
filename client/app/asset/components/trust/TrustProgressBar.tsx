import ProgressBar from "@/components/ProgressBar";

type TrustProgressBarProps = {
  step: number;
  total?: number;
};

export default function TrustProgressBar({ step, total = 6 }: TrustProgressBarProps) {
  return (
    <ProgressBar 
      currentStep={step} 
      totalSteps={total} 
      className="bg-[#F4F3ED] h-1 rounded-full"
      barClassName="bg-hana-ez-600 h-1 rounded-full"
    />
  );
}
