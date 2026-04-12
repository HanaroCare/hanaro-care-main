'use client';

import { useRouter } from 'next/navigation';
import { Route } from 'next';
import { CheckCircle, Printer, FileText, ChevronLeft, X } from 'lucide-react';
import StepHeader from '../components/StepHeader';

export default function CompletePage() {
  const router = useRouter();

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <StepHeader title="연명의료 결정" exitHref={'/future/advance-directive' as Route} />

      {/* 중앙 완료 영역 */}
      <div className="flex flex-col items-center justify-center flex-1 gap-[24px]">
        <CheckCircle size={100} color="#008485" strokeWidth={2} />
        <h2 className="font-semibold text-[25px] leading-[35px] text-[#3E454C] text-center">
          작성이{'\n'}완료되었습니다.
        </h2>
      </div>

      {/* 하단 버튼 */}
      <div className="flex flex-col gap-[20px] px-[25px] pb-[40px]">
        <button
          onClick={() => router.push('/future/advance-directive' as Route)}
          className="w-full h-[53px] rounded-[10px] font-medium text-[16px] text-white"
          style={{ backgroundColor: '#01A5AC' }}
        >
          확인
        </button>

        <div className="flex flex-row gap-[10px]">
          <button className="flex flex-row items-center justify-center gap-[8px] flex-1 h-[53px] rounded-[10px] border border-[#C4C4C4]">
            <Printer size={24} color="#C4C4C4" />
            <span className="font-medium text-[14px] leading-[20px] tracking-[-0.31px] text-[#C4C4C4]">
              서류 작성하기
            </span>
          </button>
          <button className="flex flex-row items-center justify-center gap-[8px] flex-1 h-[53px] rounded-[10px] border border-[#C4C4C4]">
            <FileText size={24} color="#C4C4C4" />
            <span className="font-medium text-[14px] leading-[20px] tracking-[-0.31px] text-[#C4C4C4]">
              등록하러 가기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}