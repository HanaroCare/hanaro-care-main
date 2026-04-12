'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/PrimaryButton';
import { CareMethodSelector } from '../components/simulator/CareMethodSelector';
import { LifeExpectancySlider } from '../components/simulator/LifeExpectancySlider';

export default function SimulatorPage() {
  const router = useRouter();

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        background:
          'linear-gradient(162deg, #F0FDFA 0%, #EFF6FF 28.72%, #ECFEFF 57.43%)',
      }}
    >
      <header className="sticky top-0 z-50 flex h-14 items-center px-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="-ml-2 p-2 text-hana-black-900"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
      </header>

      <main className="flex flex-col gap-6 px-6 pt-2 pb-25">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-semibold text-[20px] text-hana-black-900 leading-tight">
            미래 병원비 계산기
          </h1>
          <h2 className="font-semibold text-[20px] text-hana-green-700 leading-tight">
            조건을 선택해주세요
          </h2>
        </div>

        <div className="flex w-full flex-col gap-4">
          <span className="font-semi-bold text-[16px] text-hana-black-800">
            몇살까지 준비할까요?
          </span>
          <LifeExpectancySlider />
        </div>

        <div className="flex w-full flex-col gap-4 text-left">
          <span className="font-semi-bold text-[16px] text-hana-black-800">
            원하는 요양 방식을 선택해주세요
          </span>
          <CareMethodSelector />
        </div>

        <div className="mt-auto w-full pt-4">
          <PrimaryButton label="계산 결과 보기" />
        </div>
      </main>
    </div>
  );
}
