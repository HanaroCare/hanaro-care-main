'use client';

import { BellRing } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AlertBanner } from '@/components/AlertBanner';
import PrimaryButton from '@/components/PrimaryButton';

export default function CheckHomePage() {
  const router = useRouter();

  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <main className="app-main no-scrollbar px-6 pt-8 pb-8">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
                마이데이터 연동 주택
              </h2>

              <button
                type="button"
                className="rounded-full bg-[#E9F8F9] px-5 py-3 text-[15px] leading-5 font-semibold tracking-tight text-hana-ez-600"
              >
                주택 정보 변경하기
              </button>
            </div>

            <div className="mt-4 rounded-[28px] border border-[#E5E7EB] bg-white px-7 py-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <p className="text-[18px] leading-7 font-bold tracking-tight text-[#111827]">
                서울 용산구 한남동
              </p>
              <p className="mt-2 text-[14px] leading-5 font-medium tracking-tight text-[#6B7280]">
                에테르노청담 244.72m² · 15층
              </p>

              <div className="mt-8 flex items-start justify-between">
                <div>
                  <p className="text-[14px] leading-5 font-medium text-[#6B7280]">
                    KB 시세
                  </p>
                  <p className="mt-2 text-[24px] leading-8 font-bold tracking-tight text-[#111827]">
                    약 356억
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[14px] leading-5 font-medium text-[#6B7280]">
                    전월 대비
                  </p>
                  <p className="mt-2 text-[24px] leading-8 font-bold tracking-tight text-hana-red-500">
                    +150억
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="rounded-[20px] bg-[#F3F4F6] px-6 py-6">
                  <p className="text-[14px] leading-5 font-medium text-[#6B7280]">
                    공시가격
                  </p>
                  <p className="mt-3 text-[20px] leading-7 font-bold tracking-tight text-[#111827]">
                    356억
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#F3F4F6] px-6 py-6">
                  <p className="text-[14px] leading-5 font-medium text-[#6B7280]">
                    취득년도
                  </p>
                  <p className="mt-3 text-[20px] leading-7 font-bold tracking-tight text-[#111827]">
                    2023년
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <AlertBanner
                variant="success"
                icon={<BellRing size={22} aria-hidden="true" />}
                message="공시지가가 12억이 초과되어서 아래 상품에 가입할 수 있어요!"
              />
            </div>

            <div className="mt-8 rounded-[28px] border border-[#E5E7EB] bg-white px-7 py-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[18px] leading-7 font-bold tracking-tight text-[#111827]">
                    하나 내집연금
                  </p>
                </div>

                <div className="shrink-0 whitespace-nowrap rounded-full bg-[#E9F8F9] px-3 py-2 text-[13px] leading-5 font-semibold tracking-tight text-hana-ez-600">
                  거주 유지
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-[14px] leading-7 font-medium tracking-tight text-[#6B7280]">
                  • 12억 초과 주택도 가입가능한 민간 역모기지론
                </p>
                <p className="text-[14px] leading-7 font-medium tracking-tight text-[#6B7280]">
                  • 하나은행 자체 상품 → 집에 살면서 연금 수령
                </p>
              </div>

              <p className="mt-6 text-[20px] leading-8 font-bold tracking-tight text-hana-ez-600">
                월 약 300만원 수령 가능
              </p>
            </div>
          </section>
        </main>

        <footer className="shrink-0 bg-white px-6 py-4">
          <PrimaryButton
            label="집값 예측"
            onClick={() => {
              router.push('/asset/home-pension/predict');
            }}
            className="h-14 rounded-2xl text-[16px] leading-6"
          />
        </footer>
      </div>
    </div>
  );
}
