'use client';

import { useRouter } from 'next/navigation';
import { Route } from 'next';
import StepHeader from '../components/StepHeader';
import DotIndicator from '../components/DotIndicator';

export default function HospicePage() {
  const router = useRouter();

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <StepHeader title="연명의료 결정" exitHref={'/future/advance-directive' as Route} />

      <div className="flex flex-col flex-1 px-[25px]">
        {/* dot indicator */}
        <div className="flex justify-center mt-[54px]">
          <DotIndicator total={3} current={1} />
        </div>

        {/* 질문 */}
        <h2 className="font-medium text-[22px] leading-[33px] tracking-[-0.02em] text-black mt-[61px]">
          추후, 호스피스 완화의료를{'\n'}이용하시겠어요?
        </h2>

        {/* 안내 박스 */}
        <div className="flex flex-row items-center gap-[10px] mt-[103px] px-[16px] h-[60px] rounded-[14px] bg-[#FFF9E7]">
          <span className="text-[20px]">💡</span>
          <p className="font-normal text-[11px] leading-[15px] tracking-[-0.15px] text-[#FAA131]">
            호스피스는 치료를 포기하는 것이 아니라, 남은 시간을 편안하게 보내도록 돕는 서비스입니다.
          </p>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-[7px] px-[25px] pb-[30px] bg-white">
        <button
          onClick={() => router.push('/future/advance-directive/view-consent' as Route)}
          className="w-full h-[53px] rounded-[10px] font-medium text-[16px] text-white"
          style={{ backgroundColor: '#01A5AC' }}
        >
          동의하고 도움 받기
        </button>
        <button
          onClick={() => router.back()}
          className="w-full h-[53px] rounded-[10px] font-semibold text-[16px] text-[#99A1AF] bg-[#E5E7EB]"
        >
          닫기
        </button>
      </div>
    </div>
  );
}