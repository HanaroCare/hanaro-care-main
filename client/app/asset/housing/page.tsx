'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { InfoListCard } from '@/components/modules/InfoListCard';
import { AssetChart } from '../components/AssetChart';

export default function HousingDetailPage() {
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
          부동산 상세
        </h1>
      </header>

      <main className="flex flex-col items-center gap-6 px-6 py-6 pb-20">
        <div className="w-full">
          <h2 className="font-bold text-[24px] text-hana-black-900 leading-tight">
            서울 강남구 역삼동 아파트
          </h2>
          <p className="mt-1 text-[15px] text-hana-black-500">84㎡ (33평)</p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-bold text-[28px] text-hana-black-900">
              9억 2,000만원
            </span>
            <span className="font-medium text-[15px] text-hana-red-500">
              ▲ 1,200만원 (10%)
            </span>
          </div>
        </div>

        <AssetChart
          title="부동산 시세 변화"
          subtitle="최근 6개월 기준"
          data={[
            { name: '7월', value: 8.8 },
            { name: '8월', value: 8.9 },
            { name: '9월', value: 9.0 },
            { name: '10월', value: 9.1 },
            { name: '11월', value: 9.2 },
            { name: '12월', value: 9.2 },
          ]}
          config={{
            type: 'line',
            color: '#008485',
            domain: [8.5, 9.5],
            ticks: [8.5, 9.0, 9.5],
          }}
        />

        <InfoListCard
          title="취득 정보"
          items={[
            { label: '취득일', value: '2018.05.20' },
            { label: '취득가', value: '7억 5,000만원' },
          ]}
        />

        <InfoListCard
          title="담보 대출 정보"
          items={[
            { label: '잔액', value: '2억 1,000만원' },
            { label: '월 상환금', value: '98만원' },
            { label: '금리', value: '연 3.8%' },
            { label: '만기', value: '2034.03' },
          ]}
        />

        <InfoListCard
          title="세금 예상"
          items={[
            { label: '재산세', value: '약 180만원/년' },
            { label: '양도세 (매각 시)', value: '약 4,500만원' },
          ]}
        />
      </main>
    </div>
  );
}
