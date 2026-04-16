'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useState, useTransition } from 'react';
import {
  getTrustProductSummary,
  type TrustProductDetail,
  updateTrustAgentView,
} from '@/app/asset/actions/trust';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import StackedActionFooter from '@/components/modules/StackedActionFooter';
import Header from '@/components/navigation/Header';
import TrustStepLayout from '../../components/trust/TrustStepLayout';
import { handleReservation } from '../../constants/trustUtils';

export default function ChangeAgentPage() {
  const router = useRouter();
  const permissionId = useId();

  const [productDetail, setProductDetail] = useState<TrustProductDetail | null>(
    null,
  );
  const [openPermission, setOpenPermission] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductSummary = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await getTrustProductSummary();
        setProductDetail(data);
        setOpenPermission(data?.agentViewEnabled ?? true);
      } catch (error) {
        console.error('신탁 운용 현황 조회 실패', error);
        setError('신탁 정보를 불러오지 못했어요.');
        setProductDetail(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductSummary();
  }, []);

  const handleSubmit = () => {
    setSubmitError(null);

    startTransition(async () => {
      try {
        await updateTrustAgentView({
          agentViewEnabled: openPermission,
        });

        router.push('/asset/trust/dashboard');
      } catch (error) {
        console.error('신탁 현황 열람 권한 수정 실패', error);
        setSubmitError('저장에 실패했어요. 다시 시도해주세요.');
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
              className="h-14 rounded-2xl text-[16px]"
              onClick={() => window.location.reload()}
            />
          </footer>
        }
      >
        <Header title="신탁 설정 변경" showBackButton />
        <section className="px-6 pt-8">
          <ProgressBar step={6} />

          <div className="mt-14">
            <h2 className="text-[22px] font-bold text-black">
              불러오기에 실패했어요
            </h2>
            <p className="mt-4 text-[14px] text-[#6A7282]">
              네트워크 상태를 확인하고 다시 시도해주세요.
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
              label="저장하기"
              className="h-14 rounded-2xl text-[16px] leading-6"
              disabled
            />
          </footer>
        }
      >
        <Header title="신탁 설정 변경" showBackButton />
        <section className="px-6 pt-8">
          <ProgressBar step={6} />
          <div className="mt-14 text-[14px] text-[#9CA3AF]">불러오는 중...</div>
        </section>
      </TrustStepLayout>
    );
  }

  if (!productDetail?.claimAgent) {
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
          <ProgressBar step={6} />
          <div className="mt-14">
            <h2 className="text-[22px] leading-[1.45] font-bold tracking-tight text-black">
              신탁 현황 열람 권한 수정하기
            </h2>
            <p className="mt-4 text-[14px] leading-5 tracking-snug text-[#6A7282]">
              현재 등록된 지급청구대리인 정보가 없어요.
            </p>
          </div>
        </section>
      </TrustStepLayout>
    );
  }

  const claimAgent = productDetail.claimAgent;
  const initial = claimAgent.userName?.charAt(0) ?? '-';

  return (
    <TrustStepLayout
      footer={
        <StackedActionFooter
          onConsultClick={handleReservation}
          onNextClick={handleSubmit}
          nextDisabled={isPending}
        />
      }
    >
      <Header title="신탁 설정 변경" showBackButton />

      <section className="px-6 pt-8">
        <ProgressBar step={6} />

        <div className="mt-14">
          <h2 className="text-[22px] leading-[1.45] font-bold tracking-tight text-black">
            신탁 현황 열람 권한 수정하기
          </h2>
          <p className="mt-4 text-[14px] leading-5 font-normal tracking-snug text-[#6A7282]">
            혹시 모를 상황에도, 대리인이 바로 확인하고
            <br />
            자산을 보호할 수 있도록 열람 권한을 설정해주세요.
          </p>
        </div>

        <div className="mt-12">
          <p className="mb-3 text-[13px] leading-5 font-medium tracking-snug text-[#6A7282]">
            등록한 지급청구대리인
          </p>

          <div className="rounded-4xl border border-[#F2F3F5] bg-white px-5 py-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F8F9] text-[19px] font-semibold text-hana-ez-600">
                  {initial}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[14px] leading-6 font-semibold tracking-tight text-black">
                    {claimAgent.userName}
                  </span>

                  {claimAgent.relation ? (
                    <span className="rounded-full bg-[#E9F8F9] px-2.5 py-1 text-[11px] leading-4 font-medium text-hana-ez-600">
                      {claimAgent.relation}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  id={permissionId}
                  className="text-[12px] leading-5 text-[#9CA3AF]"
                >
                  열람 권한
                </span>

                <button
                  type="button"
                  role="switch"
                  aria-labelledby={permissionId}
                  aria-checked={openPermission}
                  onClick={() => setOpenPermission((prev) => !prev)}
                  className={`relative h-5 w-10 rounded-full transition ${
                    openPermission ? 'bg-hana-ez-600' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <span
                    className={`absolute top-1 h-3 w-3 rounded-full bg-white transition ${
                      openPermission ? 'left-6' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        {submitError && (
          <p className="mt-4 text-[14px] text-red-500">{submitError}</p>
        )}
      </section>
    </TrustStepLayout>
  );
}
