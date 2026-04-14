'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import FormInput from '@/components/baseelements/FormInput';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import { AlertBanner } from '@/components/modules/AlertBanner';
import DualActionFooter from '@/components/modules/DualActionFooter';
import PageHeading from '@/components/typography/PageHeading';

export default function HouseDetailPage() {
  const router = useRouter();
  const currentYear = new Date().getFullYear();

  const [address, setAddress] = useState('');
  const [houseType, setHouseType] = useState('아파트, 1주택');
  const [area, setArea] = useState('');
  const [year, setYear] = useState('');
  const [hasLoan, setHasLoan] = useState<'none' | 'exists'>('none');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const yearError = useMemo(() => {
    if (!year) return '';
    if (!/^\d{4}$/.test(year)) return '년도 4자리를 입력해주세요.';
    if (Number(year) > currentYear) return '미래 년도는 입력할 수 없어요.';
    return '';
  }, [year, currentYear]);

  const isFormValid =
    address.trim() !== '' && area !== '' && year !== '' && !yearError;

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
                {address}
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
                  {area}m²
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
                  {year}년
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
        <FormInput
          label="주소"
          id="address"
          placeholder="성동로 124길"
          value={address}
          onChange={setAddress}
          suffix={
            <button
              type="button"
              className="h-14 shrink-0 rounded-[10px] border border-border-gray px-4 font-medium text-[15px] text-hana-black-600 active:bg-gray-50"
            >
              주소 검색
            </button>
          }
        />

        <div className="flex flex-col">
          <label
            htmlFor="house-type"
            className="mb-2 block font-medium text-[15px] text-hana-black-800"
          >
            주택 정보
          </label>
          <div className="relative">
            <select
              id="house-type"
              className="h-14 w-full cursor-pointer appearance-none rounded-[10px] border border-border-gray bg-transparent px-4 text-[16px] outline-none transition-all focus:border-hana-teal-400"
              value={houseType}
              onChange={(e) => setHouseType(e.target.value)}
            >
              <option value="아파트, 1주택">아파트, 1주택</option>
              <option value="아파트, 다주택">아파트, 다주택</option>
              <option value="연립/다세대, 1주택">연립/다세대, 1주택</option>
            </select>
            <div className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-4 text-hana-silver-300">
              <ChevronDown size={20} />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <FormInput
            className="flex-1"
            label="면적 (m²)"
            id="area"
            type="number"
            placeholder="84"
            value={area}
            onChange={setArea}
          />
          <FormInput
            className="flex-1"
            label="취득연도"
            id="year"
            type="number"
            placeholder={String(currentYear)}
            value={year}
            onChange={setYear}
            error={yearError}
          />
        </div>

        <div>
          <p className="mb-2 block font-medium text-[15px] text-hana-black-800">
            기존 대출 여부
          </p>
          <div className="flex gap-2">
            {(['none', 'exists'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setHasLoan(type)}
                className={`h-14 flex-1 rounded-[10px] font-semibold text-[16px] transition-all ${hasLoan === type
                    ? 'bg-hana-teal-400 text-white'
                    : 'border border-border-gray text-hana-silver-300'
                  }`}
              >
                {type === 'none' ? '없음' : '있음'}
              </button>
            ))}
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
