'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import {
  type FamilyMember,
  getFamilyMembers,
  saveTrustSimulation,
} from '@/app/asset/actions/trust';
import { useTrustForm } from '@/app/asset/trust/TrustFormContext';
import DualActionFooter from '@/components/modules/DualActionFooter';
import InfoBox from '@/components/modules/InfoBox';
import TrustWizardStep from '../TrustWizardStep';

export default function SelectAgentStep() {
  const router = useRouter();
  const { form, setSelectedAgent } = useTrustForm();

  const [selected, setSelected] = useState<string | null>(form.selectedAgent);
  const [isPending, startTransition] = useTransition();

  const [familyList, setFamilyList] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFamilyMembers()
      .then((list) => {
        const filtered = list.filter((item) => !item.isMe);
        setFamilyList(filtered);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = (agentId: string | null) => {
    setSelectedAgent(agentId);

    startTransition(async () => {
      await saveTrustSimulation({ ...form, selectedAgent: agentId });
      router.push('/asset/trust/result');
    });
  };

  return (
    <TrustWizardStep
      step={6}
      footer={
        <DualActionFooter
          leftLabel="지금 안할래요"
          rightLabel="설계결과 보기"
          rightDisabled={!selected || isPending}
          onLeftClick={() => handleSubmit(null)}
          onRightClick={() => handleSubmit(selected)}
        />
      }
    >
      {/* 제목 */}
      <div className="mt-12">
        <h2 className="font-bold text-[22px] text-black leading-[1.45] tracking-tight">
          지급청구대리인을
          <br />
          지정해주세요
        </h2>

        <p className="mt-4 text-[15px] leading-5 text-[#6A7282]">
          신탁 가입 시 영업점에 같이 가야해요
        </p>
      </div>

      {/* 리스트 */}
      <div
        className="mt-10 flex flex-col gap-5"
        role="radiogroup"
        aria-label="지급청구대리인 선택"
      >
        {isLoading && <p className="text-sm text-gray-400">불러오는 중...</p>}

        {!isLoading && familyList.length === 0 && (
          <p className="text-sm text-gray-400">등록된 가족이 없습니다.</p>
        )}

        {familyList.map((member) => {
          const isSelected = selected === String(member.userId);

          return (
            <button
              key={member.userId}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setSelected(String(member.userId))}
              className={`flex items-center rounded-[28px] px-6 py-5 text-left shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition ${
                isSelected
                  ? 'border border-hana-ez-600 bg-[#F5FFFE]'
                  : 'border border-[#F2F3F5] bg-white'
              }`}
            >
              {/* 이니셜 */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E9F8F9] text-[20px] font-semibold text-hana-ez-600">
                {member.name?.charAt(0)}
              </div>

              {/* 이름 + 관계 */}
              <div className="ml-5 flex items-center gap-3">
                <p className="text-[16px] font-semibold text-black">
                  {member.name}
                </p>

                <span className="rounded-full bg-[#E9F8F9] px-3 py-1 text-[12px] text-hana-ez-600">
                  {member.relation}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 설명 */}
      <InfoBox
        title="지급청구대리인이란?"
        desc={`본인이 자산 관리를 하지 못할 때,\n사전 지정한 대리인이 관리할 수 있어요.`}
        className="mt-17"
      />
    </TrustWizardStep>
  );
}
