'use client';

// import BottomNav from '@/components/BottomNav';
import InheritanceHeader from '@/components/InheritanceHeader';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const SLIDES = [
  {
    image: '/images/inheritance/intro-slide-1.png',
    title: '상속 설계란?',
    description: '내 자산을 기반으로\n법적으로 안전한 상속 계획을 세워드려요',
  },
  {
    image: '/images/inheritance/intro-slide-2.png',
    title: '법정상속분 vs 유류분',
    description: '두가지 기준을 한눈에 비교하고\n내 설계가 법적으로 안전한지 확인해요',
  },
  {
    image: '/images/inheritance/intro-slide-3.png',
    title: '가족을 위한 나만의 상속설계',
    description: '유언대용신탁을 통해 법적 효력을 갖추고\n소중한 분들에게 마음을 전해요',
  },
];

export default function InheritanceIntroPage() {
  const [activeSlide, setActiveSlide] = useState(0);

  const goNext = () => setActiveSlide((s) => Math.min(s + 1, SLIDES.length - 1));
  const goPrev = () => setActiveSlide((s) => Math.max(s - 1, 0));

  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        {/* 1. 상단 탭 (분리한 컴포넌트 사용) */}
        <InheritanceHeader activeTab="inheritance" />

        {/* 2. 메인 컨텐츠 영역 */}
        <main className="flex-1 flex flex-col px-6">
          <header className="pt-6 pb-4 shrink-0">
            <h1 className="text-2xl font-bold leading-tight mb-2">
              <span className="text-[var(--color-hana-ez-600)]">상속설계</span>로<br />
              소중한 사람을 지켜요
            </h1>
            <p className="text-gray-500 text-base leading-snug whitespace-pre-wrap">
              마이데이터로 자산을 연동해{"\n"}나만의 상속 계획을 세울 수 있어요
            </p>
          </header>

          <p className="text-lg font-bold mb-3 shrink-0">상속설계 안내</p>

          {/* 캐러셀 영역 */}
          <div className="relative min-h-[300px] mb-4">
            <div className="h-full overflow-hidden rounded-3xl border border-gray-100 shadow-sm bg-white flex flex-col">
              <div 
                className="flex-1 flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {SLIDES.map((s, i) => (
                  <div key={i} className="min-w-full p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-32 h-32 md:w-40 md:h-40 relative mb-4">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        className="object-contain"
                        priority={i === 0}
                        unoptimized
                      />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-wrap">
                      {s.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 화살표 버튼 */}
            {activeSlide > 0 && (
              <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 border border-gray-100 rounded-full flex items-center justify-center shadow-md z-10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18L9 12L15 6"/></svg>
              </button>
            )}
            {activeSlide < SLIDES.length - 1 && (
              <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 border border-gray-100 rounded-full flex items-center justify-center shadow-md z-10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18L15 12L9 6"/></svg>
              </button>
            )}
          </div>

          {/* 하단 배치 요소들 */}
          <div className="shrink-0 pb-24">
            {/* 도트 인디케이터 */}
            <div className="flex justify-center gap-2 mb-6">
              {SLIDES.map((_, i) => (
                <div key={i} className={`h-2 rounded-full transition-all ${i === activeSlide ? 'w-5 bg-[var(--color-hana-ez-600)]' : 'w-2 bg-gray-200'}`} />
              ))}
            </div>

            {/* CTA 버튼 */}
            <Link href="/inheritance/plan" className="block w-full bg-[var(--color-hana-ez-600)] text-white py-4 rounded-2xl text-center text-lg font-bold shadow-lg shadow-[var(--color-hana-ez-600)]/20">
              상속설계 시작하기
            </Link>
          </div>
        </main>

        {/* 3. 하단 고정 네비게이션 (주석 처리) */}
        {/* <BottomNav activePath="/inheritance" /> */}
      </div>
    </div>
  );
}
