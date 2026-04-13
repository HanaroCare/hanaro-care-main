'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from 'next';
import Header from '@/components/Header';
import DotIndicator from '@/app/future/components/DotIndicator';

const deliveryOptions = ['전자우편', '이동전화 문자메시지', '우편물'];

export default function DeliveryPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <Header title="새생명 나눔" />

      <div className="flex flex-col flex-1 px-[25px] pt-[65px]">
        {/* dot indicator */}
        <div className="flex justify-center mt-[54px]">
          <DotIndicator total={3} current={1} />
        </div>

        {/* 질문 */}
        <h2 className="font-medium text-[22px] leading-[33px] tracking-[-0.02em] text-black mt-[61px]">
          기증등록서를{'\n'}보내드릴까요?
        </h2>

        {/* 체크박스 목록 */}
        <div className="flex flex-col gap-[7px] mt-[30px]">
          {deliveryOptions.map((option) => (
            <div
              key={option}
              className="flex flex-row items-center justify-between h-[45px] cursor-pointer"
              onClick={() => setSelected(option)}
            >
              <span className="font-semibold text-[16px] leading-[21px] text-[#22262B]">{option}</span>
              <div
                className="w-[24px] h-[24px] rounded-[6px] border-2 flex items-center justify-center transition-all"
                style={{
                  borderColor: selected === option ? '#008485' : '#D1D5DB',
                  backgroundColor: selected === option ? '#008485' : 'white',
                }}
              >
                {selected === option && (
                  <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                    <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="flex flex-row items-center justify-center gap-[19px] px-[25px] pb-[40px]">
        <button
          onClick={() => router.push('/future/organ-donation/license' as Route)}
          className="flex-1 h-[44px] rounded-[10px] border border-[#C4C4C4] font-semibold text-[16px] text-[#C4C4C4]"
        >
          건너뛰기
        </button>
        <button
          onClick={() => router.push('/future/organ-donation/license' as Route)}
          className="flex-1 h-[44px] rounded-[10px] font-semibold text-[16px] text-white"
          style={{ backgroundColor: '#01A5AC' }}
        >
          다운로드
        </button>
      </div>
    </div>
  );
}