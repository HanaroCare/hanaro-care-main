'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import PageDescription from '@/components/typography/PageDescription';
import PageHeading from '@/components/typography/PageHeading';

function CheckItem({ label }: { label: string }) {
  const [isChecked, setIsChecked] = useState(true);

  return (
    <button
      type="button"
      onClick={() => setIsChecked(!isChecked)}
      className="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-border-gray bg-white p-5 shadow-sm transition-all active:scale-[0.98]"
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
          isChecked ? 'bg-hana-teal-400' : 'bg-hana-silver-100'
        }`}
      >
        <Check
          className={`h-5 w-5 transition-opacity ${
            isChecked
              ? 'text-white opacity-100'
              : 'text-hana-black-500 opacity-0'
          }`}
        />
      </div>
      <span
        className={`text-left font-medium text-[17px] transition-colors ${
          isChecked ? 'text-hana-black-700' : 'text-hana-black-500'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default function HouseMyDataPage() {
  const checkList = [
    '보유 주택 정보 (종류, 면적, 소재지)',
    'KB 부동산 시세',
    '기존 대출 보유 여부',
  ];

  return (
    <div className="flex h-full flex-col px-6 pt-6 pb-12">
      <div className="mb-10">
        <ProgressBar step={1} total={6} />
      </div>

      <div className="mb-10">
        <PageHeading className="mb-4">
          <span className="text-hana-teal-500">주택 정보</span>를{'\n'}
          불러올게요
        </PageHeading>
        <PageDescription>
          마이데이터를 통해 보유 주택 정보와{'\n'}기존 대출 여부를 자동으로
          조회해요.
        </PageDescription>
      </div>

      <div className="flex flex-col gap-3">
        {checkList.map((item) => (
          <CheckItem key={item} label={item} />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <PrimaryButton
          label="다음으로"
          onClick={() => console.log('다음 클릭')}
        />
        <PrimaryButton
          label="처음으로"
          variant="secondary"
          className="bg-hana-silver-100 text-hana-black-500!"
          onClick={() => console.log('처음 클릭')}
        />
      </div>
    </div>
  );
}
