'use client';

// import BottomNav from '@/components/BottomNav';
import InheritanceHeader from '@/components/InheritanceHeader';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
    description:
      '두가지 기준을 한눈에 비교하고\n내 설계가 법적으로 안전한지 확인해요',
  },
  {
    image: '/images/inheritance/intro-slide-3.png',
    title: '가족을 위한 나만의 상속설계',
    description:
      '유언대용신탁을 통해 법적 효력을 갖추고\n소중한 분들에게 마음을 전해요',
  },
];

export default function InheritanceIntroPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState('inheritance');
  const router = useRouter();

  const goNext = () =>
    setActiveSlide((s) => Math.min(s + 1, SLIDES.length - 1));
  const goPrev = () => setActiveSlide((s) => Math.max(s - 1, 0));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'trust') {
      router.push('/asset/trust');
    }
  };

  return (
    <div className="app-shell bg-white">
      <div className="app-layout">
        <Header
          title="상속설계"
          showBackButton={true}
          onBack={() => router.push('/inheritance')}
        />
        <TabNavigation
          tabs={[
            { id: 'inheritance', label: '상속설계' },
            { id: 'trust', label: '유언대용신탁' },
          ]}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* 2. 메인 컨텐츠 영역 */}
        <main className="flex flex-1 flex-col px-6">
          <header className="shrink-0 pt-6 pb-4">
            <h1 className="mb-2 font-bold text-2xl leading-tight">
              <span className="text-hana-ez-600">상속설계</span>
              로<br />
              소중한 사람을 지켜요
            </h1>
            <p className="whitespace-pre-wrap text-base text-gray-500 leading-snug">
              마이데이터로 자산을 연동해{'\n'}나만의 상속 계획을 세울 수 있어요
            </p>
          </header>

          <p className="mb-3 shrink-0 font-bold text-lg">상속설계 안내</p>

          {/* 캐러셀 영역 */}
          <div className="relative mb-4 min-h-75">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div
                className="flex flex-1 transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {SLIDES.map((s) => (
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

            {/* 화살표 버튼 */}
            {activeSlide > 0 && (
              <button
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 border border-gray-100 rounded-full flex items-center justify-center shadow-md z-10"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ccc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18L9 12L15 6" />
                </svg>
              </button>
            )}
            {activeSlide < SLIDES.length - 1 && (
              <button
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 border border-gray-100 rounded-full flex items-center justify-center shadow-md z-10"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ccc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18L15 12L9 6" />
                </svg>
              </button>
            )}
          </div>

          {/* 하단 배치 요소들 */}
          <div className="shrink-0 pb-24">
            {/* 도트 인디케이터 */}
            <div className="mb-6 flex justify-center gap-2">
              {SLIDES.map((s) => (
                <div
                  key={s.idx}
                  className={`h-2 rounded-full transition-all ${s.idx === activeSlide ? 'w-5 bg-hana-ez-600' : 'w-2 bg-gray-200'}`}
                />
              ))}
            </div>

            {/* CTA 버튼 */}
            <Link
              href="/inheritance/plan"
              className="block w-full rounded-2xl bg-hana-ez-600 py-4 text-center font-bold text-lg text-white shadow-hana-ez-600/20 shadow-lg"
            >
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
