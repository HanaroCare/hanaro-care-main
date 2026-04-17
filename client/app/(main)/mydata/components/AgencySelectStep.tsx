'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import {
  type AccountLinkItem,
  getConnectableAssets,
} from '../connect/actions/mydata';

type Category = 'bank' | 'card' | 'invest' | 'insurance';

function mapCategory(assetCateCd: string): Category {
  switch (assetCateCd) {
    case 'CASH':
    case 'PENSION':
      return 'bank';
    case 'CARD':
      return 'card';
    case 'STOCK':
      return 'invest';
    case 'INSURANCE':
      return 'insurance';
    default:
      return 'bank';
  }
}

/**
 * 기관 선택 화면 (개별 선택 모드)
 * GET /api/asset/link 로 실제 계좌 데이터를 불러와서 렌더링한다.
 */
export default function AgencySelectStep({
  onNext,
}: {
  onNext: (selectedIds: string[]) => void;
}) {
  const [selectedTab, setSelectedTab] = useState<Category>('bank');
  const [accounts, setAccounts] = useState<AccountLinkItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    getConnectableAssets().then((data) => {
      setAccounts(data);
      // 초기 상태: 전체 선택
      setSelectedIds(data.map((a) => a.accountId));
    });
  }, []);

  const toggleAgency = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const tabs: { id: Category; label: string }[] = [
    { id: 'bank', label: '은행' },
    { id: 'card', label: '카드' },
    { id: 'invest', label: '증권' },
    { id: 'insurance', label: '보험' },
  ];

  const filteredAccounts = accounts.filter(
    (a) => mapCategory(a.assetCateCd) === selectedTab,
  );

  return (
    <div className="flex flex-1 flex-col">
      <div className="mb-[1.5rem] px-[1.5rem] pt-[2rem]">
        <h2 className="font-bold text-[1.5rem] text-foreground leading-tight tracking-tight">
          연결할 기관을
          <br />
          선택해 주세요
        </h2>
      </div>

      <div className="relative flex border-border border-b px-[1rem]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedTab(tab.id)}
            className={`relative flex-1 py-[1rem] font-semibold text-[0.875rem] transition-colors ${selectedTab === tab.id ? 'text-primary' : 'text-muted-foreground'
              }`}
          >
            {tab.label}
            {selectedTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute right-0 bottom-0 left-0 h-[2px] bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-[0.75rem] overflow-y-auto px-[1.5rem] py-[1.5rem]">
        {filteredAccounts.length === 0 ? (
          <p className="py-[2rem] text-center text-[0.875rem] text-muted-foreground">
            해당 카테고리의 계좌가 없습니다.
          </p>
        ) : (
          filteredAccounts.map((account) => (
            <button
              key={account.accountId}
              type="button"
              onClick={() => toggleAgency(account.accountId)}
              className={`flex h-[5rem] w-full items-center justify-between rounded-[1rem] border px-[1.25rem] transition-all duration-200 ${selectedIds.includes(account.accountId)
                ? 'border-primary bg-primary/5 shadow-[0_4px_12px_rgba(0,132,133,0.08)]'
                : 'border-gray-200 bg-white'
                }`}
            >
              <div className="flex flex-col items-start text-left">
                <span
                  className={`font-semibold text-[1rem] ${selectedIds.includes(account.accountId)
                    ? 'text-primary'
                    : 'text-hana-black-800'
                    }`}
                >
                  {account.instNm}
                </span>
                <span className="mt-[0.25rem] text-[0.75rem] text-gray-400">
                  {account.accountNm}
                </span>
              </div>
              <div
                className={`flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full ${selectedIds.includes(account.accountId)
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 text-transparent'
                  }`}
              >
                <Check size={12} strokeWidth={4} />
              </div>
            </button>
          ))
        )}
      </div>

      <div className="p-[1.5rem] pb-[3rem]">
        <PrimaryButton
          label={`${selectedIds.length}개 기관 연결하기`}
          disabled={selectedIds.length === 0}
          onClick={() => onNext(selectedIds)}
        />
      </div>
    </div>
  );
}