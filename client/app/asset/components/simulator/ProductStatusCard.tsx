'use client';

import { CircleDollarSign, Home } from 'lucide-react';
import { Route } from 'next';
import { useRouter } from 'next/navigation';

type ProductStatus = 'recommend' | 'designed' | 'active';

interface Props {
  type: 'trust' | 'pension';
  status: ProductStatus;
  onAction?: () => void;
}

export function ProductStatusCard({ type, status, onAction }: Props) {
  const router = useRouter();
  const isTrust = type === 'trust';
  const title = isTrust ? '내맘대로신탁' : '주택연금';
  const Icon = isTrust ? CircleDollarSign : Home;
  const isActive = status === 'active';
  const isRecommend = status === 'recommend';

  const handleNavigation = () => {
    if (onAction) {
      onAction();
      return;
    }

    // 1. 상세 보기 (운용 중일 때)
    if (isActive) {
      if (isTrust) {
        router.push('/asset/trust/dashboard' as Route);
      } else {
        router.push('/asset/home-pension/dashboard' as Route);
      }
    }
    // 2. 맞춤형 설계해보기 (추천 상태일 때)
    else if (isRecommend) {
      if (isTrust) {
        router.push('/asset/trust' as Route);
      } else {
        router.push('/asset/home-pension' as Route);
      }
    }
    // 3. 상담 예약하기 (designed 상태일 때) -> 비워둠
    else {
      console.log('상담 예약 기능은 준비 중입니다.');
    }
  };

  return (
    <div className="rounded-[28px] border border-[#F2F3F5] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F9F9]">
            <Icon size={20} className="text-hana-ez-600" />
          </div>
          <span className="font-bold text-[17px] text-[#1F2937]">{title}</span>
        </div>
        <span
          className={`rounded-full px-5 py-1.5 text-[14px] font-bold ${
            isActive
              ? 'bg-[#E9F0FF] text-[#4F80FF]'
              : 'bg-[#FFF9E9] text-[#FFA800]'
          }`}
        >
          {isActive ? '운용중' : '추천'}
        </span>
      </div>

      <div className="mb-3">
        {status === 'recommend' ? (
          <div className="space-y-1.5">
            <p className="text-[15px] text-hana-black-800">
              •{' '}
              {isTrust
                ? '내 자산을 전문가에게 맡겨 운용'
                : '이사 계획이 없다면?'}
            </p>
            <p className="text-[15px] text-hana-black-800">
              •{' '}
              {isTrust ? '병원비·생활비 자동 집행' : '매달 안정적인 추가 현금'}
            </p>
            <p className="mt-3 text-[17px] font-bold text-hana-ez-600">
              {isTrust
                ? '전문가 운용, 안정적 수익'
                : '평생 거주, 매달 고정 수입'}
            </p>
          </div>
        ) : (
          <>
            <p className="mb-1 text-[15px] font-semibold text-hana-ez-600">
              {isActive
                ? isTrust
                  ? '현재 자산'
                  : '이번달 수령액'
                : isTrust
                  ? '5년 후 예상 자산'
                  : '20년 후 누적 수령액'}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-[28px] font-extrabold text-black">
                {isTrust ? '5,846만원' : isActive ? '300만원' : '4.9억'}
              </span>
              {isTrust && (
                <span className="text-[20px] font-bold text-red-500">
                  +20.0%
                </span>
              )}
            </div>
            <div className="mt-2 flex gap-4 text-[15px] text-hana-black-800">
              <p>
                {isTrust ? '원금' : '수령 방식'} ·{' '}
                <span className="font-semibold text-black">
                  {isTrust ? '5,000만원' : '정액형'}
                </span>
              </p>
              <p>
                {isActive
                  ? isTrust
                    ? '이번달 집행'
                    : '누적 수령'
                  : isTrust
                    ? '예상 수익'
                    : '월 수령'}{' '}
                ·
                <span className="font-semibold text-red-500">
                  {isActive
                    ? isTrust
                      ? '143만원'
                      : '3,600만원'
                    : isTrust
                      ? '1,000만원'
                      : '300만원'}
                </span>
              </p>
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleNavigation}
        className="w-full rounded-2xl bg-hana-ez-600 py-3 text-[14px] font-semibold text-white active:bg-hana-ez-700"
      >
        {status === 'recommend'
          ? '맞춤형 설계해보기'
          : isActive
            ? '상세 보기'
            : '상담 예약하기'}
      </button>
    </div>
  );
}
