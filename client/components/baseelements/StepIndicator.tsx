'use client';

type StepIndicatorProps = {
  totalSteps: number;
  currentStep: number;
  idPrefix: string;
};

export function StepIndicator({
  totalSteps,
  currentStep,
  idPrefix,
}: StepIndicatorProps) {
  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={`${idPrefix}-step-${index + 1}`}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === currentStep
              ? 'w-4 bg-hana-green-700'
              : 'w-2 bg-hana-black-100'
          }`}
        />
      ))}
    </div>
  );
}
