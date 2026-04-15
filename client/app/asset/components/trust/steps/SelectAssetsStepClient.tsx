'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatKoreanAmount } from '@/app/asset/constants/trustUtils';
import { useTrustForm } from '@/app/asset/trust/TrustFormContext';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import TrustAmountList from '../TrustAmountList';
import TrustWizardStep from '../TrustWizardStep';

export type AssetItem = {
  id: string;
  title: string;
  rawAmount: number;
};

type Props = {
  items: AssetItem[];
};

export default function SelectAssetsStepClient({ items }: Props) {
  const router = useRouter();
  const { form, setSelectedAssets } = useTrustForm();
  const [selected, setSelected] = useState<Set<string>>(
    new Set(form.selectedAssets),
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const total = items
    .filter((a) => selected.has(a.id))
    .reduce((sum, a) => sum + a.rawAmount, 0);

  const displayItems = items.map((item) => ({
    id: item.id,
    title: item.title,
    amount: formatKoreanAmount(item.rawAmount),
  }));

  const handleNext = () => {
    setSelectedAssets(Array.from(selected), total);
    router.push('/asset/trust/start-timing');
  };

  return (
    <TrustWizardStep
      step={1}
      footer={
        <footer className="bg-white px-6 pt-10 pb-8">
          <PrimaryButton
            label="연결하기"
            disabled={selected.size === 0}
            onClick={handleNext}
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
        items={displayItems}
        selected={selected}
        onToggle={toggle}
        totalLabel="선택 합계"
        formattedTotal={formatKoreanAmount(total)}
      />
    </TrustWizardStep>
  );
}
