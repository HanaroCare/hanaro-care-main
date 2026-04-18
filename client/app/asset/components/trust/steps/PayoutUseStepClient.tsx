'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  type PayoutAmounts,
  type PayoutItemValue,
  useTrustForm,
} from '@/app/asset/trust/TrustFormContext';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import TrustWizardStep from '../TrustWizardStep';

type Props = {
  hospitalAmount: number;
  livingAmount: number;
  showCalculatorAlert?: boolean;
};

const options: {
  id: PayoutItemValue;
  title: string;
}[] = [
  {
    id: 'hospital',
    title: '병원비 자동 집행',
  },
  {
    id: 'living',
    title: '생활비',
  },
];

export default function PayoutUseStepClient({
  hospitalAmount,
  livingAmount,
  showCalculatorAlert = false,
}: Props) {
  const router = useRouter();
  const { form, setPayoutItems } = useTrustForm();

  const [selectedItems, setSelectedItems] = useState<PayoutItemValue[]>(
    (form.payoutItems ?? []).filter(
      (item): item is PayoutItemValue =>
        item === 'hospital' || item === 'living',
    ),
  );
  const toggleItem = (id: PayoutItemValue) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const totalAmount = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      if (item === 'hospital') return sum + hospitalAmount;
      if (item === 'living') return sum + livingAmount;
      return sum;
    }, 0);
  }, [selectedItems, hospitalAmount, livingAmount]);

  const handleNext = () => {
    const amounts: PayoutAmounts = {
      hospital: hospitalAmount,
      living: livingAmount,
    };

    setPayoutItems(selectedItems, amounts);
    router.push('/asset/trust/select-agent');
  };

  return (
    <TrustWizardStep
      step={5}
      footer={
        <footer className="shrink-0 bg-white px-6 pt-10 pb-8">
          <PrimaryButton
            label="다음으로"
            disabled={selectedItems.length === 0}
            onClick={handleNext}
          />
        </footer>
      }
    >
      <div className="mt-12">
        <p className="font-bold text-[22px] leading-[1.45] tracking-tight text-black">
          신탁 자금을 어디에
          <br />
          사용할까요?
        </p>
      </div>

      {showCalculatorAlert && (
        <div className="mt-10 rounded-[16px] border border-[#D7F0EC] bg-[#F3FBFA] px-4 py-3">
          <p className="text-[14px] leading-5 font-medium text-hana-ez-600">
            선택지에 병원비 계산기 결과가 반영되었습니다.
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-5">
        {options.map((option) => {
          const isSelected = selectedItems.includes(option.id);
          const amount =
            option.id === 'hospital' ? hospitalAmount : livingAmount;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleItem(option.id)}
              aria-pressed={isSelected}
              className={`flex min-h-20 items-center justify-between rounded-[24px] px-6 py-7 text-left shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition ${
                isSelected
                  ? 'border border-hana-ez-600 bg-[#EFFFFD]'
                  : 'border border-[#F2F3F5] bg-white'
              }`}
            >
              <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                {option.title}
              </p>

              <p
                className={`text-[16px] leading-6 font-medium tracking-tight ${
                  isSelected ? 'text-hana-ez-600' : 'text-[#1F2937]'
                }`}
              >
                월 {Math.round(amount / 10000).toLocaleString()}만원
              </p>
            </button>
          );
        })}
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-6 rounded-[20px] bg-[#EFF8F7] px-6 py-7">
          <div className="flex items-center justify-between">
            <span className="text-[16px] leading-6 font-semibold tracking-tight text-hana-ez-600">
              월 집행 합계
            </span>
            <span className="text-[22px] leading-8 font-bold tracking-tight text-hana-ez-600">
              {Math.round(totalAmount / 10000).toLocaleString()}만원
            </span>
          </div>
        </div>
      )}
    </TrustWizardStep>
  );
}
