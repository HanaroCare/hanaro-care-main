'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { TabNavigation } from '@/components/navigation/TabNavigation';

import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { StepIndicator } from '@/components/baseelements/StepIndicator';
import PageHeading from "@/components/typography/PageHeading";
import PageDescription from '@/components/typography/PageDescription';

type Slide = {
  idx: number;
  image: string;
  title: string;
  description: string;
};

export default function InheritanceIntroClient({
                                                 slides,
                                               }: {
  slides: Slide[];
}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('inheritance');
  const router = useRouter();

  const goNext = () => setActiveSlide((s) => Math.min(s + 1, slides.length - 1));
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

            <p className="mb-4 shrink-0 font-semibold text-medium text-hana-black-600">
              상속설계 안내
            </p>

            <div className="relative mb-6 min-h-[340px]">
              <div className="flex h-full flex-col overflow-hidden rounded-[24px] bg-white">
                <div
                    className="flex flex-1 transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {slides.map((s, i) => (
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
                        <h3 className="mb-2 font-semibold text-xl text-hana-black-900">
                          {s.title}
                        </h3>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-hana-black-500">
                          {s.description}
                        </p>
                      </div>
                  ))}
                </div>
              </div>

              {activeSlide > 0 && (
                  <button
                      onClick={goPrev}
                      className="-translate-y-1/2 absolute top-1/2 left-0 z-10 flex h-10 w-10 items-center justify-center active:opacity-50"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18L9 12L15 6" />
                    </svg>
                  </button>
              )}

              {activeSlide < slides.length - 1 && (
                  <button
                      onClick={goNext}
                      className="-translate-y-1/2 absolute top-1/2 right-0 z-10 flex h-10 w-10 items-center justify-center active:opacity-50"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18L15 12L9 6" />
                    </svg>
                  </button>
              )}
            </div>

            <div className="shrink-0 pb-28">
              <div className="mb-8">
                <StepIndicator
                    totalSteps={slides.length}
                    currentStep={activeSlide}
                    idPrefix="intro-carousel"
                />
              </div>

              <PrimaryButton
                  label="상속설계 시작하기"
                  variant="primary"
                  onClick={() => router.push('/inheritance/plan/guide')}
                  className="shadow-lg shadow-hana-ez-600/20"
              />
            </div>
          </main>

          <NavigationBar />
        </div>
      </div>
  );
}
