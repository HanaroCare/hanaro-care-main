// app/myhana/family/share/page.tsx
'use client';

import { useState } from 'react';
import ProgressHeader from './_components/ProgressHeader';
import Step1Auth from './_components/Step1Auth';
import Step2Terms from './_components/Step2Terms';
import Step3List from './_components/Step3List';
import Step4Done from './_components/Step4Done';

export default function InsuranceShareFlow() {
  const [step, setStep] = useState(1);
  
  // 다음 단계로 이동 함수
  const nextStep = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    }
  };

  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        {/* 공통 상단 헤더 및 진행 바 (4단계에서는 표시하지 않음) */}
        {step < 4 && <ProgressHeader step={step} />}

        {/* 단계별 화면 컴포넌트 렌더링 */}
        <main className="app-main no-scrollbar bg-white flex flex-col">
          {step === 1 && <Step1Auth onNext={nextStep} />}
          {step === 2 && <Step2Terms onNext={nextStep} />}
          {step === 3 && <Step3List onNext={nextStep} />}
          {step === 4 && <Step4Done />}
        </main>
      </div>
    </div>
  );
}
