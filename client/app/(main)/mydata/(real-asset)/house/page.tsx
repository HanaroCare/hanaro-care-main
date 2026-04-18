'use client';

import { CreditCard, Home, TrendingUp } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import PageDescription from '@/components/typography/PageDescription';
import PageHeading from '@/components/typography/PageHeading';

const infoList = [
  { label: '보유 주택 정보 (종류, 면적, 소재지)', icon: Home },
  { label: 'KB 부동산 시세', icon: TrendingUp },
  { label: '기존 대출 보유 현황', icon: CreditCard },
];

function HousePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');

  const isAssetFlow = from === 'asset';
  const total = isAssetFlow ? 3 : 6;

  return (
    <div className="flex h-full flex-col px-6 pt-6 pb-12">
      <div className="mb-10">
        <ProgressBar step={1} total={total} />
      </div>

      <div className="mb-10">
        <PageHeading className="mb-4">
          <span className="text-hana-teal-500">주택 정보</span>를{'\n'}
          불러올게요
        </PageHeading>
        <PageDescription>
          마이데이터를 통해 보유 주택 정보와{'\n'}기존 대출 여부를 자동으로
          조회해요.
        </PageDescription>
      </div>

      <div className="flex flex-col gap-3">
        {infoList.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex w-full items-center gap-4 rounded-xl border border-border-gray bg-white px-5 py-4 shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hana-teal-50">
              <Icon size={20} className="text-hana-teal-500" />
            </div>
            <span className="text-left font-medium text-[16px] text-hana-black-700">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <PrimaryButton
          label="전체 동의 및 연결하기"
          variant="primary"
          onClick={() => {
            const params = new URLSearchParams();
            if (isAssetFlow) params.set('from', 'asset');
            router.push(`/mydata/house/detail?${params.toString()}`);
          }}
        />
        <PrimaryButton
          label="나중에 연결하기"
          variant="secondary"
          className="bg-hana-silver-100 text-hana-black-500!"
          onClick={() => router.push(isAssetFlow ? '/asset?tab=realestate' : '/asset?tab=house')}
        />
      </div>
    </div>
  );
}

export default function HouseMyDataPage() {
  return (
    <Suspense>
      <HousePageContent />
    </Suspense>
  );
}
