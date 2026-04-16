'use client';

import { CircleCheck } from 'lucide-react';
import type { Route } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getLinkedHouses } from '@/app/asset/actions/pension';
import ConfirmModal from '@/components/modules/ConfirmModal';
import DualActionFooter from '@/components/modules/DualActionFooter';
import Header from '@/components/navigation/Header';
import { handleReservation } from '../constants/trustUtils';

interface BenefitItem {
  title: string;
  description: string;
}

const mainBenefits: BenefitItem[] = [
  {
    title: '평생 거주 + 평생 지급',
    description: '내 집에서 계속 살면서, 평생 매달 연금을 받아요',
  },
  {
    title: '집값이 내려가도 연금은 그대로',
    description: '나중에 집값이 떨어져도 정해진 연금액은 국가가 보증해요',
  },
  {
    title: '남은 집값은 자녀에게 상속',
    description: '받아온 연금보다 집값이 비싸면 차액은 자녀에게 상속돼요',
  },
];

export default function HomePensionPage() {
  const [showEmptyModal, setShowEmptyModal] = useState(false);
  const [isChecking, setIsChecking] = useState(false); // 조회 중 로딩 상태
  const router = useRouter();

  /**
   * [핵심 로직]
   * 설계해보기 클릭 시 주택을 먼저 조회하고 분기 처리합니다.
   */
  const handleDesignClick = async () => {
    try {
      setIsChecking(true);

      // 1. 서버 액션을 통해 연동된 주택 리스트 조회
      const houses = await getLinkedHouses();

      if (houses && houses.length > 0) {
        // 2. 주택이 하나라도 있으면 선택 페이지로 이동
        router.push('/asset/home-pension/check-home' as Route);
      } else {
        // 3. 주택이 하나도 없으면 현재 페이지에서 모달 노출
        setShowEmptyModal(true);
      }
    } catch (error) {
      console.error('주택 조회 중 오류 발생:', error);
      // 에러 발생 시에도 사용자 흐름을 위해 모달을 띄우거나 안내 처리
      setShowEmptyModal(true);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="app-layout relative bg-white">
        <Header title="주택 연금" />

        <main className="app-main no-scrollbar">
          <section className="px-6.25 pt-6">
            {/* 상단 텍스트 영역 */}
            <div className="flex flex-col">
              <p className="mb-1 font-normal text-[#6A7282] text-[12px] leading-4.5">
                하나은행 주택연금
              </p>

              <h1 className="m-0 font-bold text-[#101828] text-[28px] leading-10.5">
                평생 내 집에서
                <br />
                매달 든든한 월급 받기
              </h1>
            </div>

            {/* 중앙 일러스트 영역 */}
            <div className="mt-10 flex justify-center">
              <Image
                src="/images/asset/housing.svg"
                alt="주택연금 건물 일러스트"
                width={240}
                height={200}
                className="h-[200px] w-[240px] object-contain"
                priority
              />
            </div>

            {/* 수령액 안내 */}
            <div className="mt-5">
              <p className="text-[15px] leading-6 font-medium text-[#4B5563]">
                지금 가입하면 평생 동안 최대
              </p>
              <p className="mt-2 text-[30px] leading-[44px] font-extrabold tracking-[-0.02em] text-[#111827]">
                4억원 수령
              </p>
            </div>

            {/* 장점 리스트 섹션 */}
            <div className="mt-5">
              <h2 className="mb-3 ml-1.5 font-medium text-[16px] text-black leading-6 tracking-[-0.64px]">
                이런 점이 좋아요
              </h2>
              <div className="rounded-[24px] bg-[#F3F4F6] px-6 py-8">
                <div className="flex flex-col gap-8">
                  {mainBenefits.map((benefit) => (
                    <div
                      key={benefit.title}
                      className="flex items-start gap-2.25"
                    >
                      <div className="mt-0.5 shrink-0">
                        <CircleCheck size={20} className="text-[#4A5565]" />
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <p className="m-0 font-medium text-[16px] text-hana-black-800 leading-5.5 tracking-[-0.04em]">
                          {benefit.title}
                        </p>
                        <p className="m-0 text-[14px] text-[#6A7282] leading-5 tracking-[-0.04em]">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* 하단 버튼 영역 */}
        <DualActionFooter
          leftLabel="상담 신청"
          rightLabel={isChecking ? '조회 중...' : '설계해보기'}
          onLeftClick={handleReservation}
          onRightClick={handleDesignClick} // 조회 로직 함수 연결
        />

        {/* 주택 조회 결과가 없을 때 노출되는 모달 */}
        <ConfirmModal
          isOpen={showEmptyModal}
          title={
            <>
              현재 조회되는
              <br />
              주택이 없습니다.
            </>
          }
          cancelLabel="닫기"
          confirmLabel="등록하기"
          onCancel={() => setShowEmptyModal(false)}
          onConfirm={() => {
            setShowEmptyModal(false);
            router.push('/mydata/house' as Route);
          }}
        />
      </div>
    </div>
  );
}
