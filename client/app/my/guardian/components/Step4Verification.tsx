'use client';

import { Shield, Smartphone } from 'lucide-react';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import type { GuardianData } from '../types';

type Props = {
  data: GuardianData;
  onChange: (data: Partial<GuardianData>) => void;
  onNext: () => void;
};

const methods = [
  {
    id: 'phone',
    icon: Smartphone,
    title: '휴대폰 인증',
    desc: '문자 인증번호로 본인 확인',
    color: 'text-teal-500',
  },
  {
    id: 'hana',
    icon: Shield,
    title: '하나인증서',
    desc: '패턴·지문·Face ID로 간편 인증',
    color: 'text-blue-500',
  },
];

export default function Step4Verification({ data, onChange, onNext }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onNext();
  };

  if (isLoading) {
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
      <div className="pt-6 pb-4">
        <div className="mt-3 mb-8 h-0.5 bg-gray-100">
          <div className="-translate-y-1/2 top-1/2 h-1 w-60 bg-hana-green-700" />
        </div>
        <div className="mb-8">
          <h1 className="font-bold text-[24px] text-gray-900 leading-snug">
            등록 전<br />
            본인인증을 해주세요
          </h1>
          <p className="mt-2 text-[13px] text-gray-400 leading-relaxed">
            임의후견인 등록은 법적 효력이 있는 서류예요,
            <br />
            반드시 본인 확인이 필요해요
          </p>
        </div>

        <p className="mb-3 font-medium text-[13px] text-gray-500">
          인증 방법 선택
        </p>

        <div className="mb-6 space-y-3">
          {methods.map(({ id, icon: Icon, title, desc, color }) => {
            const selected = data.verificationMethod === id;
            return (
              <button
                type="button"
                key={id}
                onClick={() => onChange({ verificationMethod: id })}
                className={`flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-5 transition-all ${
                  selected
                    ? 'border-hana-green-700 bg-[#E0F7F4]'
                    : 'border-gray-100'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-hana-ez-50">
                  <span className="font-bold text-4 text-hana-ez-600">
                    <Icon size={20} className={color} />
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-[15px] text-gray-800">
                    {title}
                  </p>
                  <p className="mt-0.5 text-[12px] text-gray-500">{desc}</p>
                </div>

                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    selected ? 'border-hana-green-700' : 'border-gray-300'
                  }`}
                >
                  {selected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-hana-green-700" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Notice */}
        <div className="mb-10 rounded-xl bg-gray-50 px-4 py-3 text-[12px] text-gray-500 leading-relaxed">
          인증 완료 후 공증 절차가 필요해요. <p />
          법무사 연결은 H Lounge에서 도와드려요.
        </div>
      </div>

      <PrimaryButton onClick={handleVerify} label={'인증하고 등록 완료'} />
    </div>
  );
}
