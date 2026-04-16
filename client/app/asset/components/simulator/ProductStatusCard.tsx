'use client';

import { CircleDollarSign, Home } from 'lucide-react';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import type {
  TrustProductDetail,
  TrustSimulationSummary,
} from '@/app/asset/actions/trust';
import { handleReservation } from '../../constants/trustUtils';
import { formatKoreanCurrency } from '../../utils/formatCurrency';

type ProductStatus = 'recommend' | 'designed' | 'active';

interface Props {
  type: 'trust' | 'pension';
  status: ProductStatus;
  onAction?: () => void;
  isLoading?: boolean;
  ownerLabel?: string;
  simulationSummary?: TrustSimulationSummary | null; // 신탁용
  productSummary?: TrustProductDetail | null; // 신탁용
  pensionSimulationSummary?: any | null; // 주택연금 설계용
  pensionProductSummary?: any | null; // 주택연금 운용용
}

function formatRate(value?: number) {
  if (typeof value !== 'number') return '-';
  return `${value >= 0 ? '+' : ''}${value}%`;
}

export function ProductStatusCard({
  type,
  status,
  onAction,
  isLoading = false,
  ownerLabel,
  simulationSummary,
  productSummary,
  pensionSimulationSummary,
  pensionProductSummary,
}: Props) {
  const router = useRouter();
  const isTrust = type === 'trust';
  const isPension = type === 'pension';
  const title = isTrust ? '내맘대로신탁' : '주택연금';
  const Icon = isTrust ? CircleDollarSign : Home;
  const isActive = status === 'active';
  const isRecommend = status === 'recommend';
  const isDesigned = status === 'designed';

  const handleNavigation = () => {
    if (onAction) return onAction();

    if (isActive) {
      router.push(
        isTrust
          ? ('/asset/trust/dashboard' as Route)
          : ('/asset/home-pension/dashboard' as Route),
      );
      return;
    }
    if (isRecommend) {
      router.push(
        isTrust ? ('/asset/trust' as Route) : ('/asset/home-pension' as Route),
      );
      return;
    }
    if (isTrust) router.push('/asset/trust/result' as Route);
  };

  // 1. 로딩 상태
  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-[#F2F3F5] bg-white p-6 shadow-sm">
        <div className="py-6 text-[14px] font-medium text-[#9CA3AF]">
          정보를 불러오는 중이에요...
        </div>
      </div>
    );
  }

  // 2. 운용중 상태 (Active)
  if (isActive) {
    const displayData = isTrust ? productSummary : pensionProductSummary;
    if (!displayData) return null;

    return (
      <div className="rounded-[28px] border border-[#F2F3F5] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F9F9]">
              <Icon size={20} className="text-hana-ez-600" />
            </div>
            <div>
              <span className="block text-[17px] font-bold text-[#1F2937]">
                {isTrust ? displayData.productName || title : title}
              </span>
              {ownerLabel && (
                <span className="text-[12px] font-medium text-[#9CA3AF]">
                  {ownerLabel}
                </span>
              )}
            </div>
          </div>
          <span className="rounded-full bg-[#E9F0FF] px-5 py-1.5 text-[14px] font-bold text-[#4F80FF]">
            운용중
          </span>
        </div>

        <p className="mb-1 text-[15px] font-semibold text-hana-ez-600">
          {isTrust ? '현재 자산' : '이번달 수령액'}
        </p>

        <div className="flex items-baseline gap-2">
          <span className="text-[28px] font-extrabold text-black">
            {formatKoreanCurrency(
              isTrust
                ? displayData.currentAmount
                : displayData.currentMonthlyPayout,
            )}
          </span>
          {isTrust && (
            <span className="text-[20px] font-bold text-red-500">
              {formatRate(displayData.profitRate)}
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-col gap-2 text-[15px] text-hana-black-800">
          {isTrust ? (
            <>
              <p>
                원금 ·{' '}
                <span className="font-semibold text-black">
                  {formatKoreanCurrency(displayData.principalAmount)}
                </span>
              </p>
              <p>
                누적 수익 ·{' '}
                <span className="font-semibold text-red-500">
                  {formatKoreanCurrency(displayData.profit)}
                </span>
              </p>
            </>
          ) : (
            <>
              <p>
                수령 방식 ·{' '}
                <span className="font-semibold text-black">
                  {displayData.pensionPayoutLabel}
                </span>
              </p>
              <p>
                누적 수령 ·{' '}
                <span className="font-semibold text-red-500">
                  {formatKoreanCurrency(displayData.currentCumulativeAmount)}
                </span>
              </p>
            </>
          )}
        </div>
        <button
          onClick={handleNavigation}
          className="mt-5 w-full rounded-2xl bg-hana-ez-600 py-3 text-[14px] font-semibold text-white active:bg-hana-ez-700"
        >
          상세 보기
        </button>
      </div>
    );
  }

  // 3. 설계완료 상태 (Designed)
  if (isDesigned) {
    const simData = isTrust ? simulationSummary : pensionSimulationSummary;
    if (!simData) return null;

    return (
      <div className="rounded-[28px] border border-[#F2F3F5] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F9F9]">
              <Icon size={20} className="text-hana-ez-600" />
            </div>
            <span className="text-[17px] font-bold text-[#1F2937]">
              {title}
            </span>
          </div>
          <span className="rounded-full bg-[#FFF9E9] px-5 py-1.5 text-[14px] font-bold text-[#FFA800]">
            설계완료
          </span>
        </div>

        <p className="mb-1 text-[15px] font-semibold text-hana-ez-600">
          {isTrust ? '5년 후 예상 자산' : '20년 후 누적 수령액'}
        </p>

        <div className="flex items-baseline gap-2">
          <span className="text-[28px] font-extrabold text-black">
            {formatKoreanCurrency(
              isTrust
                ? simData.expectedNetAmount
                : simData.recommendedCumulativeAmount,
            )}
          </span>
          {isTrust && (
            <span className="text-[20px] font-bold text-red-500">
              {formatRate(simData.profitRate)}
            </span>
          )}
        </div>

        <div className="mt-2 flex gap-4 text-[15px] text-hana-black-800">
          {isTrust ? (
            <>
              <p>
                원금 ·{' '}
                <span className="font-semibold text-black">
                  {formatKoreanCurrency(simData.principalAmount)}
                </span>
              </p>
              <p>
                예상 수익 ·{' '}
                <span className="font-semibold text-red-500">
                  {formatKoreanCurrency(simData.expectedProfit)}
                </span>
              </p>
            </>
          ) : (
            <>
              <p>
                추천 방식 ·{' '}
                <span className="font-semibold text-black">
                  {simData.recommendedLabel}
                </span>
              </p>
              <p>
                월 수령 ·{' '}
                <span className="font-semibold text-red-500">
                  {formatKoreanCurrency(simData.recommendedMonthlyAmount)}
                </span>
              </p>
            </>
          )}
        </div>
        <button
          onClick={handleReservation}
          className="mt-5 w-full rounded-2xl bg-hana-ez-600 py-3 text-[14px] font-semibold text-white active:bg-hana-ez-700"
        >
          상담 예약하기
        </button>
      </div>
    );
  }

  // 4. 추천 상태 (Recommend)
  return (
    <div className="rounded-[28px] border border-[#F2F3F5] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F0F9F9]">
            <Icon size={20} className="text-hana-ez-600" />
          </div>
          <span className="text-[17px] font-bold text-[#1F2937]">{title}</span>
        </div>
        <span className="rounded-full bg-[#FFF9E9] px-5 py-1.5 text-[14px] font-bold text-[#FFA800]">
          추천
        </span>
      </div>

      <div className="mb-3 space-y-1.5">
        <p className="text-[15px] text-hana-black-800">
          • {isTrust ? '내 자산을 전문가에게 맡겨 운용' : '이사 계획이 없다면?'}
        </p>
        <p className="text-[15px] text-hana-black-800">
          • {isTrust ? '병원비·생활비 자동 집행' : '매달 안정적인 추가 현금'}
        </p>
        <p className="mt-3 text-[17px] font-bold text-hana-ez-600">
          {isTrust ? '전문가 운용, 안정적 수익' : '평생 거주, 매달 고정 수입'}
        </p>
      </div>

      <button
        onClick={handleNavigation}
        className="w-full rounded-2xl bg-hana-ez-600 py-3 text-[14px] font-semibold text-white active:bg-hana-ez-700"
      >
        맞춤형 설계해보기
      </button>
    </div>
  );
}
