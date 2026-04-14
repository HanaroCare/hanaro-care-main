'use client';

import { Check } from 'lucide-react';

type CareMethodCardProps = {
  title: string;
  subtitle: string;
  Icon: React.ElementType;
  isSelected: boolean;
  onClick: () => void;
};

export function CareMethodCard({
  title,
  subtitle,
  Icon,
  isSelected,
  onClick,
}: CareMethodCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-18 w-full items-center rounded-2xl p-[12px_16px] shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-all ${
        isSelected ? 'bg-hana-green-50' : 'bg-white'
      }`}
    >
      <div
        className={`mr-4 flex size-10 items-center justify-center rounded-full transition-colors ${
          isSelected ? 'bg-hana-ez-600' : 'bg-hana-silver-100'
        }`}
      >
        <Icon
          size={20}
          className={isSelected ? 'text-white' : 'text-hana-black-700'}
          aria-hidden="true"
        />
      </div>

      <div className="flex flex-1 flex-col items-start">
        <span
          className={`font-semibold text-[16px] leading-6 transition-colors ${
            isSelected ? 'text-hana-ez-600' : 'text-hana-black-700'
          }`}
        >
          {title}
        </span>
        <span className="font-normal text-[14px] text-hana-black-900 leading-5.25">
          {subtitle}
        </span>
      </div>

      {isSelected && (
        <div className="flex size-5 items-center justify-center rounded-full bg-hana-ez-600">
          <Check
            size={12}
            className="text-white"
            strokeWidth={3}
            aria-hidden="true"
          />
        </div>
      )}
    </button>
  );
}
