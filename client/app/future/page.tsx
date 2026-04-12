'use client';

import Link from 'next/link';
import MenuItem from './components/MenuItem';
import { Route } from 'next';
import { Heart, HeartHandshake, Gift, Leaf, ChevronRight } from 'lucide-react';

// 연명의료 결정
const LifeIcon = () => <Heart size={24} color="#D92626" strokeWidth={2} />;

// 새생명 나눔
const ShareIcon = () => <HeartHandshake size={24} color="#238C59" strokeWidth={2} />;

// 유산기부
const GiftIcon = () => <Gift size={24} color="#AA8109" strokeWidth={2} />;

// 나를 위한 지원제도
const SupportIcon = () => <Leaf size={20} color="white" strokeWidth={2} />;

const menuItems: { bgColor: string; icon: React.ReactNode; title: string; subtitle: string; href: Route }[] = [
  {
    bgColor: '#FBE9E9',
    icon: <LifeIcon />,
    title: '연명의료 결정',
    subtitle: '사전연명의료의향서를 작성하세요',
    href: '/future/advance-directive' as Route,
  },
  {
    bgColor: '#DEF5EA',
    icon: <ShareIcon />,
    title: '새생명 나눔',
    subtitle: '생명을 나누세요',
    href: '/future/organ-donation' as Route,
  },
  {
    bgColor: '#FDF4D8',
    icon: <GiftIcon />,
    title: '유산기부',
    subtitle: '당신의 이름이 희망이 됩니다',
    href: '/future/legacy-donation' as Route,
  },
];

export default function FuturePlanningPage() {
  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex flex-col gap-[2px] px-[25px] pt-[69px]">
        <h1 className="font-bold text-[28px] leading-[42px] text-[#101828]">미래설계</h1>
        <p className="font-normal text-[12px] leading-[18px] text-[#6A7282]">소중한 미래를 미리 준비하세요</p>
      </div>

      {/* 메뉴 리스트 */}
      <div className="flex flex-col gap-[47px] px-[25px] mt-[125px]">
        {menuItems.map((item) => (
          <MenuItem
            key={item.href}
            bgColor={item.bgColor}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            href={item.href}
          />
        ))}
      </div>

      {/* 나를 위한 지원제도 배너 */}
      <div className="absolute left-[25px] right-[25px] bottom-[80px]">
        <Link href={'/future/support' as Route}>
          <div
            className="relative flex items-center rounded-2xl overflow-hidden"
            style={{
              height: '101px',
              background: 'linear-gradient(90deg, #008585 0%, #02A3AC 100%)',
            }}
          >
            {/* 아이콘 배경 */}
            <div
              className="flex items-center justify-center rounded-xl ml-[18px] shrink-0"
              style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <SupportIcon />
            </div>

            {/* 텍스트 */}
            <div className="flex flex-col ml-4">
              <span className="font-medium text-[20px] leading-[22px] text-white">나를 위한 지원제도</span>
              <span className="font-normal text-[14px] leading-[18px] mt-1" style={{ color: 'rgba(255,255,255,0.8)' }}>
                맞춤 혜택 바로가기
              </span>
            </div>

            {/* 화살표 */}
            <div className="absolute right-[20px]">
              <ChevronRight size={20} color="white" strokeWidth={2} />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}