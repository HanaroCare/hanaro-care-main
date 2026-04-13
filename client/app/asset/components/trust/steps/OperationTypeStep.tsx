'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PrimaryButton from '@/components/baseelements/PrimaryButton';
import TrustChoiceStep from '../TrustChoiceStep';
import TrustWizardStep from '../TrustWizardStep';

const options = [
  {
    id: 'managed',
    emoji: '🧑‍💼',
    title: '일임형',
    highlight: '연평균 3.5~5%',
    desc: '전문가가 운용',
    recommended: true,
  },
  {
    id: 'self',
    emoji: '🧑‍💼',
    title: '직접 운용',
    highlight: '운용 방식에 따라 다름',
    desc: '내가 원하는대로 운용',
  },
] as const;

type OperationType = (typeof options)[number]['id'];

const infoBoxByType: Record<OperationType, { title: string; desc: string }> = {
  managed: {
    title: '일임형이란?',
    desc: '전문가가 채권, 주식, 펀드를 나눠서 자산을 운용해줍니다. 매 분기 결과를 앱에서 확인할 수 있습니다.',
  },
  self: {
    title: '직접 운용이란?',
    desc: '원하는 자산과 비중을 직접 선택해 운용합니다. 운용 결과는 선택 전략에 따라 달라질 수 있습니다.',
  },
};

export default function OperationTypeStep() {
  const router = useRouter();
  const [selected, setSelected] = useState<OperationType>('managed');

  return (
    <TrustWizardStep
      step={3}
      footer={
        <footer className="shrink-0 bg-white px-6 pb-8 pt-10">
          <PrimaryButton
            label="다음으로"
            onClick={() => router.push('/asset/trust/payout-type')}
          />
        </footer>
      }
    >
      <TrustChoiceStep
        question={
          <>
            어떤 형태로
            <br />
            자산을 굴릴까요?
          </>
        }
        options={options}
        selected={selected}
        onSelect={(id) => setSelected(id as OperationType)}
        infoBox={infoBoxByType[selected]}
      />
    </TrustWizardStep>
  );
}
