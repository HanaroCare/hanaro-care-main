'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  formatKoreanAmount,
  parseKoreanAmount,
} from '@/app/asset/constants/trustUtils';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import TrustAmountList from '../TrustAmountList';
import TrustWizardStep from '../TrustWizardStep';

const assets = [
  { id: 'cash', title: '현금 / 예금', amount: '8,000만원' },
  { id: 'insurance', title: '보험 해지환급금', amount: '약 4,200만원' },
  { id: 'realestate', title: '부동산', amount: '10억원' },
];

export default function SelectAssetsStep() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const total = assets
    .filter((a) => selected.has(a.id))
    .reduce((sum, a) => sum + parseKoreanAmount(a.amount), 0);

  return (
    <TrustWizardStep
      step={1}
      footer={
        <footer className="bg-white px-6 pt-10 pb-8">
          <PrimaryButton
            label="연결하기"
            disabled={selected.size === 0}
            onClick={() => router.push('/asset/trust/start-timing')}
          />
        </footer>
      }
    >
      <div className="mt-12">
        <p className="font-bold text-[22px] text-black leading-[1.45] tracking-[-0.02em]">
          <span className="text-hana-ez-600">맡길 자산</span>을
          <br />
          선택해주세요
        </p>
        <p className="mt-3 text-[#6A7282] text-[15px]">
          마이데이터로 자동 조회했어요
        </p>
      </div>

      <TrustAmountList
        className="mt-6"
        items={assets}
        selected={selected}
        onToggle={toggle}
        totalLabel="선택 합계"
        formattedTotal={formatKoreanAmount(total)}
      />
    </TrustWizardStep>
  );
}
