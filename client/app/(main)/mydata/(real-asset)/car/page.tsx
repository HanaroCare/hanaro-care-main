'use client';

import Image from 'next/image';
import { useState } from 'react';
import FormInput from '@/components/baseelements/FormInput';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import DualActionFooter from '@/components/modules/DualActionFooter';
import PageHeading from '@/components/typography/PageHeading';

export default function CarPage() {
  const [carNumber, setCarNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 차량번호 유효성: 7~8자리 한글/숫자 혼합 (간단하게 길이로만 체크)
  const isCarNumberValid = carNumber.length >= 7 && carNumber.length <= 8;

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
          onRightClick={() => console.log('금 자산 이동')}
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

      <FormInput
        label="차량 번호"
        id="carNumber"
        placeholder="12가1234"
        value={carNumber}
        onChange={setCarNumber}
        // className="text-center" <- 이 부분을 삭제하거나 "text-left"로 변경
      />
      <p className="mt-4 text-[14px] text-hana-black-500">
        차량번호 7자리나 8자리를 알려주세요
      </p>

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
