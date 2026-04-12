'use client';

import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import InsuranceCard from './components/InsuranceCard';
import { insurances, isDesignated, viewMode } from './constants/data';

export default function ChildMainInsuranceScreen() {
  const router = useRouter();
  return (
    <div className="mb-10 flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto pb-4">
        {!isDesignated ? (
          <div className="mt-5">
            {/* 광고 */}
            <Image
              src={
                viewMode === 'GRANTEE'
                  ? '/images/my/insurance/childrenBanner.png'
                  : '/images/my/insurance/parentBanner.png'
              }
              alt="자녀 - 부모 보험금 조회 배너"
              width={500}
              height={0}
              sizes="100vw"
              className="h-auto w-full"
            />
          </div>
        ) : (
          <>
            {/* 배너 */}
            <div className="mt-3 mb-10 flex items-center justify-between rounded-2xl border border-red-100 bg-red-50 py-5">
              <div className="flex items-center gap-2 pl-2.5">
                <Image
                  src="/images/my/insurance/light.png"
                  alt="전구"
                  width={22}
                  height={22}
                />
                <p className="font-semibold text-hana-red-500 text-sm">
                  보험대리청구인으로 지정되셨나요?
                </p>
              </div>
              <button
                type="button"
                className="flex items-center gap-0.5 whitespace-nowrap pr-1 font-bold text-hana-red-500 text-xs"
              >
                인증하기 <ChevronRight size={14} />
              </button>
            </div>
          </>
        )}

        {/* 섹션 라벨 */}
        <div className="flex items-center gap-2 pt-1">
          <div
            className={`${viewMode === 'GRANTEE' ? 'bg-teal-500' : ''} h-2.5 w-2.5 rounded-full`}
          />
          <span className="font-semibold text-gray-800 text-sm">가족 보험</span>
        </div>

        {/* 보험 목록 */}
        <div className="space-y-2.5">
          {insurances.map((item) => (
            <InsuranceCard
              key={item.id}
              item={item}
              onClick={() => router.push(`/my/insurance/${item.id}`)}
            />
          ))}
        </div>

        <div className="mt-10 rounded-xl bg-teal-50 py-3">
          <p className="pl-4 text-teal-700 text-xs leading-relaxed">
            가족관리에서 등록된 부모님의 보험 정보입니다.
            <br />
            미청구 보험금은 자녀가 대리 청구할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
