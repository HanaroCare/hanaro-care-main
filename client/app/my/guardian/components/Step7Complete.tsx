'use client';

import { Check, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/PrimaryButton';

type Props = {
  onPrev: () => void;
};

const steps = [
  { label: '계약서 & 신청서 PDF 생성', status: 'done' },
  { label: '공증인 사무소 안내', status: 'done' },
  { label: '공증인 사무소 방문 & 공증', status: 'next', stepNum: 3 },
];

export default function Step7Complete({ onPrev }: Props) {
  const router = useRouter();
  return (
    <div>
      <div className="flex flex-col items-center pt-12 pb-4">
        {/* Success icon */}
        <div className="mb-5">
          <CheckCircle2 size={60} className="text-teal-500" strokeWidth={1.5} />
        </div>

        <h1 className="mb-2 text-center font-bold text-[24px] text-gray-900 leading-snug">
          임의후견인
          <br />
          등록이 완료됐어요
        </h1>
        <p className="mb-10 text-center text-[13px] text-gray-400 leading-relaxed">
          서류 생성 및 공증인 사무소
          <br />
          안내까지 완료됐어요
        </p>

        {/* Progress steps */}
        <div className="mb-8 w-full space-y-3">
          {steps.map(({ label, status, stepNum }) => (
            <div
              key={label}
              className={`flex items-center gap-3 rounded-2xl px-3 py-4 ${
                status === 'done'
                  ? 'bg-gray-50'
                  : 'border border-gray-100 bg-gray-50'
              }`}
            >
              {status === 'done' ? (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500">
                  <Check size={13} className="text-white" strokeWidth={2.5} />
                </div>
              ) : (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E0F7F4]">
                  <span className="font-bold text-[11px] text-hana-ez-600">
                    {stepNum}
                  </span>
                </div>
              )}
              <span
                className={`flex-1 font-medium text-[14px] ${
                  status === 'done' ? 'text-gray-800' : 'text-gray-500'
                }`}
              >
                {label}
              </span>
              <div className="flex items-center justify-center rounded-2xl bg-[#E0F7F4] px-2 py-1">
                <span className="font-medium text-[12px] text-teal-500">
                  {status === 'done' ? '완료' : '다음 단계'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Notice */}
        <div className="mb-auto flex w-full gap-2 rounded-xl bg-amber-50 px-4 py-3">
          <span className="mt-0.5 shrink-0 text-amber-400">💡</span>
          <p className="text-[12px] text-amber-700 leading-relaxed">
            생성된 PDF를 가지고 공증인 사무소를 방문하면 법적 효력이 완성돼요.
          </p>
        </div>
      </div>
      <PrimaryButton
        label={'홈으로 돌아가기'}
        onClick={() => router.push('/my')}
        className="mb-3"
      />
      <PrimaryButton
        onClick={onPrev}
        variant="disabled"
        className="mb-3"
        label={'공증 사무소 다시 보기'}
      />
    </div>
  );
}
