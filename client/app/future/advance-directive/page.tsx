'use client';

import { useRouter } from 'next/navigation';
import { X, Play, Phone, FileText, Info } from 'lucide-react';
import { Route } from 'next';

const faqItems = [
  {
    question: '어떤 상황에서 필요하나요?',
    answer: '회복 가능성이 없는 임종 과정에서 무의미한 연명치료를 받지 않겠다는 의사를 미리 밝혀두는 것입니다.',
  },
  {
    question: '미리 해두면 뭐가 좋아요?',
    answer: '본인의 의사가 존중되고, 가족의 고통스러운 결정 부담을 줄일 수 있어요.',
  },
  {
    question: '연명의료 결정이 뭔가요?',
    answer:
      '임종 과정에 있는 환자가 심폐소생술, 인공호흡기 등 연명의료를 시행하지 않거나 중단할 수 있도록 미리 결정하는 제도입니다.',
  },
];

export default function AdvanceDirectivePage() {
  const router = useRouter();

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex flex-row justify-between items-center px-4 h-[65px] border-b border-black/10">
        <button onClick={() => router.back()} className="p-1">
          <X size={24} color="#0A0A0A" />
        </button>
        <span className="font-medium text-[16px] leading-[24px] tracking-[-0.04em] text-[#0A0A0A]">
          연명의료 결정
        </span>
        <button onClick={() => router.push('/future' as Route)} className="p-1">
          <X size={24} color="#0A0A0A" />
        </button>
      </div>

      {/* 스크롤 컨테이너 */}
      <div className="flex flex-col flex-1 overflow-y-auto pb-[100px]">
        {/* 동영상 배너 */}
        <div
          className="mx-[25px] mt-[38px] h-[180px] rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #244242 0%, #173636 100%)' }}
        >
          {/* 재생 버튼 */}
          <div
            className="flex items-center justify-center w-[56px] h-[56px] rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <Play size={28} color="white" fill="white" />
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-medium text-[14px] leading-[21px] text-white">동영상으로 이해하는</span>
            <span className="font-medium text-[16px] leading-[24px] text-white">사전연명의료의향서</span>
          </div>
        </div>

        {/* 설명 카드 */}
        <div className="mx-[25px] mt-[45px] border border-[#E3E5E8] rounded-xl p-[24px] flex flex-col gap-[25px]">
          {faqItems.map((item, index) => (
            <div key={index} className="flex flex-col gap-[3px]">
              <div className="flex flex-row items-center gap-[5px]">
                <Info size={15} color="#000000" />
                <span className="font-semibold text-[13px] leading-[21px] text-[#1A212D]">{item.question}</span>
              </div>
              <p className="font-normal text-[12px] leading-[21px] text-[#6B7280]">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-row gap-[7px] px-[25px] pb-[30px] bg-white">
        {/* 전화 상담하기 */}
        <button
          onClick={() => router.push('/future/advance-directive/consult' as Route)}
          className="flex flex-row items-center justify-center gap-2 flex-1 h-[53px] rounded-[10px]"
          style={{ backgroundColor: '#E9F8F9' }}
        >
          <Phone size={16} color="#008485" />
          <span className="font-semibold text-[14px] leading-[20px] tracking-[-0.15px] text-[#008485]">
            전화 상담하기
          </span>
        </button>

        {/* 신청서 작성하기 */}
        <button
          onClick={() => router.push('/future/advance-directive/hospice' as Route)}
          className="flex flex-row items-center justify-center gap-2 flex-1 h-[53px] rounded-[10px]"
          style={{ backgroundColor: '#01A5AC' }}
        >
          <FileText size={16} color="white" />
          <span className="font-semibold text-[14px] leading-[24px] text-white">신청서 작성하기</span>
        </button>
      </div>
    </div>
  );
}