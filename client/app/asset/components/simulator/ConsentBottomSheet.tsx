'use client';

import { Check, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import BottomSheet from '@/components/BottomSheet';
import PrimaryButton from '@/components/button/PrimaryButton';

const CONSENT_ITEMS = [
  { id: 'personal', label: '개인정보 수집·이용 동의', required: true },
  { id: 'third-party', label: '개인정보 제3자 제공 동의', required: true },
  { id: 'id-info', label: '고유식별정보 처리 동의', required: true },
  { id: 'sensitive-info', label: '민감정보 처리에 관한 동의', required: true },
] as const;

type ConsentBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConsentBottomSheet({
  isOpen,
  onClose,
  onConfirm,
}: ConsentBottomSheetProps) {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const isAllChecked = checkedIds.length === CONSENT_ITEMS.length;
  const isRequiredChecked = CONSENT_ITEMS.every((item) =>
    checkedIds.includes(item.id),
  );

  const handleToggleAll = () => {
    setCheckedIds(isAllChecked ? [] : CONSENT_ITEMS.map((item) => item.id));
  };

  const handleToggleItem = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <header className="flex flex-col gap-1">
          <h2 className="font-bold text-[20px] text-hana-black-900 leading-tight">
            병원비를 줄여받으려면
            <br />
            동의가 필요해요
          </h2>
        </header>

        <div className="flex flex-col border-hana-silver-100 border-t pt-2">
          <ConsentRow
            isBold
            label="전체 동의하기"
            checked={isAllChecked}
            onClick={handleToggleAll}
            isCircle
          />

          <div className="flex flex-col gap-1">
            {CONSENT_ITEMS.map((item) => (
              <ConsentRow
                key={item.id}
                label={item.label}
                required={item.required}
                checked={checkedIds.includes(item.id)}
                onClick={() => handleToggleItem(item.id)}
                showDetail
              />
            ))}
          </div>
        </div>

        <footer className="flex flex-col gap-4">
          <PrimaryButton
            label="동의하고 시작하기"
            disabled={!isRequiredChecked}
            onClick={onConfirm}
          />
          <button
            type="button"
            onClick={onClose}
            className="text-center font-medium text-[14px] text-hana-black-400 underline underline-offset-4"
          >
            닫기
          </button>
        </footer>
      </div>
    </BottomSheet>
  );
}

function ConsentRow({
  label,
  checked,
  onClick,
  required,
  isBold,
  isCircle,
  showDetail,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  required?: boolean;
  isBold?: boolean;
  isCircle?: boolean;
  showDetail?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <button
        type="button"
        onClick={onClick}
        className="flex flex-1 items-center gap-3 text-left"
      >
        <div
          className={`flex h-6 w-6 items-center justify-center border-2 transition-all ${
            isCircle ? 'rounded-full' : 'rounded-[6px]'
          } ${checked ? 'border-hana-green-700 bg-hana-green-700' : 'border-hana-silver-200 bg-white'}`}
        >
          <Check
            size={16}
            className={checked ? 'text-white' : 'text-hana-silver-200'}
          />
        </div>
        <div className="flex items-center gap-1">
          {required && (
            <span className="font-semibold text-[14px] text-hana-green-700">
              [필수]
            </span>
          )}
          <span
            className={`text-[16px] ${isBold ? 'font-bold' : 'font-medium'} text-hana-black-600`}
          >
            {label}
          </span>
        </div>
      </button>
      {showDetail && (
        <span className="p-1 text-hana-black-200" aria-hidden="true">
          <ChevronRight size={20} />
        </span>
      )}
    </div>
  );
}
