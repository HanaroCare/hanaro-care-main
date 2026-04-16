'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Step1Intro from './components/Step1Intro';
import Step2SelectPerson from './components/Step2SelectPerson';
import Step3SelectPermissions from './components/Step3SelectPermissions';
import Step4Verification from './components/Step4Verification';
import Step5GenerateDocs from './components/Step5Generatedocs';
import Step6FindNotary from './components/Step6Findnotary';
import Step7Complete from './components/Step7Complete';
import type { GuardianData } from './types';

const TOTAL_STEPS = 7;

const getStepFromUrl = () =>
  Math.min(
    Math.max(
      Number(new URLSearchParams(window.location.search).get('step') ?? '0'),
      0,
    ),
    TOTAL_STEPS - 1,
  );

export default function GuardianPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [data, setData] = useState<GuardianData>({
    selectedPerson: null,
    relationship: '',
    permissions: [false, false, false, false, false],
    userName: '', // 이후 인증 단계나 유저 정보 API로 채움
    userPhone: '',
    verificationMethod: 'phone',
  });

  useEffect(() => {
    setStep(getStepFromUrl());

    const handlePop = () => setStep(getStepFromUrl());
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const next = () => {
    const nextStep = step + 1;
    router.push(`/my/guardian?step=${nextStep}`);
    setStep(nextStep);
    window.scrollTo(0, 0);
  };

  const prev = () => router.back();

  const goTo = (s: number) => {
    router.push(`/my/guardian?step=${s}`);
    setStep(s);
  };

  const updateData = (updates: Partial<GuardianData>) =>
    setData((d) => ({ ...d, ...updates }));

  const steps = [
    <Step1Intro key={0} onNext={next} />,
    <Step2SelectPerson
      key={1}
      data={data}
      onChange={updateData}
      onNext={next}
    />,
    <Step3SelectPermissions
      key={2}
      data={data}
      onChange={updateData}
      onNext={next}
    />,
    <Step4Verification
      key={3}
      data={data}
      onChange={updateData}
      onNext={next}
    />,
    <Step5GenerateDocs key={4} data={data} onNext={next} goTo={goTo} />,
    <Step6FindNotary key={5} onNext={next} />,
    <Step7Complete key={6} onPrev={prev} />,
  ];

  return (
    <div className="flex min-h-screen items-start justify-center bg-white">
      <div className="w-full">{steps[step]}</div>
    </div>
  );
}
