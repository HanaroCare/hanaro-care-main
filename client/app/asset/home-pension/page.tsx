'use client';
import { CircleCheck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SubHeader from '@/components/SubHeader';
import DualActionFooter from '../../../components/DualActionFooter';

const benefits = [
  'KB시세가 있는 아파트',
  '나를 위한 맞춤형 주택 매각 계획 알기',
  '영업점 방문 없이 모바일로 간편하게',
];

export default function HomePensionPage() {
  const [showEmptyModal, setShowEmptyModal] = useState(false);
  const router = useRouter();

  return (
    <div className="app-shell">
      <div className="app-layout relative bg-white">
        <SubHeader title="주택 연금" backUrl="/asset" closeUrl="/asset" />
        <main className="app-main no-scrollbar">
          <section className="px-7 pt-9">
            <p className="mb-2 text-[12px] leading-[18px] font-normal text-[#6A7282]">
              하나은행 주택연금
            </p>

            <h2 className="text-[28px] leading-[42px] font-bold tracking-[-0.03em] text-[#101828]">
              신청부터 약정까지
              <br />
              모바일로 간편하게
            </h2>

            <div className="mt-9 flex justify-center">
              <Image
                src="/images/asset/housing.png"
                alt="주택연금 건물 일러스트"
                width={210}
                height={180}
                className="h-[180px] w-[210px] object-contain"
                priority
              />
            </div>

            <div className="mt-7 rounded-[24px] bg-hana-silver-50 px-6 py-6">
              <div className="flex flex-col gap-5">
                {benefits.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CircleCheck
                      size={20}
                      className="shrink-0 text-[#5E6B7A]"
                    />
                    <p className="text-[16px] leading-6 font-medium tracking-[-0.02em] text-[#4B5563]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <p className="text-[13px] leading-5 font-normal text-[#9CA3AF]">
                최대 한도
              </p>
              <p className="mt-1 text-[22px] leading-8 font-bold tracking-[-0.02em] text-[#111827]">
                4억원
              </p>
            </div>
          </section>
        </main>

        <DualActionFooter
          leftLabel="상담 신청"
          rightLabel="설계해보기"
          onLeftClick={() => setShowEmptyModal(true)}
          onRightClick={() => {
            router.push('/asset/home-pension/check-home');
          }}
        />

        {showEmptyModal && (
          <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 px-10">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="empty-home-modal-title"
              className="w-full max-w-65 rounded-[24px] bg-white px-6 py-8 shadow-[0_10px_30px_rgba(0,0,0,0.16)]"
            >
              <p
                id="empty-home-modal-title"
                className="text-center text-[18px] leading-[30px] font-medium tracking-[-0.03em] text-[`#1F2937`]"
              >
                현재 조회되는
                <br />
                주택이 없습니다.
              </p>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowEmptyModal(false)}
                  className="h-11 flex-1 rounded-[14px] bg-[#E9F8F9] text-[15px] font-semibold text-hana-ez-600"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmptyModal(false);
                    // router.push('/asset/housing/register');
                  }}
                  className="h-11 flex-1 rounded-[14px] bg-hana-ez-600 text-[15px] font-semibold text-white"
                >
                  등록하러 가기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
