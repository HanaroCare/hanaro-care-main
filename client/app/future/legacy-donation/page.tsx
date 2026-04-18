'use client';

import { ChevronRight } from 'lucide-react';
import { Route } from 'next';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/Header';

const stats = [
  { value: '2,847명', label: '기부자 수' },
  { value: '156억원', label: '누적 기부액' },
  { value: '98.2%', label: '유언 실행률' },
];

const howToSteps = [
  {
    step: 1,
    title: '기부 의사 결정',
    desc: '소중한 자산을 사회에 환원하기로 마음먹어요',
  },
  { step: 2, title: '단체 선택', desc: '기부하고 싶은 단체나 기관을 선택해요' },
  {
    step: 3,
    title: '유언장 작성',
    desc: '공증인 사무소 / 법무사 사무소 방문하여 법률적으로 공증된 유언장을 작성해요',
  },
  {
    step: 4,
    title: '유언 집행',
    desc: '유언 집행인이 유언 내용대로 기부를 실행해요',
  },
];

const tags = ['법무 검토', '절차 처리 동행 서비스', '세제 혜택'];

export default function LegacyDonationPage() {
  const router = useRouter();

  return (
    <div className="relative w-full min-h-screen bg-[#F6F7F8] flex flex-col">
      <Header title="유산기부" onBack={() => router.push("/my" as Route)} />

      <div className="flex flex-col pb-[40px] pt-[65px]">
        {/* 상단 배너 */}
        <div
          onClick={() => router.push("/future/legacy-donation/consult" as Route)}
          className="mx-[25px] mt-[18px] rounded-2xl px-[25px] py-[20px] relative overflow-hidden cursor-pointer"
          style={{
            background: 'linear-gradient(90deg, #008585 0%, #02A3AC 100%)',
            minHeight: '157px',
          }}
        >
          {/* 태그 */}
          <div className="inline-flex items-center px-[15px] py-[3px] rounded-full bg-white/30 mb-[12px]">
            <span className="font-medium text-[11px] leading-[16px] text-white">
              하나실버 케어 서비스
            </span>
          </div>

          {/* 제목 */}
          <div className="flex flex-col gap-0">
            <span className="font-bold text-[20px] leading-[25px] text-white">
              당신의 이름이
            </span>
            <span className="font-bold text-[20px] leading-[25px] text-white">
              누군가의 희망이 됩니다
            </span>
          </div>
          <p
            className="font-normal text-[13px] leading-[20px] mt-[8px]"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            소중한 자산이 더 나은 세상을 만듭니다
          </p>

          {/* 화살표 */}
          <div className="absolute right-[20px] top-[50%] -translate-y-1/2">
            <ChevronRight size={20} color="#E5E5E5" />
          </div>
        </div>

        {/* STORY */}
        <div className="mx-[25px] mt-[28px]">
          <span className="font-medium text-[13px] leading-[20px] text-[#535C6A]">
            STORY
          </span>
          <div className="mt-[8px] bg-white border border-[#E3E5E8] rounded-xl px-[19px] py-[22px]">
            <p className="font-normal text-[15px] leading-[23px] text-[#1A212D]">
              "평생 모은 재산이 누군가의 교육비가 되고, 치료비가 된다고 생각하니
              마음이 따뜻해졌어요."
            </p>
            <p className="font-normal text-[12px] leading-[18px] text-[#535C6A] mt-[8px] text-right">
              — 김○○님, 72세
            </p>
          </div>
        </div>

        {/* 통계 */}
        <div className="flex flex-row gap-[9px] mx-[25px] mt-[16px]">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex-1 flex flex-col items-center justify-center py-[12px] rounded-xl"
              style={{ backgroundColor: 'rgba(0,133,133,0.05)' }}
            >
              <span className="font-bold text-[16px] leading-[24px] text-[#F04452]">
                {stat.value}
              </span>
              <span className="font-normal text-[11px] leading-[16px] text-[#535C6A] mt-[4px]">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* HOW TO */}
        <div className="mx-[25px] mt-[40px]">
          <span className="font-medium text-[13px] leading-[20px] text-[#535C6A]">
            HOW TO
          </span>
          <div className="flex flex-col gap-[16px] mt-[16px]">
            {howToSteps.map((item) => (
              <div
                key={item.step}
                className="flex flex-row items-start gap-[12px]"
              >
                <div className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#008585] shrink-0">
                  <span className="font-bold text-[13px] text-white">
                    {item.step}
                  </span>
                </div>
                <div className="flex flex-col gap-[1px]">
                  <span className="font-medium text-[14px] leading-[21px] text-[#1A212D]">
                    {item.title}
                  </span>
                  <span className="font-normal text-[12px] leading-[18px] text-[#535C6A]">
                    {item.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 배너 */}
        <div
          className="mx-[25px] mt-[40px] rounded-2xl px-[20px] py-[20px]"
          style={{
            background: 'linear-gradient(90deg, #008585 0%, #02A3AC 100%)',
            minHeight: '141px',
          }}
        >
          <p className="font-bold text-[15px] leading-[22px] text-white">
            유산기부, 법적으로 확실하게 남기는 방법
          </p>
          <div className="flex flex-row flex-wrap gap-[5px] mt-[10px]">
            {tags.map((tag) => (
              <div
                key={tag}
                className="px-[15px] py-[5px] rounded-full bg-white/30"
              >
                <span
                  className="font-normal text-[11px] leading-[16px]"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  {tag}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/future/legacy-donation/consult" as Route)}
            className="flex flex-row items-center gap-[4px] mt-[14px]"
          >
            <span className="font-medium text-[13px] leading-[20px] text-white">
              자세히 알아보기
            </span>
            <ChevronRight size={14} color="white" />
          </button>
        </div>

        {/* 상담 예약하기 버튼 */}
        <div className="mx-[25px] mt-[40px]">
          <button
            onClick={() =>
              router.push('/future/legacy-donation/consult' as Route)
            }
            className="w-full h-[53px] rounded-[10px] font-medium text-[16px] text-white"
            style={{ backgroundColor: '#01A5AC' }}
          >
            상담 예약하기
          </button>
        </div>
      </div>
    </div>
  );
}
