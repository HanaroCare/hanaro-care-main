'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { NavigationBar } from '@/components/navigation/NavigationBar';
import { TabNavigation } from '@/components/navigation/TabNavigation';

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

  const goNext = () =>
    setActiveSlide((s) => Math.min(s + 1, slides.length - 1));

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
        {/* 탭 */}
        <TabNavigation
          tabs={[
            { id: 'asset', label: '자산' },
            { id: 'inheritance', label: '상속' },
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* 메인 */}
        <main className="flex flex-1 flex-col px-6">
          <header className="shrink-0 pt-6 pb-4">
            <h1 className="mb-2 font-bold text-2xl leading-tight">
              <span className="text-[var(--color-hana-ez-600)]">상속설계</span>
              로<br />
              소중한 사람을 지켜요
            </h1>

            <p className="whitespace-pre-wrap text-base text-gray-500 leading-snug">
              마이데이터로 자산을 연동해{'\n'}
              나만의 상속 계획을 세울 수 있어요
            </p>
          </header>

          <p className="mb-3 font-bold text-lg">상속설계 안내</p>

          {/* 캐러셀 */}
          <div className="relative mb-4 min-h-[300px]">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div
                className="flex flex-1 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {slides.map((s) => (
                  <div
                    key={s.idx}
                    className="flex min-w-full flex-col items-center justify-center p-6 text-center"
                  >
                    <div className="relative mb-4 h-32 w-32 md:h-40 md:w-40">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        className="object-contain"
                        priority={s.idx === 0}
                        unoptimized
                      />
                    </div>

                    <h3 className="mb-2 font-bold text-xl">{s.title}</h3>

                    <p className="whitespace-pre-wrap text-gray-500 text-sm leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* prev */}
            {activeSlide > 0 && (
              <button
                onClick={goPrev}
                className="-translate-y-1/2 absolute top-1/2 left-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 shadow-md"
              >
                ‹
              </button>
            )}

            {/* next */}
            {activeSlide < slides.length - 1 && (
              <button
                onClick={goNext}
                className="-translate-y-1/2 absolute top-1/2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 shadow-md"
              >
                ›
              </button>
            )}
          </div>

          {/* bottom */}
          <div className="shrink-0 pb-24">
            <div className="mb-6 flex justify-center gap-2">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === activeSlide
                      ? 'w-5 bg-[var(--color-hana-ez-600)]'
                      : 'w-2 bg-gray-200'
                  }`}
                />
              ))}
            </div>

            <Link
              href="/inheritance/plan/guide"
              className="block w-full rounded-2xl bg-[var(--color-hana-ez-600)] py-4 text-center font-bold text-lg text-white shadow-lg"
            >
              상속설계 시작하기
            </Link>
          </div>
        </main>

        <NavigationBar />
      </div>
    </div>
  );
}
