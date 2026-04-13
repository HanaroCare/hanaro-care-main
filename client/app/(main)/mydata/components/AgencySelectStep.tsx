'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';

type Category = 'bank' | 'card' | 'invest' | 'insurance';

type Agency = {
  id: string;
  name: string;
  description: string;
  category: Category;
};

const AGENCIES: Agency[] = [
  {
    id: '1',
    name: '하나은행',
    description: '하나원큐 카드, 저축예금 외 2개',
    category: 'bank',
  },
  {
    id: '2',
    name: '국민은행',
    description: 'KB마이핏통장, 주택청약종합저축',
    category: 'bank',
  },
  {
    id: '3',
    name: '신한은행',
    description: '신한 My Car 대출, 입출금통장',
    category: 'bank',
  },
  {
    id: '4',
    name: '하나카드',
    description: 'Any PLUS 카드, 원큐패스 카드',
    category: 'card',
  },
  {
    id: '5',
    name: '현대카드',
    description: 'M Edition3, ZERO Edition2',
    category: 'card',
  },
  {
    id: '6',
    name: '삼성카드',
    description: '삼성카드 taptap O, iD ON',
    category: 'card',
  },
  {
    id: '7',
    name: '하나증권',
    description: '주식 위탁 계좌, CMA 계좌',
    category: 'invest',
  },
  {
    id: '8',
    name: '미래에셋증권',
    description: '개인연금저축, 해외주식 계좌',
    category: 'invest',
  },
  {
    id: '9',
    name: '하나생명',
    description: '(무)하나가득 담은 암보험',
    category: 'insurance',
  },
  {
    id: '10',
    name: '삼성화재',
    description: '애니카 자동차보험, 통합보험',
    category: 'insurance',
  },
];

/**
 * 기관 선택 화면 (개별 선택 모드)
 */
export default function AgencySelectStep({ onNext }: { onNext: () => void }) {
  const [selectedTab, setSelectedTab] = useState<Category>('bank');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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

  const filteredAgencies = AGENCIES.filter((a) => a.category === selectedTab);

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
            className={`relative flex-1 py-[1rem] font-semibold text-[0.875rem] transition-colors ${
              selectedTab === tab.id ? 'text-primary' : 'text-muted-foreground'
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
        {filteredAgencies.map((agency) => (
          <button
            key={agency.id}
            type="button"
            onClick={() => toggleAgency(agency.id)}
            className={`flex h-[5rem] w-full items-center justify-between rounded-[1rem] border px-[1.25rem] transition-all duration-200 ${
              selectedIds.includes(agency.id)
                ? 'border-primary bg-primary/5 shadow-[0_4px_12px_rgba(0,132,133,0.08)]'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex flex-col items-start text-left">
              <span
                className={`font-semibold text-[1rem] ${selectedIds.includes(agency.id) ? 'text-primary' : 'text-hana-black-800'}`}
              >
                {agency.name}
              </span>
              <span className="mt-[0.25rem] text-[0.75rem] text-gray-400">
                {agency.description}
              </span>
            </div>
            <div
              className={`flex h-[1.25rem] w-[1.25rem] items-center justify-center rounded-full ${
                selectedIds.includes(agency.id)
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 text-transparent'
              }`}
            >
              <Check size={12} strokeWidth={4} />
            </div>
          </button>
        ))}
      </div>

      <div className="p-[1.5rem] pb-[3rem]">
        <PrimaryButton
          label={`${selectedIds.length}개 기관 연결하기`}
          disabled={selectedIds.length === 0}
          onClick={onNext}
        />
      </div>
    </div>
  );
}
