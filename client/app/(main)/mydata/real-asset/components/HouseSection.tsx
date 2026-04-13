'use client';

import { Building2, Search } from 'lucide-react';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';

/**
 * 부동산 자산 등록 및 결과 섹션
 */
export default function HouseSection({
  step,
  onComplete,
}: {
  step: string;
  onComplete: () => void;
}) {
  const [address, setAddress] = useState('');
  const [selectedHouseType, setSelectedHouseType] = useState('아파트');

  if (step === 'result') {
    return (
      <div className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem] pb-[3rem]">
        <div className="mb-[2rem]">
          <h2 className="font-bold text-[1.375rem] text-foreground">
            등록된 부동산 정보
          </h2>
        </div>

        <div className="rounded-[1.5rem] border border-gray-200 bg-white p-[1.75rem] shadow-sm">
          <div className="mb-[1.5rem] flex items-center gap-[1.25rem]">
            <div className="rounded-2xl bg-hana-green-50 p-[0.875rem] text-primary">
              <Building2 size={28} />
            </div>
            <div>
              <p className="font-bold text-[1.125rem]">자이아파트 101동</p>
              <p className="mt-0.5 text-[0.875rem] text-muted-foreground">
                서울시 강남구 테헤란로 123
              </p>
            </div>
          </div>
          <div className="space-y-[1rem] border-gray-100 border-t pt-[1.5rem]">
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem] text-muted-foreground">
                최근 실거래가
              </span>
              <span className="font-bold text-[1.125rem] text-foreground">
                15억 4,000만원
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[0.9375rem] text-muted-foreground">
                전용 면적
              </span>
              <span className="font-semibold text-[1rem] text-hana-black-800">
                84.98㎡
              </span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <PrimaryButton label="자산 목록으로" onClick={() => {}} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col px-[1.5rem] pt-[2.5rem] pb-[3rem]">
      <div className="mb-[2.5rem]">
        <h2 className="font-bold text-[1.5rem] text-foreground leading-[1.4] tracking-tight">
          살고 계신 집의
          <br />
          주소를 입력해 주세요
        </h2>
      </div>

      <div className="group relative">
        <input
          type="text"
          placeholder="도로명 주소 또는 단지명 검색"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="h-[3.75rem] w-full rounded-[1rem] border border-gray-200 pr-[3.5rem] pl-[1.25rem] text-[1rem] outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
        <div className="-translate-y-1/2 absolute top-1/2 right-[1.25rem] text-gray-400 transition-colors group-focus-within:text-primary">
          <Search size={22} />
        </div>
      </div>

      <div className="mt-[2.5rem] flex flex-col gap-[1rem]">
        <p className="font-bold text-[0.9375rem] text-hana-black-900">
          우리 집 특징
        </p>
        <div className="flex flex-wrap gap-[0.75rem]">
          {['아파트', '빌라', '오피스텔', '단독주택'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedHouseType(type)}
              className={`rounded-full border px-[1.125rem] py-[0.625rem] font-medium text-[0.875rem] transition-all ${
                selectedHouseType === type
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 bg-white text-hana-black-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <PrimaryButton
          label="조회하기"
          disabled={!address}
          onClick={onComplete}
        />
      </div>
    </div>
  );
}
