'use client';

import { useRouter } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { Route } from 'next';
import { use } from 'react';
import Header from '@/components/Header';

interface DetailItem {
  label: string;
  value: string;
}

interface SupportDetail {
  id: number;
  title: string;
  subtitle: string;
  details: DetailItem[];
  applyUrl: string;
}

const supportDetails: Record<number, SupportDetail> = {
  1: {
    id: 1,
    title: '돌봄플러스 케어',
    subtitle: '65세 이상 독거노인 대상 맞춤형 돌봄 서비스입니다.',
    details: [
      { label: '대상', value: '만 65세 이상 독거노인 (기초생활수급자 우선)' },
      { label: '혜택 내용', value: '주 3회 방문 케어, 생활 상담, 건강 체크, 응급 연락 서비스' },
      { label: '신청 방법', value: '관할 주민센터 방문 또는 복지로(www.bokjiro.go.kr) 온라인 신청' },
    ],
    applyUrl: 'https://www.bokjiro.go.kr',
  },
  2: {
    id: 2,
    title: '노인 맞춤 돌봄',
    subtitle: '일상생활 지원이 필요한 어르신에게 안전지원, 사회참여 서비스를 제공합니다.',
    details: [
      { label: '대상', value: '만 65세 이상 국민기초생활수급자, 차상위계층' },
      { label: '혜택 내용', value: '안전지원, 사회참여, 생활교육, 일상생활 지원 서비스' },
      { label: '신청 방법', value: '관할 주민센터 방문 또는 복지로 온라인 신청' },
    ],
    applyUrl: 'https://www.bokjiro.go.kr',
  },
};

export default function SupportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = use(params);
  const id = Number(idParam);
  const detail = supportDetails[id];

  if (!detail) return null;

  return (
    <div className="relative w-full min-h-screen bg-white flex flex-col">
      <Header title="나를 위한 제도" />

      <div className="flex flex-col flex-1 px-[25px] pt-[65px]">
        <h1 className="font-bold text-[22px] leading-[33px] text-[#1A212D] mt-[87px]">{detail.title}</h1>
        <p className="font-normal text-[14px] leading-[21px] text-[#535C6A] mt-[8px]">{detail.subtitle}</p>

        <div className="border border-[#E3E5E8] rounded-xl px-[17px] py-[24px] mt-[40px] flex flex-col gap-[25px]">
          {detail.details.map((item) => (
            <div key={item.label} className="flex flex-col gap-[3px]">
              <span className="font-semibold text-[13px] leading-[21px] text-[#1A212D]">{item.label}</span>
              <span className="font-normal text-[12px] leading-[21px] text-[#6B7280]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-[25px] pb-[40px]">
        <button
          onClick={() => window.open(detail.applyUrl, '_blank')}
          className="flex flex-row items-center justify-center gap-[8px] w-full h-[53px] rounded-[10px] font-semibold text-[16px] text-white"
          style={{ backgroundColor: '#01A5AC' }}
        >
          <ExternalLink size={16} color="white" />
          신청하기
        </button>
      </div>
    </div>
  );
}