'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { TabNavigation } from '@/components/navigation/TabNavigation';

// 공통 컴포넌트 import
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { StepIndicator } from '@/components/baseelements/StepIndicator';
import PageHeading from "@/components/typography/PageHeading";
import PageDescription from '@/components/typography/PageDescription';

const SLIDES = [
  {
    idx: 0,
    image: '/images/inheritance/intro-slide-1.png',
    title: '상속 설계란?',
    description: '내 자산을 기반으로\n법적으로 안전한 상속 계획을 세워드려요',
  },
  {
    idx: 1,
    image: '/images/inheritance/intro-slide-2.png',
    title: '법정상속분 vs 유류분',
    description: '두가지 기준을 한눈에 비교하고\n내 설계가 법적으로 안전한지 확인해요',
  },
  {
    idx: 2,
    image: '/images/inheritance/intro-slide-3.png',
    title: '가족을 위한 나만의 상속설계',
    description: '유언대용신탁을 통해 법적 효력을 갖추고\n소중한 분들에게 마음을 전해요',
  },
];

export default function InheritanceIntroPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('inheritance');
  const router = useRouter();

  const goNext = () => setActiveSlide((s) => Math.min(s + 1, SLIDES.length - 1));
  const goPrev = () => setActiveSlide((s) => Math.max(s - 1, 0));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'asset') {
      router.push('/asset/simulator');
    } else if (tabId === 'inheritance') {
      router.push('/inheritance/intro');
    }
  };

  return (
      <div className="app-shell bg-white">
        <div className="app-layout">
          {/* 1. 상단 탭 */}
          <TabNavigation
              tabs={[
                { id: 'asset', label: '자산' },
                { id: 'inheritance', label: '상속' },
              ]}
              activeTab={activeTab}
              onTabChange={handleTabChange}
          />

          {/* 2. 메인 컨텐츠 영역 */}
          <main className="flex flex-1 flex-col px-6">
            <header className="shrink-0 pt-8 pb-6 text-left">
              <PageHeading className="mb-2 !text-left text-2xl font-bold">
                <span className="text-hana-ez-600">상속설계</span>로{'\n'}
                소중한 사람을 지켜요
              </PageHeading>
              <PageDescription className="!text-left text-base">
                마이데이터로 자산을 연동해{'\n'}나만의 상속 계획을 세울 수 있어요
              </PageDescription>
            </header>

            <p className="mb-4 shrink-0 font-bold text-lg text-hana-black-800">
              상속설계 안내
            </p>

            {/* 캐러셀 영역 */}
            <div className="relative mb-6 min-h-[320px]">
              <div className="flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-sm">
                <div
                    className="flex flex-1 transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {SLIDES.map((s, i) => (
                      <div
                          key={i}
                          className="flex min-w-full flex-col items-center justify-center p-8 text-center"
                      >
                        <div className="relative mb-6 h-36 w-36">
                          <Image
                              src={s.image}
                              alt={s.title}
                              fill
                              className="object-contain"
                              priority={s.idx === 0}
                              unoptimized
                          />
                        </div>
                        <h3 className="mb-2 font-bold text-xl text-hana-black-900">
                          {s.title}
                        </h3>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-hana-black-500">
                          {s.description}
                        </p>
                      </div>
                  ))}
                </div>
              </div>

              {/* 캐러셀 화살표 버튼 (기존 유지하되 컬러만 수정) */}
              {activeSlide > 0 && (
                  <button
                      onClick={goPrev}
                      className="-translate-y-1/2 absolute top-1/2 left-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white/90 shadow-md active:bg-gray-50"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18L9 12L15 6" />
                    </svg>
                  </button>
              )}
              {activeSlide < SLIDES.length - 1 && (
                  <button
                      onClick={goNext}
                      className="-translate-y-1/2 absolute top-1/2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white/90 shadow-md active:bg-gray-50"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18L15 12L9 6" />
                    </svg>
                  </button>
              )}
            </div>

            {/* 하단 배치 요소들 */}
            <div className="shrink-0 pb-28">
              {/* 공통 컴포넌트 StepIndicator 활용 */}
              <div className="mb-8">
                <StepIndicator
                    totalSteps={SLIDES.length}
                    currentStep={activeSlide}
                    idPrefix="intro-carousel"
                />
              </div>

              {/* 공통 컴포넌트 PrimaryButton 활용 */}
              <PrimaryButton
                  label="상속설계 시작하기"
                  variant="primary"
                  onClick={() => router.push('/inheritance/plan/guide')}
                  className="shadow-lg shadow-hana-ez-600/20"
              />
            </div>
          </main>

          {/* 3. 하단 네비게이션 */}
          <NavigationBar />
        </div>
      </div>
  );
}