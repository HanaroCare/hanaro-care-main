'use client';

import Image from 'next/image';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import DualActionFooter from '@/components/modules/DualActionFooter';
import PageHeading from '@/components/typography/PageHeading';

export default function CarPage() {
  const [carNumber, setCarNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const isCarNumberValid = carNumber.length >= 7;

  if (isSubmitted) {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex flex-1 flex-col px-6 pt-6">
          <div className="mb-10">
            <ProgressBar step={5} total={6} />
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
                제네시스
              </p>
              <p className="mb-8 font-bold text-[32px] text-hana-teal-500">
                G70
              </p>

              <div className="flex justify-center gap-12">
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] text-hana-black-500">
                    출고 가격
                  </span>
                  <span className="font-bold text-[18px] text-hana-black-800">
                    8000만원
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] text-hana-black-500">
                    최초 등록일
                  </span>
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
          rightLabel="다음으로"
          onLeftClick={() => setIsSubmitted(false)}
          onRightClick={() => console.log('금 자산 연동으로 이동')}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col px-6 pt-6 pb-12">
      <div className="mb-10">
        <ProgressBar step={4} total={6} />
      </div>

      <div className="mb-10">
        <PageHeading>
          <span className="text-hana-teal-500">차량 번호</span>를{'\n'}
          입력해주세요
        </PageHeading>
      </div>

      <div className="flex flex-col">
        <input
          type="text"
          placeholder="12가1234"
          className="h-14 w-full rounded-[10px] border border-border-gray px-4 text-center font-bold text-[24px] tracking-widest outline-none transition-all placeholder:text-hana-silver-200 focus:border-hana-teal-400"
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value)}
        />
        <p className="mt-4 text-center text-[14px] text-hana-black-500">
          차량번호 7자리나 8자리를 알려주세요
        </p>
      </div>

      <div className="mt-auto">
        <PrimaryButton
          label="확인"
          variant={isCarNumberValid ? 'primary' : 'disabled'}
          onClick={() => isCarNumberValid && setIsSubmitted(true)}
        />
      </div>
    </div>
  );
}
