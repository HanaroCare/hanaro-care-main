'use client';

import { TriangleAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DualActionFooter from '@/components/modules/DualActionFooter';
import { formatKoreanAmount, parseKoreanAmount } from '@/app/asset/trust/trustUtils';
import TrustAmountList from '../TrustAmountList';
import TrustWizardStep from '../TrustWizardStep';

const items = [
  { id: 'hospital', title: '병원비 자동 집행', amount: '월 43만원' },
  { id: 'living', title: '생활비', amount: '월 100만원' },
];

export default function PayoutUseStep() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(
    new Set(['hospital', 'living']),
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const total = items
    .filter((item) => selected.has(item.id))
    .reduce((sum, item) => sum + parseKoreanAmount(item.amount), 0);

  return (
    <TrustWizardStep
      step={5}
      footer={
        <DualActionFooter
          leftLabel="지금 안할래요"
          rightLabel="다음으로"
          rightDisabled={selected.size === 0}
          onLeftClick={() => router.push('/asset/trust/result')}
          onRightClick={() => router.push('/asset/trust/select-agent')}
        />
      }
    >
      <div className="mt-14 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-bold text-[22px] text-black leading-[1.45] tracking-tight">
            어디에
            <br />
            사용할까요?
          </h2>
          <p className="mt-4 font-normal text-[#6A7282] text-[12px] leading-5 tracking-snug">
            병원비 계산기 결과가
            <br />
            자동 반영되었어요
          </p>
        </div>

        <div className="shrink-0 rounded-[28px] bg-[#FDEEEE] px-5 py-4">
          <div className="flex items-start gap-3">
            <TriangleAlert className="text-hana-red-500" />
            <p className="font-medium text-[12px] text-hana-red-500 leading-5 tracking-snug">
              집행 내역을
              <br />
              나중에 바꿀 수 있어요!
            </p>
          </div>
        </div>
      </div>

      <TrustAmountList
        className="mt-10"
        items={items}
        selected={selected}
        onToggle={toggle}
        totalLabel="월 집행 합계"
        formattedTotal={formatKoreanAmount(total)}
      />
    </TrustWizardStep>
  );
}
