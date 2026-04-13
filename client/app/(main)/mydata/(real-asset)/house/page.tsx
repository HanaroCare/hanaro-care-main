'use client';

import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import PageDescription from '@/components/typography/PageDescription';
import PageHeading from '@/components/typography/PageHeading';

// 1. CheckItem을 외부로 분리하고 Props로 상태를 제어하도록 수정
interface CheckItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function CheckItem({ label, checked, onChange }: CheckItemProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-border-gray bg-white p-5 shadow-sm transition-all active:scale-[0.98]"
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
          checked ? 'bg-hana-teal-400' : 'bg-hana-silver-100'
        }`}
      >
        <Check
          className={`h-5 w-5 transition-opacity ${
            checked ? 'text-white opacity-100' : 'text-hana-black-500 opacity-0'
          }`}
        />
      </div>
      <span
        className={`text-left font-medium text-[17px] transition-colors ${
          checked ? 'text-hana-black-700' : 'text-hana-black-500'
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default function HouseMyDataPage() {
  const router = useRouter();

  // 2. 부모 컴포넌트에서 선택 상태를 관리 (인덱스 기반 예시)
  const checkList = [
    '보유 주택 정보 (종류, 면적, 소재지)',
    'KB 부동산 시세',
    '기존 대출 보유 여부',
  ];

  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(checkList.length).fill(true),
  );

  const handleCheckChange = (index: number) => {
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);
  };

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
        {checkList.map((item, index) => (
          <CheckItem
            key={item}
            label={item}
            checked={checkedItems[index]}
            onChange={() => handleCheckChange(index)}
          />
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <PrimaryButton
          label="다음으로"
          onClick={() => router.push('/mydata/house/detail')}
        />
        <PrimaryButton
          label="처음으로"
          variant="secondary"
          className="bg-hana-silver-100 text-hana-black-500!"
          onClick={() => router.push('/mydata/main')}
        />
      </div>
    </div>
  );
}
