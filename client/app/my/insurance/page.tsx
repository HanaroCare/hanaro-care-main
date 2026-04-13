'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BannerCard } from '@/app/asset/components/notification/BannerCard';
import { AlertBanner } from '@/components/modules/AlertBanner';
import InsuranceCard from './components/InsuranceCard';
import { insurances, isDesignated, viewMode } from './constants/data';

export default function ChildMainInsuranceScreen() {
  const router = useRouter();

  return (
    <div className="mb-10 flex flex-col">
      <div className="flex-1 space-y-3 pb-4">
        {!isDesignated ? (
          <div className="mt-4">
            <BannerCard
              title={<>미청구 보험금이{'\n'}전국에 10조원 쌓여있어요</>}
              buttonText="부모님의 숨은 보험금 조회하기"
              imageSrc={
                viewMode === 'GRANTEE'
                  ? '/images/my/insurance/childrenImage.svg'
                  : '/images/my/insurance/parentImage.svg'
              }
              href="viewMode === 'GRANTEE'
                  ? '/images/my/insurance/childrenImage.svg'
                  : '/images/my/insurance/parentImage.svg'"
            />
          </div>
        ) : (
          <div className="mb-7">
            {/* 배너 */}
            <AlertBanner
              actionText="인증하기"
              onActionAction={() => {}}
              variant="warning"
              icon={
                <Image
                  src="/images/my/insurance/light.svg"
                  alt="전구"
                  width={22}
                  height={22}
                />
              }
              actionFont="font-bold"
              messageFont="font-semibold"
              message={'보험대리청구인으로 지정되셨나요?'}
            />
          </div>
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
              onClick={() => {
                router.push(`/my/insurance/${item.id}`);
                window.scrollTo(0, 0);
              }}
            />
          ))}
        </div>
        <div className="mt-5">
          <AlertBanner
            variant="success"
            messageFont="!text-[12px]"
            message={
              '가족관리에서 등록된 부모님의 보험 정보입니다.\n미청구 보험금은 자녀가 대리 청구할 수 있습니다.'
            }
          />
        </div>
      </div>
    </div>
  );
}
