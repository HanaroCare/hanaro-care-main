'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  getTrustProduct,
  type TrustProductDetail,
  updateTrustPayoutSettings,
} from '@/app/asset/actions/trust';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import { AlertBanner } from '@/components/modules/AlertBanner';
import StackedActionFooter from '@/components/modules/StackedActionFooter';
import Header from '@/components/navigation/Header';
import TrustStepLayout from '../../components/trust/TrustStepLayout';
import {
  formatKoreanAmount,
  handleReservation,
} from '../../constants/trustUtils';

type UsageItem = {
  id: 'hospital' | 'living';
  title: string;
  amount: number;
};

export default function ChangeUsagePage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [productDetail, setProductDetail] = useState<TrustProductDetail | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [items, setItems] = useState<UsageItem[]>([]);

  useEffect(() => {
    const fetchProductSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getTrustProduct();

        if (!data) {
          setProductDetail(null);
          setItems([]);
          setSelected(new Set());
          return;
        }

        setProductDetail(data);

        if (!data.executionSetting) {
          setItems([]);
          setSelected(new Set());
          return;
        }

        const nextItems: UsageItem[] = [
          {
            id: 'hospital',
            title: '병원비 자동 집행',
            amount: data.executionSetting.hospitalAmount ?? 0,
          },
          {
            id: 'living',
            title: '생활비',
            amount: data.executionSetting.livingAmount ?? 0,
          },
        ];

        setItems(nextItems);

        const nextSelected = new Set<string>();
        if (data.executionSetting.hospitalEnabled) nextSelected.add('hospital');
        if (data.executionSetting.livingEnabled) nextSelected.add('living');
        setSelected(nextSelected);
      } catch (err) {
        console.error('신탁 운용 현황 조회 실패', err);
        setError('현재 신탁 설정 정보를 불러오지 못했어요.');
        setProductDetail(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductSummary();
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const total = useMemo(() => {
    return items
      .filter((item) => selected.has(item.id))
      .reduce((sum, item) => sum + item.amount, 0);
  }, [items, selected]);

  const handleNext = () => {
    setSubmitError(null);

    startTransition(async () => {
      const requestItems = items
        .filter((item) => selected.has(item.id))
        .map((item) => ({
          type: item.id === 'hospital' ? 'HOSPITAL' : 'LIVING',
          amount: item.amount,
        })) as { type: 'HOSPITAL' | 'LIVING'; amount: number }[];

      try {
        await updateTrustPayoutSettings({
          items: requestItems,
        });

        router.push('/asset/trust/change-agent');
      } catch (err) {
        console.error('신탁 자금 사용처 수정 실패', err);
        setSubmitError(
          '신탁 자금 사용처 저장에 실패했어요. 다시 시도해주세요.',
        );
      }
    });
  };

  if (error) {
    return (
      <TrustStepLayout
        footer={
          <footer className="shrink-0 bg-white px-6 py-4">
            <PrimaryButton
              label="다시 시도"
              className="h-14 rounded-2xl text-[16px] leading-6"
              onClick={() => window.location.reload()}
            />
          </footer>
        }
      >
        <Header title="신탁 설정 변경" showBackButton />

        <section className="px-6 pt-8">
          <ProgressBar step={3} />

          <div className="mt-12">
            <h2 className="text-[22px] leading-[1.45] font-bold tracking-tight text-black">
              불러오기에 실패했어요
            </h2>
            <p className="mt-4 text-[14px] leading-5 text-[#6A7282]">
              네트워크 상태를 확인한 뒤 다시 시도해주세요.
            </p>
          </div>
        </section>
      </TrustStepLayout>
    );
  }

  if (isLoading) {
    return (
      <TrustStepLayout
        footer={
          <footer className="shrink-0 bg-white px-6 py-4">
            <PrimaryButton
              label="다음"
              className="h-14 rounded-2xl text-[16px] leading-6"
              disabled
            />
          </footer>
        }
      >
        <Header title="신탁 설정 변경" showBackButton />

        <section className="px-6 pt-8">
          <ProgressBar step={3} />
          <div className="mt-12 text-[14px] text-[#9CA3AF]">불러오는 중...</div>
        </section>
      </TrustStepLayout>
    );
  }

  if (!productDetail) {
    return (
      <TrustStepLayout
        footer={
          <footer className="shrink-0 bg-white px-6 py-4">
            <PrimaryButton
              label="돌아가기"
              className="h-14 rounded-2xl text-[16px] leading-6"
              onClick={() => router.back()}
            />
          </footer>
        }
      >
        <Header title="신탁 설정 변경" showBackButton />

        <section className="px-6 pt-8">
          <ProgressBar step={3} />
          <div className="mt-12 text-[14px] text-[#9CA3AF]">
            현재 신탁 정보를 찾을 수 없어요.
          </div>
        </section>
      </TrustStepLayout>
    );
  }

  return (
    <TrustStepLayout
      footer={
        <StackedActionFooter
          onConsultClick={handleReservation}
          onNextClick={handleNext}
          nextDisabled={selected.size === 0 || isPending}
        />
      }
    >
      <Header title="신탁 설정 변경" showBackButton />

      <section className="px-6 pt-8">
        <ProgressBar step={3} />

        <div className="mt-12">
          <h2 className="text-[22px] leading-[1.45] font-bold tracking-tight text-black">
            신탁 자금을 어디에
            <br />
            사용할까요?
          </h2>

          <div className="mt-4 flex justify-center">
            <AlertBanner
              variant="info"
              message="현재 설정된 사용처 기준으로 불러왔어요"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5">
          {items.map((item) => {
            const isSelected = selected.has(item.id);

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggle(item.id)}
                className={`flex min-h-20 items-center justify-between rounded-[24px] px-6 py-7 text-left shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition ${
                  isSelected
                    ? 'border border-hana-ez-600 bg-[#EFFFFD]'
                    : 'border border-[#F2F3F5] bg-white'
                }`}
              >
                <p className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                  {item.title}
                </p>

                <p
                  className={`text-[16px] leading-6 font-medium tracking-tight ${
                    isSelected ? 'text-hana-ez-600' : 'text-[#1F2937]'
                  }`}
                >
                  월 {formatKoreanAmount(item.amount)}
                </p>
              </button>
            );
          })}
        </div>

        {selected.size > 0 && (
          <div className="mt-6 rounded-[20px] bg-[#EFF8F7] px-6 py-7">
            <div className="flex items-center justify-between">
              <span className="text-[16px] leading-6 font-semibold tracking-tight text-hana-ez-600">
                월 집행 합계
              </span>
              <span className="text-[22px] leading-8 font-bold tracking-tight text-hana-ez-600">
                {formatKoreanAmount(total)}
              </span>
            </div>
          </div>
        )}

        {submitError && (
          <p className="mt-4 text-[14px] leading-5 text-[#EF4444]">
            {submitError}
          </p>
        )}
      </section>
    </TrustStepLayout>
  );
}
