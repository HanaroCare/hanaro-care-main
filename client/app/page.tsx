'use client';

import { NavigationBar } from '@/components/NavigationBar';
import { AssetDashboard } from './asset/component/AssetDashboard';
import { BannerCard } from './asset/component/BannerCard';

export default function Home() {
  const BANNERS = [
    {
      id: 'change',
      title: (
        <>
          남노인 손님,{'\n'}병원비 부담이{' '}
          <span className="text-hana-red-500">30%</span> 줄었네요
        </>
      ),
      buttonText: '확인하러 가기',
      imageSrc: '/images/asset/asset-big-change.svg',
    },
  ];

  return (
    // 전체 배경색과 하단 네비게이션 공간(pb-24) 확보
    <div className="min-h-screen bg-zinc-50 pb-24 font-sans">
      <div className="mx-auto flex max-w-[375px] flex-col items-center gap-6 px-6 pt-10">
        {/* 상단 배너 섹션 */}
        <BannerCard
          title={BANNERS[0].title}
          buttonText={BANNERS[0].buttonText}
          imageSrc={BANNERS[0].imageSrc}
          onClick={() => console.log('자산 변동 확인')}
        />

        {/* 자산 대시보드 */}
        <AssetDashboard />
      </div>

      {/* 하단 네비게이션 바 */}
      <NavigationBar />
    </div>
  );
}
