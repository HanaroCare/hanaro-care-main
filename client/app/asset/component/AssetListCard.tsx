'use client';

import { ChevronRight } from 'lucide-react';

type AssetType = 'bank' | 'stock' | 'pension' | 'card';

type AssetItemData = {
  id: string;
  institution: string;
  name: string;
  amount: string;
  change?: string;
  changePercent?: string;
  isPositive?: boolean;
  type: AssetType;
};

const ASSET_ITEMS: AssetItemData[] = [
  {
    id: '1',
    institution: '하나은행',
    name: '하나원큐 정기예금',
    amount: '2,800만원',
    change: '12만원',
    changePercent: '0.1%',
    isPositive: true,
    type: 'bank',
  },
  {
    id: '2',
    institution: '하나증권',
    name: '삼성전자 100주',
    amount: '7,200만원',
    change: '12만원',
    changePercent: '0.1%',
    isPositive: true,
    type: 'stock',
  },
  {
    id: '3',
    institution: '하나은행',
    name: '적립식 펀드',
    amount: '1,500만원',
    change: '12만원',
    changePercent: '0.1%',
    isPositive: true,
    type: 'bank',
  },
  {
    id: '4',
    institution: '국민연금',
    name: '국민연금 수령 예정',
    amount: '2,300만원',
    type: 'pension',
  },
  {
    id: '5',
    institution: '하나카드',
    name: '하나마나카드 사용금액',
    amount: '680만원',
    type: 'card',
  },
];

const ICON_STYLES: Record<AssetType, string> = {
  bank: 'bg-hana-teal-100',
  stock: 'bg-hana-teal-100',
  pension: 'bg-hana-yellow-100',
  card: 'bg-hana-teal-100',
};

type AssetIconProps = {
  type: AssetType;
};

function AssetIcon({ type }: AssetIconProps) {
  return (
    <div
      className={`flex size-8 items-center justify-center rounded-[10px] ${ICON_STYLES[type]}`}
    >
      {type === 'pension' ? (
        <div className="size-5 rounded-full bg-white/50" />
      ) : (
        <div className="size-5 rounded-sm bg-white/50" />
      )}
    </div>
  );
}

type ChangeIndicatorProps = {
  change: string;
  changePercent: string;
  isPositive: boolean;
};

function ChangeIndicator({
  change,
  changePercent,
  isPositive,
}: ChangeIndicatorProps) {
  return (
    <div
      className={`flex items-center gap-1 font-medium text-[12px] ${
        isPositive ? 'text-hana-red-500' : 'text-hana-blue-500'
      }`}
    >
      <svg
        width="7"
        height="6"
        viewBox="0 0 7 6"
        fill="none"
        aria-hidden="true"
        className={isPositive ? '' : 'rotate-180'}
      >
        <path d="M3.5 0L7 6L0 6L3.5 0Z" fill="currentColor" />
      </svg>
      <span>
        {change} ({changePercent})
      </span>
    </div>
  );
}

export function AssetListCard() {
  return (
    <div className="w-81.25 rounded-[16px] border border-border-gray bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-6">
        {ASSET_ITEMS.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AssetIcon type={item.type} />
              <div className="flex flex-col">
                <span className="text-[12px] text-hana-black-500 leading-tight">
                  {item.institution}
                </span>
                <span className="font-medium text-[15px] text-hana-black-900 leading-tight">
                  {item.name}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-medium text-[15px] text-hana-black-900 leading-tight">
                {item.amount}
              </span>
              {item.change && item.changePercent && (
                <ChangeIndicator
                  change={item.change}
                  changePercent={item.changePercent}
                  isPositive={item.isPositive ?? true}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-6 flex w-full items-center justify-center gap-1 py-1 text-[13px] text-hana-black-500"
      >
        더보기 <ChevronRight size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
