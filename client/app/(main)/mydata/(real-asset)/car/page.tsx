'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { getBannerStatus } from '@/app/asset/actions/notificationStatus';
import FormInput from '@/components/baseelements/FormInput';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import CompleteStep from '@/components/modules/CompleteStep';
import DualActionFooter from '@/components/modules/DualActionFooter';
import PageHeading from '@/components/typography/PageHeading';
import LoadingStep from '../../components/LoadingStep';
import { linkVehicle, type RealAssetLinkResult } from '../actions/realAsset';

function formatAmtSync(amount: number): string {
  const eok = Math.floor(amount / 100_000_000);
  const man = Math.floor((amount % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString()}만원`;
  if (eok > 0) return `${eok}억`;
  return `${man.toLocaleString()}만원`;
}

function CarPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const isAssetFlow = from === 'asset';
  const total = isAssetFlow ? 2 : 6;

  const [carNumber, setCarNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAllDone, setIsAllDone] = useState(false);
  const [vehicleData, setVehicleData] = useState<RealAssetLinkResult | null>(null);
  const [apiError, setApiError] = useState('');
  const [userName, setUserName] = useState('사용자');

  useEffect(() => {
    getBannerStatus().then((s) => {
      if (s.userName) setUserName(s.userName);
    });
  }, []);

  const normalizedCarNumber = carNumber.replace(/\s+/g, '').trim();
  const isCarNumberValid = /^(?:\d{2}[가-힣]\d{4}|\d{3}[가-힣]\d{4})$/.test(
    normalizedCarNumber,
  );

  const handleSearch = async () => {
    if (!isCarNumberValid || isSubmitting) return;
    setIsSubmitting(true);
    setApiError('');
    try {
      const result = await linkVehicle({ car_number: normalizedCarNumber });
      setVehicleData(result);
      setIsSubmitted(true);
    } catch {
      setApiError('차량 정보를 불러오지 못했습니다. 번호를 다시 확인해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    setIsLoading(true);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setIsAllDone(true);
  };

  if (isAllDone) {
    return (
      <CompleteStep
        footer={
          <div className="w-full px-6 pb-12">
            <PrimaryButton
              label="확인하기"
              onClick={() => router.push('/asset?tab=car')}
            />
          </div>
        }
      >
        <div className="flex flex-col items-center text-center">
          <h2 className="whitespace-pre-line font-bold text-[1.5rem] text-foreground leading-[1.4] tracking-tight">
            차량 정보를{'\n'}연동했어요!
          </h2>
          <p className="mt-3 text-[1rem] text-muted-foreground">
            연동된 자산 정보는 내 자산 탭에서{'\n'}언제든지 확인할 수 있어요.
          </p>
          {vehicleData && (
            <p className="mt-4 text-[1.125rem] font-semibold text-hana-teal-500">
              평가액 {formatAmtSync(vehicleData.evalAmt)}
            </p>
          )}
        </div>
      </CompleteStep>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <LoadingStep name={userName} onComplete={handleLoadingComplete} />
      </div>
    );
  }

  if (isSubmitted && vehicleData) {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex flex-1 flex-col px-6 pt-6">
          <div className="mb-10">
            <ProgressBar step={isAssetFlow ? 2 : 5} total={total} />
          </div>
          <div className="mb-8">
            <PageHeading>
              <span className="text-hana-teal-500">차량 정보</span>를{'\n'}
              확인해주세요
            </PageHeading>
          </div>

          <div className="-mt-10 flex flex-1 flex-col items-center justify-center">
            <div className="relative mb-4 aspect-[16/9] w-full">
              <Image
                src="/images/mydata/car.svg"
                alt="Car"
                fill
                className="object-contain"
              />
            </div>
            <div className="text-center">
              <p className="font-medium text-[20px] text-hana-black-600">
                {vehicleData.assetNm.split(' ')[0]}
              </p>
              <p className="mb-8 font-bold text-[32px] text-hana-teal-500">
                {vehicleData.assetNm.split(' ').slice(1).join(' ') || vehicleData.assetNm}
              </p>
              <div className="flex justify-center gap-12">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] text-hana-black-500">평가액</span>
                  <span className="font-bold text-[18px] text-hana-black-800">
                    {formatAmtSync(vehicleData.evalAmt)}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] text-hana-black-500">최초 등록일</span>
                  <span className="font-bold text-[18px] text-hana-black-800">
                    2021.02.21
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DualActionFooter
          leftLabel="다시 입력하기"
          rightLabel="완료"
          onLeftClick={() => setIsSubmitted(false)}
          onRightClick={handleComplete}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col px-6 pt-6 pb-12">
      <div className="mb-10">
        <ProgressBar step={isAssetFlow ? 1 : 4} total={total} />
      </div>
      <div className="mb-10">
        <PageHeading>
          <span className="text-hana-teal-500">차량 번호</span>를{'\n'}
          입력해주세요
        </PageHeading>
      </div>

      <FormInput
        label="차량 번호"
        id="carNumber"
        placeholder="12가1234"
        value={carNumber}
        onChange={setCarNumber}
      />
      <p className="mt-4 text-[14px] text-hana-black-500">
        차량번호 7자리나 8자리를 알려주세요
      </p>

      {apiError && (
        <p className="mt-4 text-center text-[13px] text-red-500 font-medium">{apiError}</p>
      )}

      <div className="mt-auto flex flex-col gap-3">
        <PrimaryButton
          label={isSubmitting ? '조회 중…' : '조회하기'}
          variant={isCarNumberValid && !isSubmitting ? 'primary' : 'disabled'}
          onClick={handleSearch}
        />
        <PrimaryButton
          label="나중에 연결하기"
          variant="secondary"
          className="bg-hana-silver-100 text-hana-black-500!"
          onClick={() => router.push(isAssetFlow ? '/asset?tab=car' : '/mydata/main')}
        />
      </div>
    </div>
  );
}

export default function CarPage() {
  return (
    <Suspense>
      <CarPageContent />
    </Suspense>
  );
}
