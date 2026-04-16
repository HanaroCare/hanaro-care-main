'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BannerCard } from '@/app/asset/components/notification/BannerCard';
import { myhanaApi } from '@/app/my/api/myApi'; // API와 타입 임포트
import { AlertBanner } from '@/components/modules/AlertBanner';
import InsuranceCard from './components/InsuranceCard';
import type { InsuranceDto } from './types';

export default function MyFamilyInsurancePage() {
  const router = useRouter();

  const [insuranceList, setInsuranceList] = useState<InsuranceDto[]>([]);
  const [isInsAgent, setInsAgent] = useState<boolean>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsurances = async () => {
      try {
        setLoading(true);
        const data = await myhanaApi.getInsurances();

        setInsuranceList(data.insurances);
        setInsAgent(data.isInsAgent);
      } catch (error) {
        console.error('보험 목록 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInsurances();
  }, []);

  const [isAgentLoading, setAgentLoading] = useState(false);

  const handleInsAgentVerify = async () => {
    setAgentLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setAgentLoading(false);
    setInsAgent(true);
  };

  return (
    <div className="mb-10 flex min-h-[calc(100vh-180px)] flex-col">
      <div className="flex-1 space-y-3 pb-4">
        {isInsAgent ? (
          <div className="mt-4">
            <BannerCard
              title={<>미청구 보험금이{'\n'}전국에 10조원 쌓여있어요</>}
              buttonText="부모님의 숨은 보험금 조회하기"
              imageSrc="/images/my/insurance/childrenImage.svg"
              href="https://cont.insure.or.kr/cont_web/intro.do"
            />
          </div>
        ) : (
          <div className="mt-7 mb-7">
            <AlertBanner
              actionText="인증하기"
              onActionAction={handleInsAgentVerify}
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
          <div className={`h-2.5 w-2.5 rounded-full bg-teal-500`} />
          <span className="font-semibold text-gray-800 text-sm">가족 보험</span>
        </div>

        {/* 3. 보험 목록 렌더링 (로딩 처리 포함) */}
        <div className="space-y-2.5">
          {loading ? (
            <p className="py-10 text-center text-gray-400 text-sm">
              보험 정보를 불러오는 중입니다...
            </p>
          ) : insuranceList.length > 0 ? (
            insuranceList.map((item) => (
              <InsuranceCard
                key={item.accountId} // id 대신 accountId 사용
                item={item}
                onClick={() => {
                  router.push(`/my/insurance/${item.accountId}`);
                  window.scrollTo(0, 0);
                }}
              />
            ))
          ) : (
            <p className="py-10 text-center text-gray-400 text-sm">
              등록된 보험 정보가 없습니다.
            </p>
          )}
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
