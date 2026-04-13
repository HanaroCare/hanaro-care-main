'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import { AlertBanner } from '@/components/modules/AlertBanner';
import DualActionFooter from '@/components/modules/DualActionFooter';
import PageHeading from '@/components/typography/PageHeading';

function FormLabel({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block font-medium text-[15px] text-hana-black-800"
    >
      {children}
    </label>
  );
}

export default function HouseDetailPage() {
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [houseType, setHouseType] = useState('아파트, 1주택');
  const [area, setArea] = useState('');
  const [year, setYear] = useState('');
  const [hasLoan, setHasLoan] = useState<'none' | 'exists'>('none');

  const [isSubmitted, setIsSubmitted] = useState(false);

  const isFormValid = address.trim() !== '' && area !== '' && year !== '';
  const inputBaseClass =
    'h-14 w-full rounded-[10px] border border-border-gray px-4 text-[16px] outline-none placeholder:text-hana-silver-200 focus:border-hana-teal-400 transition-all';

  if (isSubmitted) {
    return (
      <div className="flex h-full flex-col bg-background">
        <div className="flex flex-1 flex-col px-6 pt-6">
          <div className="mb-10">
            <ProgressBar step={3} total={6} />
          </div>

          <div className="mb-10">
            <PageHeading>
              <span className="text-hana-teal-500">연동된 주택</span>을{'\n'}
              확인해주세요
            </PageHeading>
          </div>

          <div className="mb-6 rounded-[20px] border border-border-gray bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-bold text-[18px] text-hana-black-900">
                {address || '서울시 마포구 연희동'}
              </span>
              <span className="rounded-full bg-hana-green-50 px-3 py-1 font-medium text-[12px] text-hana-green-700">
                내 집
              </span>
            </div>

            <div className="flex flex-col gap-4 text-[15px]">
              <div className="flex justify-between">
                <span className="text-hana-black-500">주택 종류</span>
                <span className="font-semibold text-hana-black-900">
                  {houseType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-hana-black-500">면적</span>
                <span className="font-semibold text-hana-black-900">
                  {area || '84.72'}m²
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-hana-black-500">KB 시세</span>
                <span className="font-bold text-hana-teal-500">
                  8억 2천만원
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-hana-black-500">기존 대출</span>
                <span className="font-semibold text-hana-black-900">
                  {hasLoan === 'none' ? '없음' : '있음'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-hana-black-500">취득연도</span>
                <span className="font-semibold text-hana-black-900">
                  {year || '2019'}년
                </span>
              </div>
            </div>
          </div>

          <div className="mb-10 flex justify-center">
            <AlertBanner
              variant="warning"
              message={`KB 시세 기준 LTV 60% 적용.\n소득·신용에 따라 실제 한도가 달라질 수 있어요.`}
              messageFont="font-medium"
            />
          </div>
        </div>

        <DualActionFooter
          leftLabel="다시 입력할게요"
          rightLabel="다음으로"
          onLeftClick={() => setIsSubmitted(false)}
          onRightClick={() => router.push('/mydata/car')}
        />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background px-6 pt-6 pb-12">
      <div className="mb-10">
        <ProgressBar step={2} total={6} />
      </div>

      <div className="mb-10">
        <PageHeading>
          <span className="text-hana-teal-500">주택 정보</span>를{'\n'}
          입력해주세요
        </PageHeading>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <FormLabel htmlFor="address">주소</FormLabel>
          <div className="flex gap-2">
            <input
              id="address"
              type="text"
              placeholder="성동로 124길"
              className={inputBaseClass}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button
              type="button"
              className="h-14 shrink-0 rounded-[10px] border border-border-gray px-4 font-medium text-[15px] text-hana-black-600 active:bg-gray-50"
            >
              주소 검색
            </button>
          </div>
        </div>

        <div>
          <FormLabel htmlFor="house-type">주택 정보</FormLabel>
          <div className="relative">
            <select
              id="house-type"
              className={`${inputBaseClass} cursor-pointer appearance-none bg-transparent pr-10`}
              value={houseType}
              onChange={(e) => setHouseType(e.target.value)}
            >
              <option value="아파트, 1주택">아파트, 1주택</option>
              <option value="아파트, 다주택">아파트, 다주택</option>
              <option value="연립/다세대, 1주택">연립/다세대, 1주택</option>
              <option value="단독/다가구, 1주택">단독/다가구, 1주택</option>
              <option value="오피스텔, 1주택">오피스텔, 1주택</option>
            </select>
            <div className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-4">
              <ChevronDown className="text-hana-silver-300" size={20} />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <FormLabel htmlFor="area">면적 (m²)</FormLabel>
            <input
              id="area"
              type="number"
              placeholder="84"
              className={inputBaseClass}
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <FormLabel htmlFor="year">취득연도</FormLabel>
            <input
              id="year"
              type="number"
              placeholder="2026"
              className={inputBaseClass}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
        </div>

        <div>
          <FormLabel>기존 대출 여부</FormLabel>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setHasLoan('none')}
              className={`h-14 flex-1 rounded-[10px] font-semibold text-[16px] transition-all ${
                hasLoan === 'none'
                  ? 'bg-hana-teal-400 text-white'
                  : 'border border-border-gray text-hana-silver-300'
              }`}
            >
              없음
            </button>
            <button
              type="button"
              onClick={() => setHasLoan('exists')}
              className={`h-14 flex-1 rounded-[10px] font-semibold text-[16px] transition-all ${
                hasLoan === 'exists'
                  ? 'bg-hana-teal-400 text-white'
                  : 'border border-border-gray text-hana-silver-300'
              }`}
            >
              있음
            </button>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-10">
        <p className="mb-4 text-center text-[12px] text-hana-silver-300">
          입력한 주소 기반으로 KB시세를 자동으로 조회해요.
        </p>
        <PrimaryButton
          label="조회하기"
          variant={isFormValid ? 'primary' : 'disabled'}
          onClick={() => isFormValid && setIsSubmitted(true)}
        />
      </div>
    </div>
  );
}
