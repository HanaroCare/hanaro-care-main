'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DualActionFooter from '@/components/modules/DualActionFooter';
import Header from '@/components/navigation/Header';
import InfoBox from '../../../../components/modules/InfoBox';
import TrustProgressBar from '../../components/trust/TrustProgressBar';
import TrustStepLayout from '../../components/trust/TrustStepLayout';

const agents = [
  { id: 'spouse', initial: '권', name: '권하나', role: '배우자' },
  { id: 'child', initial: '김', name: '김유연', role: '자녀' },
];

export default function SelectAgentPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <TrustStepLayout
      footer={
        <DualActionFooter
          leftLabel="지금 안할래요"
          rightLabel="결과보기"
          rightDisabled={!selected}
          onLeftClick={() => router.push('/asset/trust/result')}
          onRightClick={() => router.push('/asset/trust/result')}
        />
      }
    >
      <Header title="내맘대로신탁" />

      <section className="px-6 pt-8">
        <TrustProgressBar step={6} />

        <div className="mt-14">
          <h2 className="font-bold text-[22px] text-black leading-[1.45] tracking-tight">
            지급청구대리인을
            <br />
            지정해주세요
          </h2>
          <p className="mt-4 font-normal text-[#6A7282] text-[12px] leading-5 tracking-snug">
            신탁 가입 시 영업점에 같이 가야해요
          </p>
        </div>

        <div className="mt-11 flex flex-col gap-5">
          {agents.map((agent) => {
            const isSelected = selected === agent.id;
            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => setSelected(agent.id)}
                className={`flex items-center rounded-[28px] px-6 py-7 text-left shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition ${
                  isSelected
                    ? 'border border-hana-ez-600 bg-[#F5FFFE]'
                    : 'border border-[#F2F3F5] bg-white'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E9F8F9] font-semibold text-[20px] text-hana-ez-600 leading-none tracking-tight">
                  {agent.initial}
                </div>
                <div className="ml-5 flex items-center gap-3">
                  <p className="font-semibold text-[16px] text-black leading-6 tracking-tight">
                    {agent.name}
                  </p>
                  <span className="rounded-full bg-[#E9F8F9] px-3 py-1 font-medium text-[12px] text-hana-ez-600 leading-4.5 tracking-snug">
                    {agent.role}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <InfoBox
          title="지급청구대리인이란?"
          desc="부득이한 경우, 본인이 자산 관리(운용/집행 등)를 하지 못할 때 사전 지정한 지급청구대리인이 관리를 할 수 있어요."
          className="mt-5"
        />
      </section>
    </TrustStepLayout>
  );
}
