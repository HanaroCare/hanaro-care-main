'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Route } from 'next';
import Header from '@/components/Header';

type Tab = 'local' | 'hana';

interface SupportItem {
  id: number;
  title: string;
  description: string;
  tab: Tab;
}

const supportItems: SupportItem[] = [
  {
    id: 1,
    title: '돌봄플러스 케어',
    description: '65세 이상 독거노인 대상 맞춤형 돌봄 서비스입니다. 주 3회 방문 케어를 제공합니다.',
    tab: 'local',
  },
  {
    id: 2,
    title: '노인 맞춤 돌봄',
    description: '일상생활 지원이 필요한 어르신에게 안전지원, 사회참여 서비스를 제공합니다.',
    tab: 'local',
  },
  {
    id: 3,
    title: '치매안심센터 지원',
    description: '치매 조기 검진 및 예방, 치매 환자 및 가족 지원 서비스를 제공합니다.',
    tab: 'local',
  },
  {
    id: 4,
    title: '노인 의료비 지원',
    description: '저소득 어르신 대상 의료비 본인부담금 지원 서비스입니다.',
    tab: 'local',
  },
  {
    id: 5,
    title: '하나 더 넥스트 케어',
    description: '하나은행 고객 대상 프리미엄 시니어 케어 서비스입니다.',
    tab: 'hana',
  },
  {
    id: 6,
    title: '하나 시니어 클럽',
    description: '60세 이상 하나은행 고객을 위한 맞춤형 금융·생활 서비스입니다.',
    tab: 'hana',
  },
];

export default function SupportPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('local');
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filtered = supportItems.filter((item) => item.tab === activeTab);

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <Header title="나를 위한 제도" />

      <div className="pt-[65px]">
        {/* 탭 */}
        <div className="flex flex-row w-full h-[47px] border-b border-[#E3E5E8]">
          <button
            onClick={() => setActiveTab('local')}
            className="flex-1 flex items-center justify-center relative transition-colors duration-200"
          >
            <span
              className="font-medium text-[15px] leading-[22px] transition-colors duration-200"
              style={{ color: activeTab === 'local' ? '#008485' : '#3E454C' }}
            >
              지자체
            </span>
            {activeTab === 'local' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008485] transition-all duration-300" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('hana')}
            className="flex-1 flex items-center justify-center relative transition-colors duration-200"
          >
            <span
              className="font-medium text-[15px] leading-[22px] transition-colors duration-200"
              style={{ color: activeTab === 'hana' ? '#008485' : '#3E454C' }}
            >
              하나 the next
            </span>
            {activeTab === 'hana' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#008485] transition-all duration-300" />
            )}
          </button>
        </div>

        {/* 카드 리스트 */}
        <div
          key={activeTab}
          className="flex flex-col gap-[15px] px-[24px] mt-[30px] pb-[30px]"
          style={{ animation: 'fadeSlideIn 0.25s ease-out' }}
        >
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(`/future/support/detail/${item.id}` as Route)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex flex-row items-center justify-between w-full h-[97px] px-[17px] border border-[#E3E5E8] rounded-xl text-left transition-colors duration-200"
              style={{ backgroundColor: hoveredId === item.id ? '#F0FAFA' : '#FFFFFF' }}
            >
              <div className="flex flex-col gap-[4px] flex-1 pr-[10px]">
                <span className="font-medium text-[18px] leading-[22px] text-[#1A212D]">{item.title}</span>
                <span className="font-normal text-[12px] leading-[18px] text-[#535C6A] line-clamp-2">
                  {item.description}
                </span>
              </div>
              <ChevronRight size={20} color="#535C6A" />
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}