'use client';

import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import ProgressBar from '@/components/baseelements/ProgressBar';
import InfoBox from '@/components/modules/InfoBox';
import Header from '@/components/navigation/Header';
import TrustStepLayout from '../../components/trust/TrustStepLayout';

export default function ChangeAgentPage() {
  const router = useRouter();
  const [openPermission, setOpenPermission] = useState(true);
  const permissionId = useId();
  return (
    <TrustStepLayout
      footer={
        <footer className="shrink-0 bg-white px-6 py-4">
          <PrimaryButton
            label="상담 예약하기"
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
                  권
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[14px] leading-6 font-semibold tracking-tight text-black">
                    권하나
                  </span>
                  <span className="rounded-full bg-[#E9F8F9] px-2.5 py-1 text-[11px] leading-4 font-medium text-hana-ez-600">
                    배우자
                  </span>
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
      </section>
    </TrustStepLayout>
  );
}
