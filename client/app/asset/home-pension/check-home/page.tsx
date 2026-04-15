'use client';

import { BellRing } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import { AlertBanner } from '@/components/modules/AlertBanner';
import Header from '@/components/navigation/Header';

const HOUSES = [
  {
    id: 1,
    address: '서울 용산구 한남동',
    detail: '에테르노청담 244.72m² · 15층',
    price: '약 356억',
  },
  {
    id: 2,
    address: '서울 강남구 역삼동',
    detail: '역삼자이 84.99m² · 20층',
    price: '약 25억',
  },
];

export default function CheckHomePage() {
  const router = useRouter();
  // 선택된 주택의 ID를 관리하는 상태
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 선택 핸들러: 마우스 클릭 및 키보드 엔터 시 공통 사용
  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  return (
    <div className="app-shell bg-white">
      <div className="app-layout bg-white">
        <Header title="주택 연금 대상 선택" />
        <main className="app-main no-scrollbar px-6 pt-8 pb-8">
          <section>
            <h2 className="text-[16px] leading-6 font-semibold tracking-tight text-[#1F2937]">
              마이데이터 연동 주택
            </h2>

            {/* 주택 리스트 영역 */}
            <div className="mt-4 flex flex-col gap-4">
              {HOUSES.map((house) => {
                const isSelected = selectedId === house.id;
                return (
                  <div
                    key={house.id}
                    // 접근성 설정: 키보드 포커스 가능 및 버튼 역할 부여
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSelected}
                    // 마우스 이벤트
                    onClick={() => handleSelect(house.id)}
                    // 키보드 이벤트: 엔터나 스페이스바 입력 시 선택
                    onKeyUp={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSelect(house.id);
                      }
                    }}
                    className={`cursor-pointer rounded-[28px] border px-7 py-7 shadow-[0_2px_10px_rgba(0,0,0,0.03)] outline-none transition-all focus:ring-2 focus:ring-hana-ez-600 ${
                      isSelected
                        ? 'border-hana-ez-600 bg-[#F0FDFD]'
                        : 'border-[#E5E7EB] bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* 상단: 주소(좌)와 금액(우)을 수평 배치 */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-[18px] leading-7 font-bold tracking-tight text-[#111827]">
                          {house.address}
                        </p>
                        <p className="mt-1 text-[14px] leading-5 font-medium tracking-tight text-[#6B7280]">
                          {house.detail}
                        </p>
                      </div>
                      {/* 주소 오른쪽 상단에 위치하는 금액 */}
                      <p className="text-[20px] leading-7 font-bold tracking-tight text-[#111827] whitespace-nowrap">
                        {house.price}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-20">
              <AlertBanner
                variant="success"
                icon={<BellRing size={22} aria-hidden="true" />}
                message={
                  '주택 가격이 12억이 초과되어도\n아래 상품에 가입할 수 있어요!'
                }
              />
            </div>

            {/* 하단 상품 안내 카드 */}
            <div className="mt-3 rounded-[28px] border border-[#E5E7EB] bg-white px-7 py-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[18px] leading-10 font-bold tracking-tight text-[#111827]">
                    하나 내집연금
                  </p>
                </div>
                <div className="shrink-0 whitespace-nowrap rounded-full bg-[#E9F8F9] px-3 py-2 text-[13px] leading-5 font-semibold tracking-tight text-hana-ez-600">
                  거주 유지
                </div>
              </div>
              <div className="mt-2 space-y-2">
                <p className="text-[14px] leading-7 font-medium tracking-tight text-[#6B7280]">
                  • 12억 초과 주택도 가입가능한 민간 역모기지론
                </p>
                <p className="text-[14px] leading-4 font-medium tracking-tight text-[#6B7280]">
                  • 하나은행 자체 상품 → 집에 살면서 연금 수령
                </p>
              </div>
              <p className="mt-6 text-[19px] leading-4 font-bold tracking-tight text-hana-ez-600">
                월 약 300만원 수령 가능
              </p>
            </div>
          </section>
        </main>

        <footer className="shrink-0 bg-white px-6 py-4">
          <PrimaryButton
            label="AI 집값 예측 시작"
            // 아무것도 선택하지 않았을 때 버튼 비활성화
            disabled={selectedId === null}
            onClick={() => {
              if (selectedId) {
                router.push(`/asset/home-pension/predict?id=${selectedId}`);
              }
            }}
            className={`h-14 rounded-2xl text-[16px] leading-6 transition-colors ${
              selectedId === null ? 'opacity-50' : 'opacity-100'
            }`}
          />
        </footer>
      </div>
    </div>
  );
}
