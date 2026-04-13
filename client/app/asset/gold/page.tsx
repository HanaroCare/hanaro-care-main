'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InfoListCard } from '@/components/modules/InfoListCard';
import { AssetChart } from '../components/AssetChart';

export default function GoldDetailPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sticky top-0 z-50 flex h-14 items-center border-zinc-100 border-b bg-white px-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="-ml-2 p-2 text-hana-black-900"
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="flex-1 pr-10 text-center font-semibold text-[17px] text-hana-black-900">
          금 상세
        </h1>
      </header>

      <main className="flex flex-col items-center gap-6 px-6 py-6 pb-20">
        <div className="w-full">
          <h2 className="font-bold text-[24px] text-hana-black-900 leading-tight">
            골드바 (100g)
          </h2>
          <p className="mt-1 text-[15px] text-hana-black-500">중량: 100g</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-bold text-[28px] text-hana-black-900">
              1,330만원
            </span>
            <span className="font-medium text-[15px] text-hana-red-500">
              ▲ 80만원 (10%)
            </span>
          </div>
        </div>

        <AssetChart
          title="국제 금 시세"
          subtitle="최근 6개월 기준"
          data={[
            { name: '7월', value: 1100 },
            { name: '8월', value: 1250 },
            { name: '9월', value: 1150 },
            { name: '10월', value: 1300 },
            { name: '11월', value: 1380 },
            { name: '12월', value: 1400 },
          ]}
          config={{
            type: 'line',
            color: '#C1B483',
            domain: [0, 1400],
            ticks: [0, 350, 700, 1050, 1400],
          }}
        />

        <InfoListCard
          title="보유 정보"
          items={[
            { label: '보유량', value: '100g' },
            { label: '평균단가', value: '12.5만원/g' },
            { label: '보관장소', value: '하나은행 역삼동지점' },
          ]}
        />
      </main>
    </div>
  );
}
