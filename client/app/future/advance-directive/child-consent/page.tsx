'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from 'next';
import StepHeader from '../components/StepHeader';
import DotIndicator from '../components/DotIndicator';

export default function ChildConsentPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<'yes' | 'no' | null>(null);

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <StepHeader title="연명의료 결정" exitHref={'/future/advance-directive' as Route} />

      <div className="flex flex-col flex-1 px-[25px]">
        {/* dot indicator */}
        <div className="flex justify-center mt-[54px]">
          <DotIndicator total={3} current={3} />
        </div>

        {/* 질문 */}
        <h2 className="font-medium text-[22px] leading-[33px] tracking-[-0.02em] text-black mt-[61px]">
          자녀가 이 결정 내용을{'\n'}확인하는 것에 동의하시나요?
        </h2>

        {/* 예/아니요 버튼 */}
        <div className="flex flex-row gap-[9px] mt-[100px]">
          <button
            onClick={() => setSelected('yes')}
            className="flex-1 h-[129px] rounded-2xl font-medium text-[18px] transition-all"
            style={{
              backgroundColor: selected === 'yes' ? '#EEFFFC' : '#F6F7F8',
              color: selected === 'yes' ? '#109595' : '#E5E5E5',
            }}
          >
            예
          </button>
          <button
            onClick={() => setSelected('no')}
            className="flex-1 h-[129px] rounded-2xl font-medium text-[18px] transition-all"
            style={{
              backgroundColor: selected === 'no' ? '#EEFFFC' : '#F6F7F8',
              color: selected === 'no' ? '#109595' : '#E5E5E5',
            }}
          >
            아니요
          </button>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 px-[25px] pb-[30px] bg-white">
        <button
          onClick={() => router.push('/future/advance-directive/complete' as Route)}
          disabled={!selected}
          className="w-full h-[53px] rounded-[10px] font-medium text-[16px] text-white transition-all"
          style={{ backgroundColor: selected ? '#01A5AC' : 'rgba(1,165,172,0.4)' }}
        >
          완료하기
        </button>
      </div>
    </div>
  );
}