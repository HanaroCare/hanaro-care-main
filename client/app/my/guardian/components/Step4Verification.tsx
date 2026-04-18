'use client';

import { useEffect, useState } from 'react';
import type { GuardianData } from '../types/types';
import MethodSelect from './MethodSelect';
import PhoneAuth from './PhoneAuth';

type Method = 'phone' | 'hana' | null;
type Step = 'select' | 'auth';

type Props = {
  data: GuardianData;
  onChange: (data: Partial<GuardianData>) => void;
  onNext: () => void;
};

export default function Step4Verification({ data, onChange, onNext }: Props) {
  const [method, setMethod] = useState<Method>((data.verificationMethod as Method) ?? null);
  const [step, setStep] = useState<Step>('select');
  const [isCertLoading, setIsCertLoading] = useState(false);
  const [authType, setAuthType] = useState<string | null>(null);

  useEffect(() => {
    setAuthType(localStorage.getItem('AUTH_TYPE'));
  }, []);

  const isHanaBlocked = method === 'hana' && authType !== 'HANA_CERT';

  const handleSelectNext = async () => {
    if (!method || isHanaBlocked) return;
    setStep('auth');

    if (method === 'hana') {
      setIsCertLoading(true);
      await new Promise((r) => setTimeout(r, 1500));
      setIsCertLoading(false);
      onNext();
    }
  };

  const handleMethodChange = (m: Method) => {
    setMethod(m);
    onChange({ verificationMethod: m ?? undefined });
  };

  if (isCertLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
        <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-hana-green-700" />
        <p className="font-semibold text-[16px] text-gray-800">인증 중이에요</p>
        <p className="mt-1 text-[13px] text-gray-400">잠시만 기다려 주세요</p>
      </div>
    );
  }

  return (
    <div>
      {step === 'select' && (
        <MethodSelect
          method={method}
          isHanaBlocked={isHanaBlocked}
          onChange={handleMethodChange}
          onNext={handleSelectNext}
        />
      )}
      {step === 'auth' && method === 'phone' && (
        <PhoneAuth
          onPhoneConfirmed={(phone) => onChange({ userPhone: phone })}
          onNext={onNext}
        />
      )}
    </div>
  );
}