'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  formatKoreanAmount,
  parseKoreanAmount,
} from '@/app/asset/constants/trustUtils';
import { AlertBanner } from '@/components/modules/AlertBanner'; // 중괄호 사용 확인
import DualActionFooter from '@/components/modules/DualActionFooter';
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
          onLeftClick={() => router.push('/asset/trust/select-agent')}
          onRightClick={() => router.push('/asset/trust/select-agent')}
        />
      }
    >
      <div className="mt-12">
        <h2 className="font-bold text-[22px] text-black leading-[1.45] tracking-tight">
          어디에
          <br />
          사용할까요?
        </h2>

        <div className="mt-8 flex justify-center">
          <AlertBanner
            variant="info"
            message="선택지에 병원비 계산 결과가 반영되었어요"
          />
        </div>
      </div>

      <TrustAmountList
        className="mt-5"
        items={items}
        selected={selected}
        onToggle={toggle}
        totalLabel="월 집행 합계"
        formattedTotal={formatKoreanAmount(total)}
      />
    </TrustWizardStep>
  );
}
