'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AlertBanner } from '@/components/modules/AlertBanner';
import InfoBox from '@/components/modules/InfoBox';
import InsuranceCard from './components/InsuranceCard';
import { insurances, isDesignated, viewMode } from './constants/data';

export default function ChildMainInsuranceScreen() {
  const router = useRouter();
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  return (
    <div className="mb-10 flex flex-col">
      <div className="flex-1 space-y-3 pb-4">
        {!isDesignated ? (
          <div className="mt-5">
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isBannerVisible ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setIsBannerVisible(false);
                }}
                className="absolute top-2 right-8 mt-21 h-8 w-8 rounded-full"
              />
              {/* 광고 */}
              <Image
                onClick={() =>
                  window.open(
                    viewMode === 'GRANTEE'
                      ? 'https://cont.insure.or.kr/cont_web/intro.do'
                      : 'https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=1529&ccfNo=3&cciNo=1&cnpClsNo=2',
                    '_blank',
                  )
                }
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
                  src="/images/my/insurance/light.png"
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

        <InfoBox
          desc={
            '가족관리에서 등록된 부모님의 보험 정보입니다.\n미청구 보험금은 자녀가 대리 청구할 수 있습니다.'
          }
          className="mt-10"
        />
      </div>
    </div>
  );
}
