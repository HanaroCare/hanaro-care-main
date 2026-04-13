'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import TermsModal from './TermsModal';

type ConsentStepProps = {
  onNext: () => void;
};

const TERMS_DATA = {
  terms: {
    title: '서비스 이용약관',
    content:
      '제1조 (목적)\n본 약관은 하나로케어 마이데이터 서비스의 이용과 관련하여 필요한 사항을 규정함을 목적으로 합니다.\n\n제2조 (용어의 정의)\n1. 마이데이터 서비스란 이용자의 금융 정보를 통합하여 관리하는 서비스를 말합니다.\n\n제3조 (서비스의 제공)\n본 서비스는 이용자의 동의 하에 정보를 수집하며...',
  },
  privacy: {
    title: '개인정보 수집 및 이용 동의',
    content:
      '1. 수집 항목: 성명, 휴대폰 번호, 금융 거래 내역 등\n2. 이용 목적: 자산 분석 및 관리 서비스 제공\n3. 보유 기간: 서비스 해지 시까지 (단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보존)',
  },
  thirdParty: {
    title: '제3자 제공 동의',
    content:
      '정보를 제공받는 자: 제휴 금융 기관\n제공하는 항목: 자산 정보, 입출금 내역 등\n제공 목적: 통합 자산 관리 및 개인화된 상품 추천',
  },
  mydata: {
    title: '마이데이터 서비스 통합 동의',
    content:
      '전 금융기관의 자산 정보를 한눈에 관리하기 위해 마이데이터 연동 서비스 이용에 동의합니다.',
  },
};

export default function ConsentStep({ onNext }: ConsentStepProps) {
  const [agreements, setAgreements] = useState({
    all: false,
    terms: true,
    privacy: true,
    thirdParty: false,
    mydata: true,
  });

  const [selectedTerms, setSelectedTerms] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const handleAllToggle = () => {
    const newValue = !agreements.all;
    setAgreements({
      all: newValue,
      terms: newValue,
      privacy: newValue,
      thirdParty: newValue,
      mydata: newValue,
    });
  };

  const handleToggle = (key: keyof typeof agreements) => {
    if (key === 'all') return;
    const newAgreements = { ...agreements, [key]: !agreements[key] };
    newAgreements.all =
      newAgreements.terms &&
      newAgreements.privacy &&
      newAgreements.thirdParty &&
      newAgreements.mydata;
    setAgreements(newAgreements);
  };

  const isRequiredAgreed =
    agreements.terms && agreements.privacy && agreements.mydata;

  return (
    <div className="flex flex-1 flex-col px-[1.5rem] pt-[4rem] pb-[3rem]">
      <div className="mb-[2.5rem]">
        <h2 className="font-bold text-[1.5rem] text-foreground leading-tight tracking-tight">
          마이데이터 연결을 위해
          <br />
          약관에 동의해 주세요
        </h2>
      </div>

      <div className="flex flex-col gap-[1.5rem]">
        <button
          type="button"
          onClick={handleAllToggle}
          className={`flex items-center gap-[0.75rem] rounded-[1rem] p-[1.25rem] transition-colors ${
            agreements.all
              ? 'border border-primary/20 bg-primary/5'
              : 'border border-transparent bg-gray-50'
          }`}
        >
          <div
            className={`flex h-[1.5rem] w-[1.5rem] items-center justify-center rounded-full ${
              agreements.all
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Check size={16} strokeWidth={3} />
          </div>
          <span className="font-bold text-[1.125rem] text-foreground">
            전체 동의하기
          </span>
        </button>

        <div className="flex flex-col gap-[1rem] px-[0.5rem]">
          {[
            { key: 'terms', label: '[필수] 서비스 이용약관 동의' },
            { key: 'privacy', label: '[필수] 개인정보 수집 및 이용 동의' },
            { key: 'thirdParty', label: '[선택] 제3자 제공 동의' },
            { key: 'mydata', label: '[필수] 마이데이터 서비스 통합 동의' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <button
                type="button"
                onClick={() =>
                  handleToggle(item.key as keyof typeof agreements)
                }
                className="flex items-center gap-[0.75rem]"
              >
                <Check
                  size={20}
                  className={
                    agreements[item.key as keyof typeof agreements]
                      ? 'text-primary'
                      : 'text-gray-300'
                  }
                />
                <span className="text-[1rem] text-hana-black-700">
                  {item.label}
                </span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedTerms(
                    TERMS_DATA[item.key as keyof typeof TERMS_DATA],
                  )
                }
                className="text-[0.875rem] text-muted-foreground underline underline-offset-2"
              >
                보기
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <PrimaryButton
          label="확인하기"
          disabled={!isRequiredAgreed}
          onClick={onNext}
        />
      </div>

      <TermsModal
        isOpen={!!selectedTerms}
        onClose={() => setSelectedTerms(null)}
        title={selectedTerms?.title || ''}
        content={selectedTerms?.content || ''}
      />
    </div>
  );
}
