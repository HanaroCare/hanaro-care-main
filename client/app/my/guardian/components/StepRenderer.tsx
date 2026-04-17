'use client';

import type { GuardianData } from '../types/types';
import Step1Intro from './Step1Intro';
import Step2SelectPerson from './Step2SelectPerson';
import Step3SelectPermissions from './Step3SelectPermissions';
import Step4Verification from './Step4Verification';
import Step5GenerateDocs from './Step5Generatedocs';
import Step6FindNotary from './Step6Findnotary';
import Step7Complete from './Step7Complete';

interface Props {
  step: number;
  data: GuardianData;
  updateData: (updates: Partial<GuardianData>) => void;
  next: () => void;
  prev: () => void;
  goTo: (s: number) => void;
}

export default function GuardianStepRenderer({
  step,
  data,
  updateData,
  next,
  prev,
  goTo,
}: Props) {
  switch (step) {
    case 0:
      return <Step1Intro onNext={next} />;
    case 1:
      return (
        <Step2SelectPerson data={data} onChange={updateData} onNext={next} />
      );
    case 2:
      return (
        <Step3SelectPermissions
          data={data}
          onChange={updateData}
          onNext={next}
        />
      );
    case 3:
      return (
        <Step4Verification data={data} onChange={updateData} onNext={next} />
      );
    case 4:
      return <Step5GenerateDocs data={data} onNext={next} goTo={goTo} />;
    case 5:
      return <Step6FindNotary onNext={next} />;
    case 6:
      return <Step7Complete onPrev={prev} />;
    default:
      return null;
  }
}
